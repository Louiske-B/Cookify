import { useCallback, useEffect, useSyncExternalStore } from 'react'
import type { Recipe } from '../types'
import { loadCustomRecipes, saveCustomRecipes } from '../lib/customStore'

// Gedeelde store: eigen recepten staan in IndexedDB (foto's zijn te groot voor localStorage).
let state: { recipes: Recipe[]; loaded: boolean } = { recipes: [], loaded: false }
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()

const set = (next: Partial<typeof state>) => {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

function ensureLoaded() {
  if (!loading) {
    loading = loadCustomRecipes().then((recipes) => set({ recipes, loaded: true }))
  }
  return loading
}

async function persist(next: Recipe[]) {
  set({ recipes: next })
  await saveCustomRecipes(next)
}

export function useCustomRecipes() {
  const snap = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )

  useEffect(() => {
    void ensureLoaded()
  }, [])

  const add = useCallback(async (recipe: Recipe) => {
    await ensureLoaded()
    await persist([recipe, ...state.recipes])
  }, [])
  const update = useCallback(async (recipe: Recipe) => {
    await ensureLoaded()
    await persist(state.recipes.map((r) => (r.id === recipe.id ? recipe : r)))
  }, [])
  const remove = useCallback(async (id: string) => {
    await ensureLoaded()
    await persist(state.recipes.filter((r) => r.id !== id))
  }, [])

  return { customRecipes: snap.recipes, loaded: snap.loaded, add, update, remove }
}
