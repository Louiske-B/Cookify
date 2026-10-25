import { del, get, set } from 'idb-keyval'
import type { Recipe } from '../types'

const KEY = 'cookify:custom-recipes'

export async function loadCustomRecipes(): Promise<Recipe[]> {
  try {
    return (await get<Recipe[]>(KEY)) ?? []
  } catch {
    return []
  }
}

export async function saveCustomRecipes(list: Recipe[]) {
  await set(KEY, list)
}

export async function clearCustomRecipes() {
  await del(KEY)
}
