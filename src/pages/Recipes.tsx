import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { RecipeBrowser } from '../components/RecipeBrowser'

export default function Recipes() {
  useDocumentMeta('Recepten', 'Bekijk alle Cookify-recepten. Filter op categorie, keuken, dieet, pittigheid of bereidingstijd en zoek op gerecht, ingrediënt of tag.')

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-700">Recepten</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Wat ga je vandaag koken?</h1>
        <p className="mt-3 text-lg text-ink-soft">Filter op categorie, keuken of dieet, of zoek op gerecht, ingrediënt en tag.</p>
      </header>
      <RecipeBrowser />
    </div>
  )
}
