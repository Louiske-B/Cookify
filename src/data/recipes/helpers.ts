import type { Recipe } from '../../types.ts'

export const u = (id: string) => `https://images.unsplash.com/photo-${id}`

type Draft = Omit<Recipe, 'id' | 'totalTime'>
export const make = (d: Draft): Recipe => ({ ...d, id: d.slug, totalTime: d.prepTime + d.cookTime })
