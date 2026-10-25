import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, SearchX } from 'lucide-react'
import { useAllRecipes } from '../hooks/useAllRecipes'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CategoryFilter, isFilter } from '../components/CategoryFilter'
import type { Filter } from '../components/CategoryFilter'
import { ExtraFilters, isCuisine, parseDiets } from '../components/ExtraFilters'
import type { Cuisine, Diet } from '../types'
import { SearchBar } from '../components/SearchBar'
import { SushiLanding } from '../components/SushiLanding'
import { RecipeCard } from '../components/RecipeCard'
import { Button } from '../components/Button'
import { normalize } from '../lib/format'
import type { Difficulty, Recipe } from '../types'

type Sort = '' | 'tijd' | 'moeilijkheid'
const diffRank: Record<Difficulty, number> = { Makkelijk: 0, Gemiddeld: 1, Uitdagend: 2 }
const PAGE_SIZE = 12

function matches(r: Recipe, q: string) {
  if (!q) return true
  const hay = normalize(
    [r.title, r.description, r.tags.join(' '), r.ingredients.map((i) => i.name).join(' '), r.cuisine ?? ''].join(' '),
  )
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word))
}

const hasDiet = (r: Recipe, d: Diet) => {
  const list = r.diet ?? []
  if (d === 'vegetarisch') return list.includes('vegetarisch') || list.includes('vegan')
  return list.includes(d)
}

export default function Recipes() {
  const [params, setParams] = useSearchParams()
  const { recipes, loaded } = useAllRecipes()
  const [visible, setVisible] = useState(PAGE_SIZE)
  useDocumentMeta('Recepten', 'Bekijk alle Cookify-recepten. Filter op categorie, keuken, dieet of bereidingstijd en zoek op gerecht, ingrediënt of tag.')

  const rawFilter = params.get('categorie')
  const filter: Filter = isFilter(rawFilter) ? rawFilter : 'alles'
  const rawCuisine = params.get('keuken')
  const cuisine: Cuisine | '' = isCuisine(rawCuisine) ? rawCuisine : ''
  const diets = parseDiets(params.get('dieet'))
  const query = params.get('zoek') ?? ''
  const sort: Sort = params.get('sorteer') === 'tijd' ? 'tijd' : params.get('sorteer') === 'moeilijkheid' ? 'moeilijkheid' : ''

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v && v !== 'alles' ? next.set(k, v) : next.delete(k)))
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    let list = recipes.filter((r) => {
      if (filter === 'snel' && r.totalTime >= 20) return false
      if (filter !== 'alles' && filter !== 'snel' && r.category !== filter) return false
      if (cuisine && r.cuisine !== cuisine) return false
      if (diets.some((d) => !hasDiet(r, d))) return false
      return matches(r, query)
    })
    if (sort === 'tijd') list = [...list].sort((a, b) => a.totalTime - b.totalTime)
    if (sort === 'moeilijkheid') list = [...list].sort((a, b) => diffRank[a.difficulty] - diffRank[b.difficulty])
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, filter, cuisine, diets.join(','), query, sort])

  // Terug naar de eerste pagina zodra de selectie verandert.
  const key = `${filter}|${cuisine}|${diets.join(',')}|${query}|${sort}`
  useEffect(() => setVisible(PAGE_SIZE), [key])

  const shown = results.slice(0, visible)
  const hasFilters = filter !== 'alles' || cuisine !== '' || diets.length > 0 || query !== '' || sort !== ''

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-700">Recepten</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Wat ga je vandaag koken?</h1>
        <p className="mt-3 text-lg text-ink-soft">Filter op categorie, keuken of dieet, of zoek op gerecht, ingrediënt en tag.</p>
      </header>

      <div className="mt-8 space-y-4">
        <SearchBar value={query} onChange={(v) => update({ zoek: v })} />
        <CategoryFilter value={filter} onChange={(f) => update({ categorie: f })} />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ExtraFilters
            cuisine={cuisine}
            diets={diets}
            onCuisine={(c) => update({ keuken: c })}
            onDiets={(d) => update({ dieet: d.join(',') })}
          />
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

      {filter === 'sushi' && <SushiLanding />}

      <p className="mt-8 text-sm font-semibold text-ink-soft" role="status" aria-live="polite" data-testid="result-count">
        {loaded ? `${results.length} ${results.length === 1 ? 'recept' : 'recepten'} gevonden` : 'Recepten laden…'}
      </p>

      {!loaded ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i} className="card h-80 animate-pulse bg-muted" />
          ))}
        </ul>
      ) : results.length > 0 ? (
        <>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i % PAGE_SIZE, 8) * 0.03 }}
              >
                <RecipeCard recipe={r} />
              </motion.li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-ink-soft" data-testid="shown-count">
              {shown.length} van {results.length} getoond
            </p>
            {shown.length < results.length && (
              <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Meer laden
                <ChevronDown className="h-5 w-5" aria-hidden />
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="card mt-6 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <SearchX className="h-8 w-8" aria-hidden />
          </span>
          <h2 className="text-2xl font-bold">Geen recepten gevonden</h2>
          <p className="max-w-md text-ink-soft">
            Probeer een andere zoekterm of haal een filter weg. Er staat vast iets lekkers tussen.
          </p>
          {hasFilters && <Button onClick={() => setParams({}, { replace: true })}>Wis filters</Button>}
        </div>
      )}
    </div>
  )
}
