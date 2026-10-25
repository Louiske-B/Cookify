import type { Recipe } from '../../types.ts'

/**
 * Receptdata wordt per categorie in een eigen chunk geladen, zodat de eerste
 * paginalading (hero, navigatie) niet op alle recepten hoeft te wachten.
 */
export async function loadBuiltInRecipes(): Promise<Recipe[]> {
  const [ontbijt, lunch, avondeten, desserts, snacks, sushi, thais, chinees] = await Promise.all([
    import('./ontbijt.ts'),
    import('./lunch.ts'),
    import('./avondeten.ts'),
    import('./desserts.ts'),
    import('./snacks.ts'),
    import('./sushi.ts'),
    import('./thais.ts'),
    import('./chinees.ts'),
  ])
  return [
    ...ontbijt.ontbijt,
    ...lunch.lunch,
    ...avondeten.avondeten,
    ...desserts.desserts,
    ...snacks.snacks,
    ...sushi.sushi,
    ...thais.thais,
    ...chinees.chinees,
  ]
}
