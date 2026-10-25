import { ALLERGENS, SPICE_LABELS } from '../data/meta'
import type { Allergen, SpiceLevel } from '../types'

/** Chili-icoontjes die de pittigheid tonen. Bij 0 wordt niets getoond. */
export function SpiceLevelBadge({ level, className = '', withLabel = false }: { level?: SpiceLevel; className?: string; withLabel?: boolean }) {
  if (!level) return null
  const label = SPICE_LABELS[level]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800 ring-1 ring-red-200 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-500/30 ${className}`}
      title={`Pittigheid: ${label}`}
    >
      <span aria-hidden className="tracking-tight">
        {'🌶️'.repeat(level)}
      </span>
      <span className={withLabel ? '' : 'sr-only'}>Pittigheid: {label}</span>
    </span>
  )
}

/** Kleine badges voor allergenen. */
export function AllergenBadges({ allergenen }: { allergenen?: Allergen[] }) {
  if (!allergenen || allergenen.length === 0) return null
  return (
    <div data-testid="allergenen" className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Allergenen">
      <span className="text-sm font-semibold text-ink-soft">Bevat:</span>
      {allergenen.map((a) => (
        <span
          key={a}
          className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-300 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-500/40"
        >
          {ALLERGENS.find((x) => x.id === a)?.label ?? a}
        </span>
      ))}
    </div>
  )
}
