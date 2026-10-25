import { Check } from 'lucide-react'
import type { Cuisine, Diet } from '../types'
import { CUISINES, DIETS } from '../data/meta'

export const isCuisine = (v: string | null): v is Cuisine => !!v && CUISINES.some((c) => c.id === v)
export const parseDiets = (v: string | null): Diet[] =>
  (v ?? '')
    .split(',')
    .filter((d): d is Diet => DIETS.some((x) => x.id === d))

interface Props {
  cuisine: Cuisine | ''
  diets: Diet[]
  onCuisine: (c: Cuisine | '') => void
  onDiets: (d: Diet[]) => void
}

/** Keuken (select) en dieet (combineerbare knoppen). */
export function ExtraFilters({ cuisine, diets, onCuisine, onDiets }: Props) {
  const toggle = (d: Diet) => {
    const next = diets.includes(d) ? diets.filter((x) => x !== d) : [...diets, d]
    // Vegan impliceert vegetarisch, dus beide tegelijk is overbodig maar niet fout.
    onDiets(next)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="keuken" className="text-sm font-semibold text-ink-soft">
          Keuken
        </label>
        <select
          id="keuken"
          value={cuisine}
          onChange={(e) => onCuisine(e.target.value as Cuisine | '')}
          className="rounded-full border-2 border-line bg-surface px-4 py-2 text-sm font-semibold focus:border-brand-500"
        >
          <option value="">Alle keukens</option>
          {CUISINES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div role="group" aria-label="Filter op dieet" className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink-soft" aria-hidden>
          Dieet
        </span>
        {DIETS.map((d) => {
          const active = diets.includes(d.id)
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(d.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? 'border-emerald-600 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200'
                  : 'border-line bg-surface hover:border-emerald-600'
              }`}
            >
              {active && <Check className="h-4 w-4" aria-hidden />}
              {d.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
