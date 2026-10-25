import { Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { useTimer } from '../hooks/useTimer'
import { formatClock } from '../lib/format'
import { playDing, unlockAudio } from '../lib/sound'
import { useToast } from './Toast'

interface Props {
  minutes: number
  label: string
}

function notify(label: string) {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Cookify: timer afgelopen ⏰', { body: label })
    }
  } catch {
    /* meldingen zijn optioneel */
  }
}

export function Timer({ minutes, label }: Props) {
  const { toast } = useToast()
  const t = useTimer(minutes, () => {
    playDing()
    notify(label)
    toast({ message: `⏰ Timer afgelopen: ${label}`, duration: 8000, tone: 'info' })
  })

  const running = t.status === 'running'
  const done = t.status === 'done'
  const R = 20
  const C = 2 * Math.PI * R

  const start = () => {
    unlockAudio()
    try {
      if ('Notification' in window && Notification.permission === 'default') void Notification.requestPermission()
    } catch {
      /* negeren */
    }
    t.start()
  }

  return (
    <div
      className={`mt-4 flex flex-wrap items-center gap-4 rounded-2xl border p-3 pr-4 transition-colors ${
        done ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : running ? 'border-brand-500 bg-brand-50' : 'border-line bg-muted'
      }`}
    >
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="24" cy="24" r={R} fill="none" strokeWidth="4" className="stroke-line" />
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - t.progress)}
            className={done ? 'stroke-emerald-500' : 'stroke-brand-500'}
            style={{ transition: 'stroke-dashoffset 0.3s linear' }}
          />
        </svg>
        <TimerIcon className="absolute inset-0 m-auto h-5 w-5 text-ink-soft" aria-hidden />
      </div>

      <div className="min-w-[5.5rem]">
        <div
          className="font-display text-3xl font-bold tabular-nums leading-none"
          role="timer"
          aria-label={`Resterende tijd ${formatClock(t.remaining)}`}
        >
          {formatClock(t.remaining)}
        </div>
        <div className="mt-1 text-xs font-medium text-ink-soft">
          {done ? 'Klaar!' : running ? 'Loopt…' : t.status === 'paused' ? 'Gepauzeerd' : `${minutes} min timer`}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {running ? (
          <button
            type="button"
            onClick={t.pause}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
          >
            <Pause className="h-4 w-4" aria-hidden /> Pauze
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-brand-400"
          >
            <Play className="h-4 w-4" aria-hidden /> {t.status === 'paused' ? 'Hervat' : done ? 'Opnieuw' : 'Start'}
          </button>
        )}
        <button
          type="button"
          onClick={t.reset}
          disabled={t.status === 'idle'}
          aria-label="Timer resetten"
          className="rounded-full border border-line bg-surface p-2 hover:border-brand-500 disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
