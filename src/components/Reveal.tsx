import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}

/** Fade/slide-in zodra het element in beeld komt. Valt terug op statisch bij prefers-reduced-motion. */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  if (reduce) return <Comp className={className}>{children}</Comp>
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}
