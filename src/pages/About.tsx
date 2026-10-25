import { BookOpenCheck, Heart, Smile, Target } from 'lucide-react'
import { CATEGORIES, recipes } from '../data/recipes'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const reasons = [
  { icon: Target, title: 'Je weet altijd wat je moet doen', text: 'Eén stap tegelijk, dus geen paniek over wat er daarna komt.' },
  { icon: BookOpenCheck, title: 'Fouten worden kansen', text: 'Elke stap legt uit waaróm, zodat je technieken echt leert.' },
  { icon: Smile, title: 'Het blijft leuk', text: 'Kleine overwinningen, timers en een feestje na elk gerecht.' },
]

const team = [
  { name: 'Team Fornuis', role: 'Receptontwikkeling', text: 'Test elk recept minstens drie keer, tot het in elke keuken lukt.' },
  { name: 'Team Fotolens', role: 'Beeld & stijl', text: 'Zorgt dat elk gerecht er net zo lekker uitziet als het smaakt.' },
  { name: 'Team Proefkonijn', role: 'Beginnerstesten', text: 'Kookt zonder ervaring mee om elke tutorial begrijpelijk te houden.' },
  { name: 'Team Techniek', role: 'Platform', text: 'Bouwt de tools, zoals timers en portieregelaars, die koken makkelijker maken.' },
]

const stats = [
  { value: String(recipes.length), label: 'recepten om mee te beginnen' },
  { value: String(CATEGORIES.length), label: 'categorieën voor elk moment' },
  { value: String(recipes.reduce((n, r) => n + r.steps.length, 0)), label: 'duidelijke bereidingsstappen' },
  { value: '100%', label: 'gratis te gebruiken' },
]

export default function About() {
  useDocumentMeta('Over ons', 'Cookify helpt iedereen om op een eenvoudige en leuke manier te leren koken. Lees over onze missie en ons team.')
  return (
    <>
      <section className="bg-brand-50 py-16 sm:py-24">
        <div className="container-page max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-700">Over ons</p>
          <h1 className="text-4xl font-extrabold sm:text-6xl">Koken leren hoeft niet moeilijk te zijn</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl">
            Cookify helpt iedereen om op een eenvoudige en leuke manier te leren koken. Of je nu je eerste ei bakt of
            je signatuurgerecht perfectioneert.
          </p>
        </div>
      </section>

      <Section id="missie" eyebrow="Onze missie" title="Elke keuken een beetje blijer maken">
        <Reveal className="grid items-center gap-8 lg:grid-cols-2">
          <p className="text-lg leading-relaxed text-ink-soft">
            Veel mensen denken dat koken een talent is. Wij geloven dat het een vaardigheid is, en vaardigheden leer
            je door te doen. Daarom maken we recepten die je echt kunt volgen: met duidelijke stappen, tijden die
            kloppen en tips van ervaren koks.
          </p>
          <div className="card flex items-start gap-4 p-6">
            <Heart className="h-8 w-8 shrink-0 text-red-500" aria-hidden />
            <p className="text-lg font-medium">
              &ldquo;Een goede maaltijd begint met zelfvertrouwen. De rest is een kwestie van oefenen.&rdquo;
              <span className="mt-2 block text-sm font-normal text-ink-soft">Het Cookify-team</span>
            </p>
          </div>
        </Reveal>
      </Section>

      <Section id="waarom" tone="muted" eyebrow="Onze aanpak" title="Waarom stap voor stap werkt">
        <ul className="grid gap-6 md:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 0.1} className="card p-7">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-gray-900">
                <r.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="text-xl font-bold">{r.title}</h3>
              <p className="mt-2 text-ink-soft">{r.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="team" eyebrow="De keuken achter Cookify" title="Ons team" subtitle="Een fictief team van keukenliefhebbers, elk met een eigen specialiteit.">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((t, i) => (
            <Reveal as="li" key={t.name} delay={i * 0.08} className="card p-6 text-center">
              <span className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-3xl font-bold text-white" aria-hidden>
                {t.name.split(' ')[1][0]}
              </span>
              <h3 className="text-lg font-bold">{t.name}</h3>
              <p className="text-sm font-semibold text-brand-700">{t.role}</p>
              <p className="mt-2 text-sm text-ink-soft">{t.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <section className="bg-gray-900 py-14 text-white dark:bg-surface" aria-label="Cookify in cijfers">
        <dl className="container-page grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-4xl font-extrabold text-brand-400 sm:text-5xl">{s.value}</dd>
              <dt className="mt-1 text-sm text-gray-300">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <Section id="cta" title="Klaar om te beginnen?" subtitle="Kies een recept en zit binnen een half uur aan tafel.">
        <div className="flex flex-wrap gap-3">
          <Button to="/recepten" size="lg">Ontdek recepten</Button>
          <Button to="/eigen-recept" variant="outline" size="lg">Voeg je eigen recept toe</Button>
        </div>
      </Section>
    </>
  )
}
