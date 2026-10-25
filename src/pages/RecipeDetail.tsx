import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, ChefHat, Circle, Clock, Lightbulb, Minus, Plus, RotateCcw, Users } from 'lucide-react'
import { useAllRecipes } from '../hooks/useAllRecipes'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCheckedIngredients, useCompleted, useDoneSteps } from '../hooks/useProgress'
import { categoryLabel } from '../data/meta'
import { SmartImage } from '../components/SmartImage'
import { DifficultyBadge } from '../components/Badges'
import { FavoriteButton } from '../components/FavoriteButton'
import { Timer } from '../components/Timer'
import { Button } from '../components/Button'
import { Confetti } from '../components/Confetti'
import { RawFishWarning } from '../components/RawFishWarning'
import { useToast } from '../components/Toast'
import { formatMinutes, scaleIngredient } from '../lib/format'
import NotFound from './NotFound'
import type { Recipe } from '../types'

export default function RecipeDetail() {
  const { slug = '' } = useParams()
  const { recipes, loaded } = useAllRecipes()
  const recipe = recipes.find((r) => r.slug === slug)

  if (!recipe) {
    if (!loaded) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center" role="status">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
          <span className="sr-only">Recept laden…</span>
        </div>
      )
    }
    return <NotFound />
  }
  const basis = recipe.basisRecept ? recipes.find((r) => r.slug === recipe.basisRecept) : undefined
  return <Detail key={recipe.id} recipe={recipe} basis={basis} />
}

