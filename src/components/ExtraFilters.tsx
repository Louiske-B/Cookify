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
  nietPittig: boolean
  /** Verberg het keuken-filter (bv. op een keukenpagina, waar de keuken vaststaat). */
  hideCuisine?: boolean
  onCuisine: (c: Cuisine | '') => void
  onDiets: (d: Diet[]) => void
  onNietPittig: (v: boolean) => void
}

const chip = (active: boolean, color: 'green' | 'red') =>
  `inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors ${
    active
      ? color === 'green'
        ? 'border-emerald-600 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200'
        : 'border-red-600 bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-200'
      : `border-line bg-surface ${color === 'green' ? 'hover:border-emerald-600' : 'hover:border-red-600'}`
  }`

/** Keuken (select), dieet (combineerbare knoppen) en "Niet pittig". */
export function ExtraFilters({ cuisine, diets, nietPittig, hideCuisine, onCuisine, onDiets, onNietPittig }: Props) {
  const toggle = (d: Diet) => onDiets(diets.includes(d) ? diets.filter((x) => x !== d) : [...diets, d])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {!hideCuisine && (
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
      )}

      <div role="group" aria-label="Filter op dieet en pittigheid" className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink-soft" aria-hidden>
          Dieet
        </span>
        {DIETS.map((d) => {
          const active = diets.includes(d.id)
          return (
            <button key={d.id} type="button" aria-pressed={active} onClick={() => toggle(d.id)} className={chip(active, 'green')}>
              {active && <Check className="h-4 w-4" aria-hidden />}
              {d.label}
            </button>
          )
        })}
        <button type="button" aria-pressed={nietPittig} onClick={() => onNietPittig(!nietPittig)} className={chip(nietPittig, 'red')}>
          {nietPittig ? <Check className="h-4 w-4" aria-hidden /> : <span aria-hidden>🌶️</span>}
          Niet pittig
        </button>
      </div>
    </div>
  )
}
