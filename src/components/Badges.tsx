import { Clock, Flame, Gauge } from 'lucide-react'
import type { Difficulty } from '../types'
import { formatMinutes } from '../lib/format'

const diffStyle: Record<Difficulty, string> = {
  Makkelijk: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200',
  Gemiddeld: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200',
  Uitdagend: 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200',
}

export function DifficultyBadge({ difficulty, className = '' }: { difficulty: Difficulty; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${diffStyle[difficulty]} ${className}`}
    >
      <Gauge className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">Moeilijkheid: </span>
      {difficulty}
    </span>
  )
}

export function TimeBadge({
  minutes,
  className = '',
  quick = false,
}: {
  minutes: number
  className?: string
  quick?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-line ${className}`}
    >
      {quick ? <Flame className="h-3.5 w-3.5 text-brand-700" aria-hidden /> : <Clock className="h-3.5 w-3.5" aria-hidden />}
      <span className="sr-only">Totale tijd: </span>
      {formatMinutes(minutes)}
    </span>
  )
}
