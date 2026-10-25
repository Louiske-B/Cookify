import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

/** Voltooide recepten (globaal). */
export function useCompleted() {
  const [completed, setCompleted] = useLocalStorage<string[]>('cookify:completed', [])
  const markCompleted = useCallback(
    (slug: string) => setCompleted((c) => (c.includes(slug) ? c : [...c, slug])),
    [setCompleted],
  )
  return { completed, markCompleted, count: completed.length, isCompleted: (slug: string) => completed.includes(slug) }
}

function useIndexList(storageKey: string, slug: string) {
  const [all, setAll] = useLocalStorage<Record<string, number[]>>(storageKey, {})
  const list = all[slug] ?? []
  const toggle = useCallback(
    (i: number) =>
      setAll((prev) => {
        const cur = prev[slug] ?? []
        return { ...prev, [slug]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] }
      }),
    [setAll, slug],
  )
  const reset = useCallback(() => setAll((prev) => ({ ...prev, [slug]: [] })), [setAll, slug])
  return { list, toggle, reset }
}

/** Afgevinkte ingrediënten per recept (indexen). */
export function useCheckedIngredients(slug: string) {
  const { list, toggle, reset } = useIndexList('cookify:checked', slug)
  return { checked: list, toggle, reset }
}

/** Afgeronde stappen per recept. */
export function useDoneSteps(slug: string) {
  const { list, toggle, reset } = useIndexList('cookify:steps', slug)
  return { done: list, toggle, reset }
}
