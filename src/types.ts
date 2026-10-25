export type Category = 'ontbijt' | 'lunch' | 'avondeten' | 'dessert' | 'snack'
export type Difficulty = 'Makkelijk' | 'Gemiddeld' | 'Uitdagend'

export type Cuisine =
  | 'belgisch'
  | 'nederlands'
  | 'italiaans'
  | 'frans'
  | 'aziatisch'
  | 'mexicaans'
  | 'midden-oosten'
  | 'amerikaans'
  | 'mediterraan'
  | 'overig'

export type Diet = 'vegetarisch' | 'vegan' | 'glutenvrij'

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
  /** Wereldkeuken. Ontbreekt bij eigen recepten. */
  cuisine?: Cuisine
  /** Dieet-eigenschappen. Vegan impliceert vegetarisch. */
  diet?: Diet[]
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
