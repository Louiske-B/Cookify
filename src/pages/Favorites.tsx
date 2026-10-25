import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Trophy } from 'lucide-react'
import { useAllRecipes } from '../hooks/useAllRecipes'
import { useFavorites } from '../hooks/useFavorites'
import { useCompleted } from '../hooks/useProgress'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { RecipeCard } from '../components/RecipeCard'
import { Button } from '../components/Button'

export default function Favorites() {
  const { recipes } = useAllRecipes()
  const { favorites } = useFavorites()
  const { count } = useCompleted()
  useDocumentMeta('Favorieten', 'Je bewaarde Cookify-recepten, altijd binnen handbereik.')

  const saved = favorites.map((slug) => recipes.find((r) => r.slug === slug)).filter((r) => !!r)

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-700">Jouw verzameling</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Favorieten</h1>
          <p className="mt-3 text-lg text-ink-soft">
            {saved.length} {saved.length === 1 ? 'bewaard recept' : 'bewaarde recepten'}
          </p>
        </div>
        <div className="inline-flex items-center gap-3 self-start rounded-2xl bg-brand-50 px-5 py-3 ring-1 ring-brand-200 sm:self-auto" data-testid="completed-badge">
          <Trophy className="h-6 w-6 text-brand-700" aria-hidden />
          <div>
            <p className="font-display text-2xl font-bold leading-none">{count}</p>
            <p className="text-xs font-semibold text-ink-soft">{count === 1 ? 'recept voltooid' : 'recepten voltooid'}</p>
          </div>
        </div>
      </header>

      {saved.length === 0 ? (
        <div className="card mt-10 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Heart className="h-8 w-8" aria-hidden />
          </span>
          <h2 className="text-2xl font-bold">Nog geen favorieten</h2>
          <p className="max-w-md text-ink-soft">Tik op het hartje bij een recept om het hier te bewaren.</p>
          <Button to="/recepten">Ontdek recepten</Button>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {saved.map((r) => (
              <motion.li
                key={r!.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <RecipeCard recipe={r!} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
