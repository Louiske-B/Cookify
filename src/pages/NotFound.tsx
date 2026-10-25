import { Compass } from 'lucide-react'
import { Button } from '../components/Button'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function NotFound() {
  useDocumentMeta('Pagina niet gevonden', 'Deze pagina bestaat niet (meer). Ga terug naar de recepten van Cookify.')
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <Compass className="h-10 w-10" aria-hidden />
      </span>
      <p className="font-display text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="text-3xl font-bold">Oeps, deze pagina is aangebrand</h1>
      <p className="max-w-md text-ink-soft">
        De pagina die je zoekt bestaat niet (meer). Geen zorgen, in onze keuken staat genoeg anders te sudderen.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button to="/">Naar de homepage</Button>
        <Button to="/recepten" variant="outline">Bekijk recepten</Button>
      </div>
    </div>
  )
}
