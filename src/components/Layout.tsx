import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#inhoud"
        className="sr-only z-[200] rounded-full bg-brand-500 px-4 py-2 font-semibold text-gray-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ga naar de inhoud
      </a>
      <Header />
      <motion.main
        id="inhoud"
        key={pathname}
        className="flex-1"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}
