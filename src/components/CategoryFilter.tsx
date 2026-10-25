import type { Category } from '../types'
import { CATEGORIES } from '../data/meta'

export type Filter = 'alles' | Category | 'snel'

export const FILTER_OPTIONS: { id: Filter; label: string }[] = [
  { id: 'alles', label: 'Alle' },
  ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label })),
  { id: 'snel', label: 'Onder 20 min' },
]

export const isFilter = (v: string | null): v is Filter => !!v && FILTER_OPTIONS.some((o) => o.id === v)

interface Props {
  value: Filter
  onChange: (f: Filter) => void
}

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <div role="group" aria-label="Filter op categorie" className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex gap-2 sm:flex-wrap">
        {FILTER_OPTIONS.map((o) => {
          const active = o.id === value
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              aria-pressed={active}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                active
                  ? 'bg-brand-500 text-gray-900 shadow-soft'
                  : 'border border-line bg-surface text-ink hover:border-brand-500 hover:text-brand-700'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
