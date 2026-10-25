import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { useAllRecipes } from '../hooks/useAllRecipes'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CategoryFilter, isFilter } from '../components/CategoryFilter'
import type { Filter } from '../components/CategoryFilter'
import { SearchBar } from '../components/SearchBar'
import { RecipeCard } from '../components/RecipeCard'
import { Button } from '../components/Button'
import { normalize } from '../lib/format'
import type { Difficulty, Recipe } from '../types'

type Sort = '' | 'tijd' | 'moeilijkheid'
const diffRank: Record<Difficulty, number> = { Makkelijk: 0, Gemiddeld: 1, Uitdagend: 2 }

function matches(r: Recipe, q: string) {
  if (!q) return true
  const hay = normalize([r.title, r.description, r.tags.join(' '), r.ingredients.map((i) => i.name).join(' ')].join(' '))
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word))
}

export default function Recipes() {
  const [params, setParams] = useSearchParams()
  const { recipes, loaded } = useAllRecipes()
  useDocumentMeta('Recepten', 'Bekijk alle Cookify-recepten. Filter op categorie of bereidingstijd en zoek op gerecht, ingrediënt of tag.')

  const rawFilter = params.get('categorie')
  const filter: Filter = isFilter(rawFilter) ? rawFilter : 'alles'
  const query = params.get('zoek') ?? ''
  const sort: Sort = params.get('sorteer') === 'tijd' ? 'tijd' : params.get('sorteer') === 'moeilijkheid' ? 'moeilijkheid' : ''

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v && v !== 'alles' ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    let list = recipes.filter((r) => {
      if (filter === 'snel') return r.totalTime < 20
      if (filter !== 'alles') return r.category === filter
      return true
    })
    list = list.filter((r) => matches(r, query))
    if (sort === 'tijd') list = [...list].sort((a, b) => a.totalTime - b.totalTime)
    if (sort === 'moeilijkheid') list = [...list].sort((a, b) => diffRank[a.difficulty] - diffRank[b.difficulty])
    return list
  }, [recipes, filter, query, sort])

  const hasFilters = filter !== 'alles' || query !== '' || sort !== ''

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-700">Recepten</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Wat ga je vandaag koken?</h1>
        <p className="mt-3 text-lg text-ink-soft">Filter op categorie of tijd, of zoek op gerecht, ingrediënt en tag.</p>
      </header>

      <div className="mt-8 space-y-4">
        <SearchBar value={query} onChange={(v) => update({ zoek: v })} />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CategoryFilter value={filter} onChange={(f) => update({ categorie: f })} />
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="sorteer" className="text-sm font-semibold text-ink-soft">
              Sorteer op
            </label>
            <select
              id="sorteer"
              value={sort}
              onChange={(e) => update({ sorteer: e.target.value })}
              className="rounded-full border-2 border-line bg-surface px-4 py-2 text-sm font-semibold focus:border-brand-500"
            >
              <option value="">Aanbevolen</option>
              <option value="tijd">Kortste tijd</option>
              <option value="moeilijkheid">Makkelijkst eerst</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm font-semibold text-ink-soft" role="status" aria-live="polite">
        {loaded || results.length ? `${results.length} ${results.length === 1 ? 'recept' : 'recepten'} gevonden` : 'Recepten laden…'}
      </p>

      {results.length > 0 ? (
        <motion.ul layout className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((r) => (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <RecipeCard recipe={r} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="card mt-6 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <SearchX className="h-8 w-8" aria-hidden />
          </span>
          <h2 className="text-2xl font-bold">Geen recepten gevonden</h2>
          <p className="max-w-md text-ink-soft">
            Probeer een andere zoekterm of haal een filter weg. Er staat vast iets lekkers tussen.
          </p>
          {hasFilters && (
            <Button onClick={() => setParams({}, { replace: true })}>Wis filters</Button>
          )}
        </div>
      )}
    </div>
  )
}
