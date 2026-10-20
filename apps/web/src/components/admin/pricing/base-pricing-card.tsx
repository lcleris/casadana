import {
  getGetVillaPricingSettingsQueryKey,
  useGetVillaPricingSettings,
  usePutVillaPricingSettings,
} from "@casa-dana/api"
import type { PricingSettings } from "@casa-dana/api"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { AdminCard } from "@/components/admin/ui/admin-card"
import { AdminField, FieldActions, FieldGrid } from "@/components/admin/ui/admin-field"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"

import { DEFAULT_MIN_NIGHTS, defaultBasePriceCents } from "./defaults"
import type { Property } from "./defaults"
import { centsToEuroInput, euroInputToCents } from "./money"

interface BasePricingForm {
  basePrice: string
  minNights: string
  cleaningFee: string
  conciergeFee: string
}

const EMPTY_FORM: BasePricingForm = {
  basePrice: "",
  minNights: "",
  cleaningFee: "",
  conciergeFee: "",
}

// An unset base rate or minimum stay opens on its default rather than on the
// zero the API reports for a villa nobody has configured yet. The two fees are
// left at zero on purpose: a villa that charges neither is a real answer, and
// the public panel already hides a zero fee.
function toForm(settings: PricingSettings, property: Property): BasePricingForm {
  return {
    basePrice: centsToEuroInput(settings.base_price_cents || defaultBasePriceCents(property)),
    minNights: String(settings.min_nights || DEFAULT_MIN_NIGHTS),
    cleaningFee: centsToEuroInput(settings.cleaning_fee_cents),
    conciergeFee: centsToEuroInput(settings.concierge_fee_cents),
  }
}

interface BasePricingDraft {
  source: PricingSettings | undefined
  form: BasePricingForm
}

interface BasePricingFieldSpec {
  key: keyof BasePricingForm
  label: string
  min: number
}

const FIELDS: Array<BasePricingFieldSpec> = [
  { key: "basePrice", label: "Prix de base par nuit (€)", min: 0 },
  { key: "minNights", label: "Nuits minimum", min: 1 },
  { key: "cleaningFee", label: "Frais de ménage (€)", min: 0 },
  { key: "conciergeFee", label: "Frais de conciergerie (€)", min: 0 },
]

function BasePricingFields({
  form,
  setField,
}: {
  form: BasePricingForm
  setField: (key: keyof BasePricingForm, value: string) => void
}) {
  return (
    <FieldGrid>
      {FIELDS.map(({ key, label, min }) => (
        <AdminField key={key} label={label} htmlFor={key}>
          <Input
            id={key}
            type="number"
            min={min}
            value={form[key]}
            onChange={(e) => {
              setField(key, e.target.value)
            }}
          />
        </AdminField>
      ))}
    </FieldGrid>
  )
}

function useBasePricingForm(property: Property, settings: PricingSettings | undefined) {
  const [draft, setDraft] = useState<BasePricingDraft | null>(null)

  // The server copy re-seeds the form whenever it changes — the first load, and
  // the refetch that follows a save: an edit only survives while it was made on
  // top of the settings currently loaded. Switching villa remounts the card.
  const seeded = settings === undefined ? EMPTY_FORM : toForm(settings, property)
  const form = draft !== null && draft.source === settings ? draft.form : seeded

  const setField = (key: keyof BasePricingForm, value: string) => {
    setDraft({ source: settings, form: { ...form, [key]: value } })
  }
  return { form, setField }
}

interface BasePricingCardProps {
  property: Property
}

export default function BasePricingCard({ property }: BasePricingCardProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { data: settings, isPending } = useGetVillaPricingSettings(property)
  const { form, setField } = useBasePricingForm(property, settings)

  const { mutate: saveSettings, isPending: isSaving } = usePutVillaPricingSettings({
    mutation: {
      onSuccess: () => {
        // The slug is baked into the URL-shaped query key, so it has to be
        // passed here — a no-arg call would build a key matching nothing.
        void queryClient.invalidateQueries({
          queryKey: getGetVillaPricingSettingsQueryKey(property),
        })
        toast("Tarifs enregistrés")
      },
      onError: () => {
        toast("Impossible d'enregistrer les tarifs")
      },
    },
  })

  const handleSave = () => {
    const minNights = Math.trunc(Number(form.minNights))
    saveSettings({
      slug: property,
      data: {
        base_price_cents: euroInputToCents(form.basePrice),
        // The field opens pre-filled, but it can still be cleared by hand and
        // the PUT schema rejects anything below 1 — floor it here.
        min_nights: Number.isFinite(minNights)
          ? Math.max(DEFAULT_MIN_NIGHTS, minNights)
          : DEFAULT_MIN_NIGHTS,
        cleaning_fee_cents: euroInputToCents(form.cleaningFee),
        concierge_fee_cents: euroInputToCents(form.conciergeFee),
      },
    })
  }

  return (
    <AdminCard
      title="Tarif de base et frais"
      sub="Appliqué dès qu'aucune règle saisonnière ne correspond."
      flush={isPending}
    >
      {isPending ? (
        <EmptyState message="Chargement…" />
      ) : (
        <>
          <BasePricingFields form={form} setField={setField} />
          <FieldActions>
            <Button type="button" disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Enregistrement…" : "Enregistrer le tarif de base"}
            </Button>
          </FieldActions>
        </>
      )}
    </AdminCard>
  )
}
