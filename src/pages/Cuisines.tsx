import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { SmartImage } from '../components/SmartImage'
import { CUISINE_INFO } from '../data/cuisines'
import { CUISINES } from '../data/meta'
import { useBuiltInRecipes } from '../hooks/useAllRecipes'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Cuisines() {
  const { recipes, loaded } = useBuiltInRecipes()
  useDocumentMeta('Wereldkeukens', 'Ontdek Cookify per wereldkeuken: Thais, Chinees, Japans, Italiaans, Belgisch en meer, met typische smaken en een voorraadkastgids.')

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-700">Wereldkeukens</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Kook de hele wereld rond</h1>
        <p className="mt-3 text-lg text-ink-soft">
          Kies een keuken en ontdek typische smaken, wat er in je voorraadkast hoort en alle recepten uit die regio.
        </p>
      </header>

      <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {CUISINE_INFO.map((c, i) => {
          const label = CUISINES.find((x) => x.id === c.id)?.label ?? c.id
          const list = recipes.filter((r) => r.cuisine === c.id)
          const sample = list.find((r) => r.image) ?? list[0]
          return (
            <Reveal as="li" key={c.id} delay={(i % 4) * 0.06}>
              <Link
                to={`/keukens/${c.id}`}
                data-testid={`keuken-${c.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition-shadow hover:shadow-lift"
              >
                {sample && (
                  <SmartImage
                    src={sample.image}
                    alt=""
                    aspect="absolute inset-0"
                    width={500}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    imgClassName="transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <span className="text-2xl" aria-hidden>{c.emoji}</span>
                  <h2 className="font-display text-xl font-bold">{label}</h2>
                  <p className="text-sm text-gray-200">{loaded ? `${list.length} ${list.length === 1 ? 'recept' : 'recepten'}` : ' '}</p>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </div>
  )
}
