import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { CATEGORIES } from '../data/meta'

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-muted">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            Cookify helpt iedereen om op een eenvoudige en leuke manier te leren koken. Stap voor stap, van eerste
            ei tot echte keukenchef.
          </p>
        </div>

        <nav aria-label="Ontdek">
          <h2 className="font-sans text-sm font-bold uppercase tracking-wider">Ontdek</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li><Link className="hover:text-brand-700 hover:underline" to="/">Home</Link></li>
            <li><Link className="hover:text-brand-700 hover:underline" to="/recepten">Alle recepten</Link></li>
            <li><Link className="hover:text-brand-700 hover:underline" to="/recepten?categorie=snel">Onder 20 minuten</Link></li>
            <li><Link className="hover:text-brand-700 hover:underline" to="/keukens">Wereldkeukens</Link></li>
            <li><Link className="hover:text-brand-700 hover:underline" to="/favorieten">Favorieten</Link></li>
          </ul>
        </nav>

        <nav aria-label="Categorieën">
          <h2 className="font-sans text-sm font-bold uppercase tracking-wider">Categorieën</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link className="hover:text-brand-700 hover:underline" to={`/recepten?categorie=${c.id}`}>
                  {c.plural}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Cookify">
          <h2 className="font-sans text-sm font-bold uppercase tracking-wider">Cookify</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li><Link className="hover:text-brand-700 hover:underline" to="/eigen-recept">Eigen recept toevoegen</Link></li>
            <li><Link className="hover:text-brand-700 hover:underline" to="/over-ons">Over ons</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-soft sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Cookify. Met liefde gekookt in Nederland.</p>
          <p>Foto&rsquo;s via Unsplash. Smakelijk eten!</p>
        </div>
      </div>
    </footer>
  )
}
