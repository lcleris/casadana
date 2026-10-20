import { useMemo } from "react"

import { useBaseNightlyEuros } from "@/lib/use-base-nightly-euros"
import { usePublishedRating } from "@/lib/use-published-rating"
import { m } from "@/paraglide/messages"
import { getLocale } from "@/paraglide/runtime"

interface Stat {
  label: string
  value: string
}

/**
 * A cell of the hero band is either editorial — the display italic the villa's
 * own stats use — or the tourist licence. The licence keeps a monospaced,
 * tabular face on purpose: the display italic makes digits, dots and hyphens
 * ambiguous, which is the one thing a registration number can't afford. The
 * difference in face is the signal that this cell is an official record rather
 * than another selling point.
 */
type BandCellKind = "editorial" | "licence"

interface BandCell extends Stat {
  kind: BandCellKind
}

// The licence's top margin is larger than the editorial one so that the two
// sit on a shared baseline despite the ten-point difference in body size.
const BAND_VALUE_CLASS: Record<BandCellKind, string> = {
  editorial: "font-display mt-1.5 text-xl italic md:text-[22px]",
  licence: "mt-[13px] font-mono text-[12px] tracking-[0.02em] tabular-nums",
}

/**
 * The band stays a single row on desktop: its vertical rules are keyed on
 * `i !== 0`, so a second row would inherit a stray left rule on its first cell.
 */
const BAND_COLUMNS: Record<number, string> = {
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
}

/**
 * The last stat of the band: this villa's rating, read from its own approved
 * reviews so the hero, the booking panel and the reviews section below can only
 * ever quote the same figure.
 *
 * With no approved review — and while the query is in flight — the score is a
 * plain 0 rather than an invented average.
 */
function useRatingStat(villaSlug: string): Stat {
  const rating = usePublishedRating(villaSlug)
  const score = rating?.score ?? 0
  const scoreFormat = useMemo(
    () => new Intl.NumberFormat(getLocale(), { maximumFractionDigits: 2 }),
    [],
  )

  return {
    label: m.villa_hero_stat_rating_label(),
    value: m.villa_hero_stat_rating_value({
      score: scoreFormat.format(score),
    }),
  }
}

// Rating and licence close the band together: they are the two cells that
// vouch for the villa rather than sell it. A villa with no registration
// number on file drops the cell instead of showing a blank one.
function buildBandCells(stats: Array<Stat>, ratingStat: Stat, licence: string | undefined) {
  const licenceCells: Array<BandCell> =
    licence !== undefined && licence !== ""
      ? [{ label: m.villa_hero_stat_licence_label(), value: licence, kind: "licence" }]
      : []
  return [
    ...stats.map((stat) => ({ ...stat, kind: "editorial" as const })),
    { ...ratingStat, kind: "editorial" as const },
    ...licenceCells,
  ]
}

// Only the first cell has no left rule; every cell but the last row gets a
// bottom rule on mobile, where the band wraps to two columns.
function bandCellClass(index: number, count: number): string {
  const leftRule = index === 0 ? "" : "md:border-l md:border-white/20"
  const lastRowStart = count - (count % 2 === 0 ? 2 : 1)
  const bottomRule =
    index < lastRowStart ? "border-b border-white/20 pb-3 md:border-b-0 md:pb-0" : ""
  return `px-4 md:px-7 ${leftRule} ${bottomRule}`
}

function HeroBand({ cells }: { cells: Array<BandCell> }) {
  return (
    <div
      className={`grid grid-cols-2 border-y border-white/25 py-5 md:py-6 ${
        BAND_COLUMNS[cells.length] ?? BAND_COLUMNS[5]
      }`}
    >
      {cells.map((cell, i) => (
        <div key={cell.label} className={bandCellClass(i, cells.length)}>
          <div className="font-mono text-[10px] tracking-[0.22em] text-white/70 uppercase">
            {cell.label}
          </div>
          <div className={BAND_VALUE_CLASS[cell.kind]}>{cell.value}</div>
        </div>
      ))}
    </div>
  )
}

interface VillaHeroProps {
  villaSlug: string
  image: string
  eyebrow: Array<string>
  titlePrefix: string
  titleItalic: string
  titleSuffix: string
  stats: Array<Stat>
  price: number
  priceLabel: string
  licence?: string
}

export default function VillaHero({
  villaSlug,
  image,
  eyebrow,
  titlePrefix,
  titleItalic,
  titleSuffix,
  stats,
  price,
  priceLabel,
  licence,
}: VillaHeroProps) {
  const amount = useBaseNightlyEuros(villaSlug, price)
  // The villa's own stats are static facts (sleeps, bedrooms, surface…); the
  // rating is the one figure that has to be read from the approved reviews.
  const ratingStat = useRatingStat(villaSlug)
  const cells = buildBandCells(stats, ratingStat, licence)

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden text-white md:min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={`${titlePrefix}${titleItalic}`}
          className="h-full w-full object-cover"
          style={{ animation: "float-bg 22s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(23.6% 0.108 253 / 0.45) 0%, oklch(23.6% 0.108 253 / 0.05) 35%, oklch(23.6% 0.108 253 / 0.6) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid h-full max-w-[1440px] grid-rows-[1fr_auto_auto] items-end px-6 pt-24 md:px-10 md:pt-32">
        <div>
          <div className="mb-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {eyebrow.map((line) => (
              <span
                key={line}
                className="font-mono text-[11px] tracking-[0.22em] text-white/85 uppercase"
              >
                {line}
              </span>
            ))}
          </div>
          <h1
            className="font-display mb-8 text-[clamp(64px,9vw,156px)] leading-[0.88] font-light tracking-[-0.035em] md:mb-14"
            style={{
              fontVariationSettings: '"SOFT" 40',
              textShadow: "0 2px 24px oklch(23.6% 0.108 253 / 0.35)",
            }}
          >
            {titlePrefix}
            <em className="italic-display">{titleItalic}</em>
            <br />
            <span className="text-[0.6em] md:text-[0.55em]">{titleSuffix}</span>
          </h1>
        </div>

        <HeroBand cells={cells} />

        <div className="flex flex-col items-start justify-between gap-4 py-7 md:flex-row md:items-center md:py-8">
          <div className="font-display text-[26px] italic md:text-[28px]">
            €{amount}
            <small className="ml-1 font-sans text-[12px] tracking-[0.05em] text-white/75 not-italic">
              {priceLabel}
            </small>
          </div>
          <a
            href="#about"
            className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase"
          >
            <span>{m.villa_hero_scroll()}</span>
            <span className="relative h-px w-16 overflow-hidden bg-white/40">
              <span
                className="absolute inset-0 origin-left bg-white"
                style={{ animation: "scroll-cue 2.4s ease-in-out infinite" }}
              />
            </span>
            <span>{m.villa_hero_discover()}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
