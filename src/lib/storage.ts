// Veilige localStorage-wrapper: werkt ook zonder opslag (privémodus, geblokkeerd) via een geheugen-fallback.
const memory = new Map<string, string>()

function parse<T>(raw: string | null | undefined): { ok: true; value: T } | { ok: false } {
  if (raw === null || raw === undefined) return { ok: false }
  try {
    return { ok: true, value: JSON.parse(raw) as T }
  } catch {
    return { ok: false }
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    /* opslag niet beschikbaar */
  }
  const fromDisk = parse<T>(raw)
  if (fromDisk.ok) return fromDisk.value
  const fromMemory = parse<T>(memory.get(key))
  return fromMemory.ok ? fromMemory.value : fallback
}

export function writeStorage<T>(key: string, value: T) {
  const raw = JSON.stringify(value)
  memory.set(key, raw)
  try {
    window.localStorage.setItem(key, raw)
  } catch {
    /* opslag niet beschikbaar: geheugen-fallback blijft werken tijdens de sessie */
  }
}
