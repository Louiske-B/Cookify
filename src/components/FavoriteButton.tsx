import { motion, useReducedMotion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useToast } from './Toast'

interface Props {
  slug: string
  title: string
  variant?: 'overlay' | 'inline'
  className?: string
}

export function FavoriteButton({ slug, title, variant = 'overlay', className = '' }: Props) {
  const { isFavorite, toggle } = useFavorites()
  const { toast } = useToast()
  const reduce = useReducedMotion()
  const active = isFavorite(slug)

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(slug)
    if (active) {
      toast({
        message: `${title} verwijderd uit favorieten`,
        actionLabel: 'Ongedaan maken',
        onAction: () => toggle(slug),
        tone: 'info',
      })
    } else {
      toast({ message: `${title} bewaard in je favorieten`, duration: 2500 })
    }
  }

  const look =
    variant === 'overlay'
      ? 'h-10 w-10 bg-white/90 shadow-soft backdrop-blur hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900'
      : 'relative h-12 w-12 border-2 border-line bg-surface hover:border-brand-500'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Verwijder ${title} uit favorieten` : `Bewaar ${title} als favoriet`}
      className={`inline-flex items-center justify-center rounded-full transition-colors ${look} ${className}`}
    >
      <motion.span
        key={String(active)}
        initial={reduce ? false : { scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 12 }}
        className="flex"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${active ? 'fill-red-500 text-red-500' : 'text-ink'}`}
          aria-hidden
        />
      </motion.span>
      {active && !reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-red-400"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </button>
  )
}
