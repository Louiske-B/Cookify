import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'

interface Props {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  linkTo?: string
  linkLabel?: string
  tone?: 'default' | 'muted'
  children: ReactNode
}

export function Section({ id, eyebrow, title, subtitle, linkTo, linkLabel, tone = 'default', children }: Props) {
  const headingId = id ? `${id}-titel` : undefined
  return (
    <section id={id} aria-labelledby={headingId} className={`py-14 sm:py-20 ${tone === 'muted' ? 'bg-muted' : ''}`}>
      <div className="container-page">
        <Reveal className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-700">{eyebrow}</p>
            )}
            <h2 id={headingId} className="text-3xl font-bold sm:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-3 text-lg text-ink-soft">{subtitle}</p>}
          </div>
          {linkTo && linkLabel && (
            <Link
              to={linkTo}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold text-brand-700 hover:underline"
            >
              {linkLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
