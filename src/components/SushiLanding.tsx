import { Link } from 'react-router-dom'
import { ArrowRight, Fish, ShieldAlert } from 'lucide-react'
import { RawFishNotice } from './RawFishWarning'

const types: { name: string; text: string }[] = [
  { name: 'Maki', text: 'Een rol met de nori aan de buitenkant en rijst met één of twee vullingen. Hosomaki zijn dun, futomaki dik.' },
  { name: 'Uramaki', text: 'Een "binnenstebuiten-rol": de rijst zit aan de buitenkant, vaak bestrooid met sesam of vissenkuit. California roll is de bekendste.' },
  { name: 'Nigiri', text: 'Een handgevormd bedje rijst met een plakje vis, garnaal of omelet erop. Eenvoudig van opzet, lastig om mooi te maken.' },
  { name: 'Sashimi', text: 'Alleen vis, zonder rijst, in nette plakjes gesneden. Daarom is de kwaliteit van de vis hier alles.' },
  { name: 'Gunkan', text: 'Een "slagschip": een ovaaltje rijst met een nori-bandje eromheen, gevuld met losse toppings zoals vissenkuit of tartaar.' },
  { name: 'Temaki', text: 'Een handrol in de vorm van een ijshoorntje. Ideaal voor een sushi-avond waar iedereen zijn eigen rol maakt.' },
  { name: 'Chirashi', text: 'Een kom sushirijst met een kleurrijke laag vis en groenten erop. De makkelijkste manier om te beginnen.' },
  { name: 'Inari', text: 'Een gebakken tofuzakje gevuld met sushirijst. Zoetig, vegan en zonder rauwe vis.' },
]

/** Introductie, uitleg over de soorten en veiligheidskader voor de sushi-categorie. */
export function SushiLanding() {
  return (
    <section aria-labelledby="sushi-intro" className="mt-8 space-y-8">
      <div className="card overflow-hidden bg-gradient-to-br from-brand-50 to-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-gray-900 shadow-soft">
            <Fish className="h-7 w-7" aria-hidden />
          </span>
          <div className="max-w-3xl">
            <h2 id="sushi-intro" className="text-2xl font-bold sm:text-3xl">
              Sushi maken, stap voor stap
            </h2>
            <p className="mt-3 text-ink-soft">
              Sushi is in de kern gekruide rijst met iets lekkers erbij: vis, groenten, omelet of tofu. Rauwe vis is dus
              <strong className="text-ink"> niet verplicht</strong>. Veel van onze recepten zijn vegetarisch of gebruiken
              gekookte of gerookte vis. De rijst is het belangrijkste onderdeel, dus begin met ons basisrecept.
            </p>
            <Link
              to="/recepten/sushirijst"
              className="group mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
            >
              Begin met sushirijst
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold">De soorten sushi uitgelegd</h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t) => (
            <div key={t.name} className="rounded-2xl border border-line bg-surface p-4">
              <dt className="font-display text-lg font-bold">{t.name}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{t.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <aside
        aria-labelledby="sushi-veilig"
        className="rounded-3xl border-2 border-amber-500/60 bg-amber-50 p-6 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100"
      >
        <div className="flex items-start gap-4">
          <ShieldAlert className="mt-0.5 h-7 w-7 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
          <div>
            <h3 id="sushi-veilig" className="text-xl font-bold">
              Veilig werken met rauwe vis
            </h3>
            <RawFishNotice className="mt-2" />
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              <li>Bewaar vis tot het moment van gebruik in de koelkast (maximaal 2 °C) of op ijs.</li>
              <li>Gebruik een apart, schoon snijplank en mes voor rauwe vis en was je handen vaak.</li>
              <li>Maak sushi met rauwe vis op dezelfde dag en bewaar restjes niet.</li>
              <li>Liever geen rauwe vis? Kies gerookte zalm, gekookte garnalen, surimi of groenten. Elk recept met rauwe vis noemt een veilig alternatief.</li>
            </ul>
          </div>
        </div>
      </aside>
    </section>
  )
}