function Detail({ recipe, basis }: { recipe: Recipe; basis?: Recipe }) {
  const [servings, setServings] = useState(recipe.servings)
  const [celebrate, setCelebrate] = useState(false)
  const { checked, toggle: toggleIng, reset: resetIng } = useCheckedIngredients(recipe.slug)
  const { done, toggle: toggleStep, reset: resetSteps } = useDoneSteps(recipe.slug)
  const { markCompleted, isCompleted, count } = useCompleted()
  const { toast } = useToast()
  const factor = servings / recipe.servings
  const progress = Math.round((done.length / recipe.steps.length) * 100)
  const completed = isCompleted(recipe.slug)

  useDocumentMeta(recipe.title, `${recipe.description} Volg de stap-voor-stap tutorial op Cookify.`)

  useEffect(() => {
    if (!celebrate) return
    const id = window.setTimeout(() => setCelebrate(false), 3200)
    return () => window.clearTimeout(id)
  }, [celebrate])

  const finish = () => {
    markCompleted(recipe.slug)
    setCelebrate(true)
    toast({
      message: 'Smakelijk! Je bent weer een stapje dichter bij chef 👨‍🍳',
      duration: 6000,
    })
  }

  return (
    <article>
      {celebrate && <Confetti />}

      <div className="relative">
        <SmartImage
          src={recipe.image}
          alt={recipe.title}
          aspect="aspect-[4/3] sm:aspect-[16/7]"
          width={1600}
          sizes="100vw"
          eager
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-page pb-6 sm:pb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-200">
              {categoryLabel(recipe.category)}
              {recipe.custom && ' · Eigen recept'}
            </p>
            <h1 className="max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">{recipe.title}</h1>
          </div>
        </div>
      </div>

      <div className="container-page py-8 sm:py-10">
        <Link to="/recepten" className="mb-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-ink-soft hover:text-brand-700">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Alle recepten
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <p className="max-w-2xl flex-1 basis-full text-lg text-ink-soft lg:basis-0">{recipe.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold ring-1 ring-line">
              <Clock className="h-4 w-4" aria-hidden /> Totaal {formatMinutes(recipe.totalTime)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-semibold ring-1 ring-line">
              <Users className="h-4 w-4" aria-hidden /> {recipe.servings} porties
            </span>
            <DifficultyBadge difficulty={recipe.difficulty} className="!px-4 !py-2 !text-sm" />
            <FavoriteButton slug={recipe.slug} title={recipe.title} variant="inline" />
          </div>
        </div>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
          <div className="flex gap-1.5"><dt>Voorbereiden:</dt><dd className="font-semibold text-ink">{formatMinutes(recipe.prepTime)}</dd></div>
          <div className="flex gap-1.5"><dt>Koken:</dt><dd className="font-semibold text-ink">{recipe.cookTime ? formatMinutes(recipe.cookTime) : 'geen'}</dd></div>
        </dl>

        {recipe.rauweVis && <RawFishWarning alternatief={recipe.rauweVis.alternatief} />}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
          {/* Ingrediënten */}
          <section aria-labelledby="ingredienten" className="card p-6 lg:sticky lg:top-24">
            <h2 id="ingredienten" className="text-2xl font-bold">Ingrediënten</h2>

            {basis && (
              <Link
                to={`/recepten/${basis.slug}`}
                data-testid="basisrecept"
                className="group mt-4 flex items-center gap-3 rounded-2xl border-2 border-brand-400 bg-brand-50 p-3 transition-colors hover:border-brand-500"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-wider text-brand-700">Eerst nodig</span>
                  <span className="block font-display text-lg font-bold leading-tight">{basis.title}</span>
                  <span className="block text-sm text-ink-soft">Maak dit basisrecept eerst en kom daarna terug.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-muted p-2 ring-1 ring-line">
              <span id="porties-label" className="pl-3 text-sm font-semibold">Porties</span>
              <div className="flex items-center gap-2" role="group" aria-labelledby="porties-label">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  disabled={servings <= 1}
                  aria-label="Minder porties"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface ring-1 ring-line hover:ring-brand-500 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden />
                </button>
                <output data-testid="servings" aria-live="polite" className="w-8 text-center font-display text-xl font-bold tabular-nums">
                  {servings}
                </output>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(24, s + 1))}
                  aria-label="Meer porties"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-surface ring-1 ring-line hover:ring-brand-500"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-line">
              {recipe.ingredients.map((ing, i) => {
                const s = scaleIngredient(ing, factor)
                const isChecked = checked.includes(i)
                const id = `ing-${i}`
                return (
                  <li key={i}>
                    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 py-3">
                      <input
                        id={id}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIng(i)}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-line accent-brand-500"
                      />
                      <span className={`transition-opacity ${isChecked ? 'line-through opacity-50' : ''}`}>
                        <span className="font-bold">
                          {s.amount} {s.unit}
                        </span>{' '}
                        {s.name}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={resetIng}
              disabled={checked.length === 0}
              className="mt-3 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-brand-700 hover:underline disabled:opacity-40 disabled:no-underline"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Alles resetten
            </button>
          </section>

          {/* Stappen */}
          <section aria-labelledby="bereiding">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="bereiding" className="text-2xl font-bold">Bereiding</h2>
              <p className="text-sm font-semibold text-ink-soft">
                {done.length} van {recipe.steps.length} stappen klaar
              </p>
            </div>
            <div
              className="mt-3 h-3 overflow-hidden rounded-full bg-muted ring-1 ring-line"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Voortgang bereiding"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <ol className="mt-6 space-y-5">
              {recipe.steps.map((step, i) => {
                const isDone = done.includes(i)
                return (
                  <li key={i} className={`card p-5 transition-opacity sm:p-6 ${isDone ? 'opacity-75' : ''}`}>
                    <div className="flex gap-4">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ${
                          isDone ? 'bg-emerald-500 text-white' : 'bg-brand-500 text-gray-900'
                        }`}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="sr-only">Stap {i + 1}</h3>
                        <p className={`text-base leading-relaxed sm:text-lg ${isDone ? 'line-through decoration-1' : ''}`}>
                          {step.text}
                        </p>
                        {step.image && (
                          <SmartImage
                            src={step.image}
                            alt={`Stap ${i + 1} van ${recipe.title}`}
                            aspect="aspect-[16/9]"
                            width={900}
                            sizes="(min-width: 1024px) 600px, 100vw"
                            className="mt-4 rounded-2xl"
                          />
                        )}
                        {step.timerMinutes ? (
                          <Timer minutes={step.timerMinutes} label={`Stap ${i + 1} van ${recipe.title}`} />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggleStep(i)}
                          aria-pressed={isDone}
                          className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200'
                              : 'border border-line hover:border-brand-500 hover:text-brand-700'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <Circle className="h-4 w-4" aria-hidden />}
                          {isDone ? 'Klaar' : 'Markeer als klaar'}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>

            <div className="mt-8 flex gap-4 rounded-3xl border-2 border-dashed border-brand-400 bg-brand-50 p-6">
              <Lightbulb className="h-7 w-7 shrink-0 text-brand-700" aria-hidden />
              <div>
                <h3 className="font-display text-lg font-bold">Chef-tip</h3>
                <p className="mt-1 text-ink">{recipe.chefTip}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-gray-900 px-6 py-10 text-center text-white dark:bg-surface">
              <ChefHat className="h-10 w-10 text-brand-400" aria-hidden />
              <h2 className="text-2xl font-bold">Klaar met koken?</h2>
              <Button size="lg" onClick={finish} disabled={false}>
                <CheckCircle2 className="h-5 w-5" aria-hidden />
                Recept voltooid!
              </Button>
              <AnimatePresence>
                {(completed || count > 0) && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-300" data-testid="completed-count">
                    {completed ? 'Dit recept heb je al gekookt. ' : ''}
                    Je hebt {count} {count === 1 ? 'recept' : 'recepten'} voltooid.
                  </motion.p>
                )}
              </AnimatePresence>
              {done.length > 0 && (
                <button type="button" onClick={resetSteps} className="text-sm font-semibold text-brand-400 hover:underline">
                  Stappen opnieuw beginnen
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}
