import type { Ingredient } from '../types'

export function formatMinutes(min: number) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} u ${m} min` : `${h} u`
}

const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.5, '½'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
]

export function formatAmount(n: number) {
  if (n >= 100) return String(Math.round(n / 5) * 5)
  const whole = Math.floor(n)
  const frac = n - whole
  if (frac < 0.02) return String(whole || Math.round(n * 100) / 100)
  if (frac > 0.98) return String(whole + 1)
  // Alleen netjes afronden naar een breuk als de hoeveelheid er echt dichtbij zit.
  const hit = FRACTIONS.find(([v]) => Math.abs(frac - v) < 0.03)
  if (hit) return whole ? `${whole} ${hit[1]}` : hit[1]
  return String(Math.round(n * 10) / 10).replace('.', ',')
}

export function scaleIngredient(ing: Ingredient, factor: number) {
  const amount = ing.amount === null ? '' : formatAmount(ing.amount * factor)
  return { amount, unit: ing.unit, name: ing.name }
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
