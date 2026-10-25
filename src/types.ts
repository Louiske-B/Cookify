export type Category = 'ontbijt' | 'lunch' | 'avondeten' | 'dessert' | 'snack' | 'sushi'
export type Difficulty = 'Makkelijk' | 'Gemiddeld' | 'Uitdagend'

export type Cuisine =
  | 'belgisch'
  | 'nederlands'
  | 'italiaans'
  | 'frans'
  | 'aziatisch'
  | 'japans'
  | 'thais'
  | 'chinees'
  | 'mexicaans'
  | 'midden-oosten'
  | 'amerikaans'
  | 'mediterraan'
  | 'overig'

export type Diet = 'vegetarisch' | 'vegan' | 'glutenvrij'

export type Allergen = 'pinda' | 'noten' | 'schaaldieren' | 'soja' | 'sesam' | 'gluten' | 'vis'

/** 0 = niet pittig, 1 = mild, 2 = pittig, 3 = heel pittig */
export type SpiceLevel = 0 | 1 | 2 | 3

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
  /** Pittigheid van 0 (niet pittig) tot 3 (heel pittig). Ontbreekt = niet pittig. */
  pittig?: SpiceLevel
  /** Allergenen waar relevant (bij de Aziatische keukens altijd ingevuld). */
  allergenen?: Allergen[]
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
  /** Slug van een recept dat eerst gemaakt moet worden (bv. sushirijst). */
  basisRecept?: string
  /** Recept met rauwe vis: toont een vaste veiligheidswaarschuwing met dit alternatief. */
  rauweVis?: { alternatief: string }
  custom?: boolean
}
