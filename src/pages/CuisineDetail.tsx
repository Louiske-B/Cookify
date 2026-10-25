import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, ShoppingBasket } from 'lucide-react'
import { RecipeBrowser } from '../components/RecipeBrowser'
import { getCuisineInfo } from '../data/cuisines'
import { CUISINES } from '../data/meta'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import NotFound from './NotFound'

export default function CuisineDetail() {
  const { id = '' } = useParams()
  const info = getCuisineInfo(id)
  const label = CUISINES.find((c) => c.id === id)?.label ?? id
  useDocumentMeta(info ? `${label} koken` : 'Keuken niet gevonden', info ? info.intro.slice(0, 150) : 'Deze keuken bestaat niet.')

  if (!info) return <NotFound />

  return (
    <div className="container-page py-10 sm:py-14">
      <Link to="/keukens" className="mb-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-ink-soft hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Alle keukens
      </Link>

      <header className="max-w-3xl">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-700">
          <MapPin className="h-4 w-4" aria-hidden /> Wereldkeuken
        </p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          <span aria-hidden>{info.emoji} </span>
          {label}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{info.intro}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
        <section aria-labelledby="smaken" className="card p-6">
          <h2 id="smaken" className="text-xl font-bold">Typische smaken</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {info.smaken.map((s) => (
              <li key={s} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-ink ring-1 ring-brand-200">
                {s}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-lg font-bold">Typische ingrediënten</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {info.ingredienten.map((s) => (
              <li key={s} className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium ring-1 ring-line">
                {s}
              </li>
            ))}
          </ul>
        </section>

        <aside aria-labelledby="voorraadkast" data-testid="voorraadkast" className="rounded-3xl border-2 border-dashed border-brand-400 bg-brand-50 p-6">
          <h2 id="voorraadkast" className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBasket className="h-5 w-5 text-brand-700" aria-hidden /> Voorraadkast
          </h2>
          <p className="mt-1 text-sm text-ink-soft">De belangrijkste ingrediënten om in huis te halen, en waar je ze vindt.</p>
          <ul className="mt-4 space-y-3">
            {info.voorraadkast.map((p) => (
              <li key={p.naam} className="text-sm">
                <span className="font-bold">{p.naam}</span>
                <span className="block text-ink-soft">{p.waar}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <h2 className="mt-12 text-3xl font-bold">Alle recepten</h2>
      <RecipeBrowser cuisine={info.id} />
    </div>
  )
}
