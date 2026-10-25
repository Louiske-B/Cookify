import type { Allergen, Category, Cuisine, Diet } from '../types'
import { u } from './recipes/helpers.ts'

export const HERO_IMAGE = u('1759409117421-1a64af35f118')

export const CATEGORIES: { id: Category; label: string; plural: string; blurb: string; emoji: string }[] = [
  { id: 'ontbijt', label: 'Ontbijt', plural: 'Ontbijt', blurb: 'Een goede start van je dag', emoji: '🥞' },
  { id: 'lunch', label: 'Lunch', plural: 'Lunch', blurb: 'Fris, snel en verzadigend', emoji: '🥗' },
  { id: 'avondeten', label: 'Avondeten', plural: 'Avondeten', blurb: 'Hoofdgerechten voor aan tafel', emoji: '🍝' },
  { id: 'dessert', label: 'Desserts', plural: 'Desserts', blurb: 'Zoete verwennerij', emoji: '🍫' },
  { id: 'snack', label: 'Snacks', plural: 'Snacks', blurb: 'Lekker voor tussendoor', emoji: '🍟' },
  { id: 'sushi', label: 'Sushi', plural: 'Sushi', blurb: 'Maki, nigiri en meer', emoji: '🍣' },
]

export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? c

export const CUISINES: { id: Cuisine; label: string }[] = [
  { id: 'belgisch', label: 'Belgisch' },
  { id: 'nederlands', label: 'Nederlands' },
  { id: 'italiaans', label: 'Italiaans' },
  { id: 'frans', label: 'Frans' },
  { id: 'aziatisch', label: 'Aziatisch' },
  { id: 'japans', label: 'Japans' },
  { id: 'thais', label: 'Thais' },
  { id: 'chinees', label: 'Chinees' },
  { id: 'mexicaans', label: 'Mexicaans' },
  { id: 'midden-oosten', label: 'Midden-Oosten' },
  { id: 'amerikaans', label: 'Amerikaans' },
  { id: 'mediterraan', label: 'Mediterraan' },
  { id: 'overig', label: 'Overig' },
]

export const DIETS: { id: Diet; label: string }[] = [
  { id: 'vegetarisch', label: 'Vegetarisch' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'glutenvrij', label: 'Glutenvrij' },
]

export const ALLERGENS: { id: Allergen; label: string }[] = [
  { id: 'pinda', label: 'Pinda' },
  { id: 'noten', label: 'Noten' },
  { id: 'schaaldieren', label: 'Schaal- en weekdieren' },
  { id: 'soja', label: 'Soja' },
  { id: 'sesam', label: 'Sesam' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'vis', label: 'Vis' },
]

export const SPICE_LABELS = ['Niet pittig', 'Mild', 'Pittig', 'Heel pittig'] as const
