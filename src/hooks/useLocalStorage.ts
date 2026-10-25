import { useCallback, useSyncExternalStore } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

// Eén gedeelde cache per sleutel, zodat alle componenten (bv. header en receptkaart) synchroon blijven.
const listeners = new Map<string, Set<() => void>>()
const cache = new Map<string, unknown>()

function subscribe(key: string, cb: () => void) {
  let set = listeners.get(key)
  if (!set) listeners.set(key, (set = new Set()))
  set.add(cb)
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) {
      cache.delete(key)
      cb()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    set!.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

function snapshot<T>(key: string, initial: T): T {
  if (!cache.has(key)) cache.set(key, readStorage<T>(key, initial))
  return cache.get(key) as T
}

export function useLocalStorage<T>(key: string, initial: T) {
  const value = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => snapshot(key, initial),
    () => initial,
  )

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = snapshot(key, initial)
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      cache.set(key, resolved)
      writeStorage(key, resolved)
      listeners.get(key)?.forEach((cb) => cb())
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )

  return [value, setValue] as const
}
