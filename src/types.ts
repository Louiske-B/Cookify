export type Category = 'ontbijt' | 'lunch' | 'avondeten' | 'dessert' | 'snack'
export type Difficulty = 'Makkelijk' | 'Gemiddeld' | 'Uitdagend'

export interface Ingredient {
  amount: number | null
  unit: string
  name: string
}

export interface Step {
  text: string
  image?: string
  timerMinutes?: number
}

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  category: Category
  prepTime: number
  cookTime: number
  totalTime: number
  difficulty: Difficulty
  servings: number
  image: string
  ingredients: Ingredient[]
  steps: Step[]
  chefTip: string
  tags: string[]
  custom?: boolean
}
