import { useEffect, useMemo, useSyncExternalStore } from 'react'
import type { Recipe } from '../types'
import { loadBuiltInRecipes } from '../data/recipes'
import { useCustomRecipes } from './useCustomRecipes'

// Gedeelde store voor de ingebouwde recepten, eenmalig lazy geladen.
let builtIn: Recipe[] = []
let builtInLoaded = false
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()

function ensureBuiltIn() {
  if (!loading) {
    loading = loadBuiltInRecipes()
      .then((list) => {
        builtIn = list
        builtInLoaded = true
      })
      .catch(() => {
        loading = null // volgende render probeert opnieuw
      })
      .then(() => listeners.forEach((l) => l()))
  }
  return loading
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useAllRecipes() {
  const { customRecipes, loaded: customLoaded } = useCustomRecipes()
  const list = useSyncExternalStore(subscribe, () => builtIn)
  const loaded = useSyncExternalStore(subscribe, () => builtInLoaded)

  useEffect(() => {
    void ensureBuiltIn()
  }, [])

  const all = useMemo(() => [...customRecipes, ...list], [customRecipes, list])
  return { recipes: all, builtIn: list, loaded: loaded && customLoaded }
}

/** Alleen de ingebouwde recepten (bv. voor homepage en statistieken). */
export function useBuiltInRecipes() {
  const { builtIn: list, loaded } = useAllRecipes()
  return { recipes: list, loaded }
}
