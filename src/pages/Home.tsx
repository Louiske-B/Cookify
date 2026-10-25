import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, BookOpenCheck, ChefHat, Search, Sparkles } from 'lucide-react'
import { CATEGORIES, HERO_IMAGE } from '../data/meta'
import { useBuiltInRecipes } from '../hooks/useAllRecipes'
import type { Recipe } from '../types'
import { Button } from '../components/Button'
import { Section } from '../components/Section'
import { RecipeCard } from '../components/RecipeCard'
import { Reveal } from '../components/Reveal'
import { SmartImage } from '../components/SmartImage'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const popularSlugs = ['pasta-carbonara', 'pizza-margherita', 'pannenkoeken', 'hamburgers']
const featuredSlugs = ['thaise-groene-curry', 'brownies', 'shakshuka']

const pick = (list: Recipe[], slugs: string[]) =>
  slugs.map((s) => list.find((r) => r.slug === s)).filter((r): r is Recipe => !!r)

function CardSkeletons({ n }: { n: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="card h-80 animate-pulse bg-muted" />
      ))}
    </div>
  )
}

const steps = [
  {
    icon: Search,
    title: 'Kies een recept',
    text: 'Blader door categorieën of zoek op gerecht en ingrediënt. Er is altijd iets dat past bij je tijd en niveau.',
  },
  {
    icon: BookOpenCheck,
    title: 'Volg de stappen',
    text: 'Heldere stappen, handige timers en ingrediënten die je kunt afvinken. Je past de porties met één klik aan.',
  },
  {
    icon: ChefHat,
    title: 'Geniet en groei',
    text: 'Vink je recept af, verzamel je favorieten en word stap voor stap een echte keukenchef.',
  },
]

export default function Home() {
  const reduce = useReducedMotion()
  const { recipes, loaded } = useBuiltInRecipes()
  const popular = pick(recipes, popularSlugs)
  const featured = pick(recipes, featuredSlugs)
  const quick = recipes.filter((r) => r.totalTime < 20).slice(0, 4)
  useDocumentMeta(
    'Cookify',
    'Ontdek recepten, volg stap-voor-stap tutorials en word een echte keukenchef. Cookify: iedereen kan leren koken!',
  )

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gray-900" aria-labelledby="hero-titel">
        <motion.div
          className="absolute inset-0 -z-10"
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        >
          <SmartImage
            src={HERO_IMAGE}
            alt=""
            aspect="h-full w-full"
            width={1600}
            sizes="100vw"
            eager
            className="h-full"
          />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/90 via-gray-900/65 to-gray-900/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-gray-950/60 to-transparent" />

        <div className="container-page flex min-h-[560px] flex-col justify-center py-20 sm:min-h-[640px] lg:min-h-[720px]">
          <motion.div
            className="max-w-2xl"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur">
              <Sparkles className="h-4 w-4 text-brand-400" aria-hidden />
              Stap voor stap naar een smakelijk resultaat
            </p>
            <h1 id="hero-titel" className="text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Iedereen kan leren koken!
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-100 sm:text-xl">
              Ontdek recepten, volg tutorials en word een echte keukenchef.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/recepten" size="lg">
                Ontdek recepten
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
              <Link
                to="/recepten?categorie=snel"
                className="inline-flex items-center rounded-full border-2 border-white/60 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/15 sm:text-lg"
              >
                Klaar in 20 min
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Populaire recepten */}
      <Section
        id="populair"
        eyebrow="Favoriet bij onze koks"
        title="Populaire recepten"
        subtitle="De gerechten die iedereen wil leren maken."
        linkTo="/recepten"
        linkLabel="Alle recepten"
      >
        {!loaded ? <CardSkeletons n={4} /> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
              <RecipeCard recipe={r} />
            </Reveal>
          ))}
        </div>}
      </Section>

      {/* Categorieën */}
      <Section
        id="categorieen"
        tone="muted"
        eyebrow="Waar heb je zin in?"
        title="Kies een categorie"
        subtitle="Van een snel ontbijt tot een dessert om van te smullen."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => {
            const sample = pick(recipes, [{ ontbijt: 'pannenkoeken', lunch: 'caesarsalade', avondeten: 'pasta-carbonara', dessert: 'brownies', snack: 'zelfgemaakte-frietjes', sushi: 'california-roll' }[c.id]])[0]
            const count = recipes.filter((r) => r.category === c.id).length
            return (
              <Reveal as="li" key={c.id} delay={i * 0.06}>
                <Link
                  to={`/recepten?categorie=${c.id}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition-shadow hover:shadow-lift"
                >
                  {sample && (
                    <SmartImage
                      src={sample.image}
                      alt=""
                      aspect="absolute inset-0"
                      width={500}
                      sizes="(min-width: 1024px) 20vw, 50vw"
                      imgClassName="transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <span className="text-2xl" aria-hidden>{c.emoji}</span>
                    <h3 className="font-display text-xl font-bold">{c.plural}</h3>
                    <p className="text-sm text-gray-200">{loaded ? `${count} ${count === 1 ? 'recept' : 'recepten'}` : ' '}</p>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </Section>

      {/* Aanbevolen tutorials */}
      <Section
        id="tutorials"
        eyebrow="Leer het echt"
        title="Aanbevolen tutorials"
        subtitle="Uitgebreide stap-voor-stap uitleg, met timers en chef-tips."
        linkTo="/recepten"
        linkLabel="Bekijk alle tutorials"
      >
        {!loaded ? <CardSkeletons n={3} /> : <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.1}>
              <RecipeCard recipe={r} variant="featured" />
            </Reveal>
          ))}
        </div>}
      </Section>

      {/* Snel klaar */}
      <Section
        id="snel"
        tone="muted"
        eyebrow="Weinig tijd?"
        title="Klaar in minder dan 20 minuten"
        subtitle="Snel op tafel, zonder in te leveren op smaak."
        linkTo="/recepten?categorie=snel"
        linkLabel="Alle snelle recepten"
      >
        {!loaded ? <CardSkeletons n={4} /> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
              <RecipeCard recipe={r} />
            </Reveal>
          ))}
        </div>}
      </Section>

      {/* Hoe werkt het */}
      <Section id="hoe-werkt-het" eyebrow="In drie stappen" title="Hoe werkt Cookify?">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="card relative p-7">
              <span className="absolute right-6 top-5 font-display text-6xl font-extrabold text-brand-100" aria-hidden>
                {i + 1}
              </span>
              <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-gray-900 shadow-soft">
                <s.icon className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="text-xl font-bold">
                <span className="sr-only">Stap {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-gray-900 px-6 py-10 text-center text-white dark:bg-surface">
          <h3 className="text-2xl font-bold sm:text-3xl">Heb je zelf een topgerecht?</h3>
          <p className="max-w-xl text-gray-300">Voeg je eigen recept met foto toe en volg het later net zo makkelijk als onze tutorials.</p>
          <Button to="/eigen-recept">Eigen recept toevoegen</Button>
        </Reveal>
      </Section>
    </>
  )
}
