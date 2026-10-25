import { Link } from 'react-router-dom'
import { ListOrdered, Users } from 'lucide-react'
import type { Recipe } from '../types'
import { categoryLabel } from '../data/meta'
import { SmartImage } from './SmartImage'
import { DifficultyBadge, TimeBadge } from './Badges'
import { FavoriteButton } from './FavoriteButton'
import { SpiceLevelBadge } from './SpiceAndAllergens'

interface Props {
  recipe: Recipe
  variant?: 'default' | 'featured'
  eager?: boolean
}

export function RecipeCard({ recipe, variant = 'default', eager = false }: Props) {
  const featured = variant === 'featured'
  return (
    <article className="group relative h-full">
      <Link
        to={`/recepten/${recipe.slug}`}
        className="card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1"
        aria-label={`${recipe.title}, ${recipe.totalTime} minuten, ${recipe.difficulty}`}
      >
        <div className="overflow-hidden">
          <SmartImage
            src={recipe.image}
            alt={`${recipe.title}`}
            aspect={featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}
            width={featured ? 1000 : 700}
            eager={eager}
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        <div className={`flex flex-1 flex-col ${featured ? 'p-6' : 'p-5'}`}>
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <span>{categoryLabel(recipe.category)}</span>
            {recipe.custom && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 normal-case tracking-normal text-brand-700">
                Eigen recept
              </span>
            )}
          </div>
          <h3 className={`font-bold leading-tight ${featured ? 'text-2xl' : 'text-xl'}`}>{recipe.title}</h3>
          <p className={`mt-2 text-ink-soft ${featured ? 'line-clamp-3' : 'line-clamp-2'} text-sm`}>
            {recipe.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <TimeBadge minutes={recipe.totalTime} quick={recipe.totalTime < 20} />
            <DifficultyBadge difficulty={recipe.difficulty} />
            <SpiceLevelBadge level={recipe.pittig} />
            {featured && (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold ring-1 ring-line">
                  <ListOrdered className="h-3.5 w-3.5" aria-hidden />
                  {recipe.steps.length} stappen
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold ring-1 ring-line">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  {recipe.servings} porties
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
      <FavoriteButton slug={recipe.slug} title={recipe.title} className="absolute right-3 top-3 z-10" />
    </article>
  )
}
