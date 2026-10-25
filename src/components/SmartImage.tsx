import { useEffect, useState } from 'react'
import { ChefHat } from 'lucide-react'
import { sized, srcSet } from '../lib/images'

interface Props {
  src: string
  alt: string
  /** Tailwind aspect-klasse, bv. "aspect-[4/3]". Vaste verhouding voorkomt layoutverspringing. */
  aspect?: string
  width?: number
  sizes?: string
  eager?: boolean
  className?: string
  imgClassName?: string
}

export function SmartImage({
  src,
  alt,
  aspect = 'aspect-[4/3]',
  width = 800,
  sizes = '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
  eager = false,
  className = '',
  imgClassName = '',
}: Props) {
  const [failed, setFailed] = useState(!src)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setFailed(!src)
    setLoaded(false)
  }, [src])

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 ${aspect} ${className}`}>
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white/90"
        >
          <ChefHat className="h-1/4 w-1/4 min-h-8 min-w-8" aria-hidden />
        </div>
      ) : (
        <img
          src={sized(src, width)}
          srcSet={srcSet(src, [400, 800, 1200, 1600])}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  )
}
