import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X } from 'lucide-react'

interface ToastOptions {
  message: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
  tone?: 'success' | 'info'
}

interface ToastItem extends ToastOptions {
  id: number
}

const ToastContext = createContext<{ toast: (o: ToastOptions) => void } | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast moet binnen ToastProvider gebruikt worden')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    (o: ToastOptions) => {
      const id = nextId.current++
      setItems((l) => [...l.slice(-2), { ...o, id }])
      window.setTimeout(() => dismiss(id), o.duration ?? (o.actionLabel ? 6000 : 4000))
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-4 pb-4 sm:items-end sm:pb-6 sm:pr-6"
        role="region"
        aria-label="Meldingen"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lift ring-1 ring-white/10 dark:bg-gray-100 dark:text-gray-900"
              role="status"
            >
              {t.tone === 'info' ? (
                <Info className="h-5 w-5 shrink-0 text-brand-400" aria-hidden />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 dark:text-emerald-600" aria-hidden />
              )}
              <span className="flex-1 font-medium">{t.message}</span>
              {t.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    t.onAction?.()
                    dismiss(t.id)
                  }}
                  className="rounded-full px-3 py-1 font-bold text-brand-400 hover:bg-white/10 dark:text-brand-600 dark:hover:bg-black/10"
                >
                  {t.actionLabel}
                </button>
              )}
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded-full p-1 opacity-70 hover:opacity-100"
                aria-label="Melding sluiten"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
