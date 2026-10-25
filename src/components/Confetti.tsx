import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const COLORS = ['#F97316', '#FB923C', '#FDBA74', '#FACC15', '#34D399', '#60A5FA', '#F472B6', '#FFFFFF']

/** Feestelijke confetti-explosie vanuit het midden van het scherm. */
export function Confetti({ count = 90 }: { count?: number }) {
  const reduce = useReducedMotion()
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * Math.PI - Math.PI // omhoog waaieren
        const power = 220 + Math.random() * 420
        return {
          id: i,
          x: Math.cos(angle) * power,
          y: Math.sin(angle) * power,
          rotate: Math.random() * 900 - 450,
          size: 6 + Math.random() * 8,
          color: COLORS[i % COLORS.length],
          round: Math.random() > 0.6,
          delay: Math.random() * 0.15,
        }
      }),
    [count],
  )

  if (reduce) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-[55%]"
          style={{ width: p.size, height: p.size * (p.round ? 1 : 0.5), background: p.color, borderRadius: p.round ? '50%' : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 700], opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 2.4, delay: p.delay, ease: 'easeOut', times: [0, 0.4, 1] }}
        />
      ))}
    </div>
  )
}
