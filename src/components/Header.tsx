import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Moon, Sun, X } from 'lucide-react'
import { Logo } from './Logo'
import { useTheme } from '../hooks/useTheme'
import { useFavorites } from '../hooks/useFavorites'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/recepten', label: 'Recepten' },
  { to: '/eigen-recept', label: 'Eigen recept' },
  { to: '/over-ons', label: 'Over ons' },
]

export function Header() {
  const { theme, toggle } = useTheme()
  const { count } = useFavorites()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'bg-brand-100 text-brand-700' : 'text-ink hover:bg-muted hover:text-brand-700'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled || open ? 'border-line bg-bg/90 shadow-soft backdrop-blur-lg' : 'border-transparent bg-bg/70 backdrop-blur'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Link to="/" className="rounded-xl" aria-label="Cookify – naar de homepage">
          <Logo />
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/favorieten"
            aria-label={`Favorieten (${count})`}
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-sm font-semibold hover:border-brand-500"
          >
            <Heart className={`h-5 w-5 ${count ? 'fill-red-500 text-red-500' : ''}`} aria-hidden />
            <span className="hidden sm:inline">Favorieten</span>
            <span
              key={count}
              data-testid="fav-count"
              className="inline-flex min-w-6 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold leading-6 text-gray-900"
            >
              {count}
            </span>
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface hover:border-brand-500"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
          </button>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobiel-menu"
            aria-label={open ? 'Sluit menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface hover:border-brand-500 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobiel-menu"
            aria-label="Mobiel menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-3">
              {[...links, { to: '/favorieten', label: `Favorieten (${count})` }].map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={'end' in l ? l.end : undefined}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-base font-semibold ${
                        isActive ? 'bg-brand-100 text-brand-700' : 'hover:bg-muted'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
