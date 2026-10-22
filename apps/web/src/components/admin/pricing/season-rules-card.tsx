import {
  getListVillaSeasonRulesQueryKey,
  useCreateVillaSeasonRule,
  useDeleteSeasonRule,
  useGetVillaPricingSettings,
  useListVillaSeasonRules,
  usePatchSeasonRule,
} from "@casa-dana/api"
import type { PatchSeasonRuleRequest, SeasonRule } from "@casa-dana/api"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Plus } from "lucide-react"

import { AdminCard } from "@/components/admin/ui/admin-card"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

import { defaultBasePriceCents } from "./defaults"
import type { Property } from "./defaults"
import { RuleRow } from "./rule-row"

// Same default as the base-rate card, so a villa nobody has configured yet
// still starts its first rule on a real price instead of €0.
function newRulePriceCents(configuredBasePrice: number | undefined, property: Property): number {
  return configuredBasePrice !== undefined && configuredBasePrice !== 0
    ? configuredBasePrice
    : defaultBasePriceCents(property)
}

const NO_RULES: Array<SeasonRule> = []

interface SeasonRulesContentProps {
  rules: Array<SeasonRule> | undefined
  isPending: boolean
  onSave: (id: string, patch: PatchSeasonRuleRequest) => void
  onDelete: (id: string) => void
}

function SeasonRulesContent({
  rules = NO_RULES,
  isPending,
  onSave,
  onDelete,
}: SeasonRulesContentProps) {
  if (isPending) {
    return <EmptyState message="Chargement…" />
  }
  if (rules.length === 0) {
    return <EmptyState message="Aucune règle saisonnière pour le moment." />
  }
  return (
    <div className="flex flex-col gap-3 p-5">
      {rules.map((rule) => (
        <RuleRow
          key={rule.id}
          rule={rule}
          onSave={(patch) => {
            onSave(rule.id, patch)
          }}
          onDelete={() => {
            onDelete(rule.id)
          }}
        />
      ))}
    </div>
  )
}

interface SeasonRulesCardProps {
  property: Property
}

export default function SeasonRulesCard({ property }: SeasonRulesCardProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { data, isPending } = useListVillaSeasonRules(property)
  // Deduped with the base-pricing card's own query; a new rule starts at the
  // villa's current base price.
  const { data: settings } = useGetVillaPricingSettings(property)

  // The slug is baked into the URL-shaped query key, so it has to be passed
  // here — a no-arg call would build a key matching nothing.
  const rulesQueryKey = getListVillaSeasonRulesQueryKey(property)

  const { mutate: createRule } = useCreateVillaSeasonRule({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: rulesQueryKey })
        toast("Règle ajoutée")
      },
      onError: () => {
        toast("Impossible d'ajouter la règle")
      },
    },
  })

  const { mutate: patchRule } = usePatchSeasonRule({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: rulesQueryKey })
        toast("Règle mise à jour")
      },
      onError: () => {
        toast("Impossible de mettre à jour la règle")
      },
    },
  })

  const { mutate: deleteRule } = useDeleteSeasonRule({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: rulesQueryKey })
        toast("Règle supprimée")
      },
      onError: () => {
        toast("Impossible de supprimer la règle")
      },
    },
  })

  const handleAdd = () => {
    const today = format(new Date(), "yyyy-MM-dd")
    createRule({
      slug: property,
      data: {
        label: "Nouvelle règle",
        start_date: today,
        end_date: today,
        price_cents: newRulePriceCents(settings?.base_price_cents, property),
      },
    })
  }

  const handleSave = (id: string, patch: PatchSeasonRuleRequest) => {
    patchRule({ id, data: patch })
  }

  return (
    <AdminCard
      title="Règles saisonnières"
      sub="Sur une date couverte par plusieurs règles, la plus chère l'emporte."
      flush
      action={
        <Button type="button" size="sm" variant="outline" onClick={handleAdd}>
          <Plus />
          Ajouter une règle
        </Button>
      }
    >
      <SeasonRulesContent
        rules={data?.rules}
        isPending={isPending}
        onSave={handleSave}
        onDelete={(id) => {
          deleteRule({ id })
        }}
      />
    </AdminCard>
  )
}
