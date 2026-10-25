import { useMemo } from 'react'
import { recipes as builtIn } from '../data/recipes'
import type { Recipe } from '../types'
import { useCustomRecipes } from './useCustomRecipes'

export function useAllRecipes() {
  const { customRecipes, loaded } = useCustomRecipes()
  const all: Recipe[] = useMemo(() => [...customRecipes, ...builtIn], [customRecipes])
  return { recipes: all, loaded }
}
