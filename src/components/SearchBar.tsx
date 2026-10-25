import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  delay?: number
}

/** Zoekveld met debounce: onChange vuurt pas als de gebruiker even stopt met typen. */
export function SearchBar({ value, onChange, delay = 300 }: Props) {
  const [text, setText] = useState(value)
  const timer = useRef<number | undefined>(undefined)
  const lastSent = useRef(value)

  // Externe wijziging (bv. "Wis filters" of back-knop) overnemen.
  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value
      setText(value)
    }
  }, [value])

  const send = (v: string) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      lastSent.current = v
      onChange(v)
    }, delay)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div role="search" className="relative">
      <label htmlFor="recept-zoeken" className="sr-only">
        Zoek in recepten
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" aria-hidden />
      <input
        id="recept-zoeken"
        type="search"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          send(e.target.value)
        }}
        placeholder="Zoek op gerecht, ingrediënt of tag…"
        autoComplete="off"
        className="w-full rounded-full border-2 border-line bg-surface py-3 pl-12 pr-12 text-base placeholder:text-ink-soft focus:border-brand-500 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText('')
            window.clearTimeout(timer.current)
            lastSent.current = ''
            onChange('')
          }}
          aria-label="Zoekopdracht wissen"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-soft hover:bg-muted hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      )}
    </div>
  )
}
