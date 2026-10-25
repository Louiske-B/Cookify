import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('cookify:favorites', [])

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites])
  const add = useCallback((slug: string) => setFavorites((f) => (f.includes(slug) ? f : [...f, slug])), [setFavorites])
  const remove = useCallback((slug: string) => setFavorites((f) => f.filter((s) => s !== slug)), [setFavorites])
  const toggle = useCallback(
    (slug: string) => setFavorites((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug])),
    [setFavorites],
  )

  return { favorites, isFavorite, add, remove, toggle, count: favorites.length }
}
