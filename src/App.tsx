import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useTheme } from './hooks/useTheme'

const Home = lazy(() => import('./pages/Home'))
const Recipes = lazy(() => import('./pages/Recipes'))
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'))
const Favorites = lazy(() => import('./pages/Favorites'))
const CustomRecipe = lazy(() => import('./pages/CustomRecipe'))
const Cuisines = lazy(() => import('./pages/Cuisines'))
const CuisineDetail = lazy(() => import('./pages/CuisineDetail'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      <span className="sr-only">Laden…</span>
    </div>
  )
}

export default function App() {
  useTheme() // past het thema toe op <html>
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recepten" element={<Recipes />} />
          <Route path="recepten/:slug" element={<RecipeDetail />} />
          <Route path="keukens" element={<Cuisines />} />
          <Route path="keukens/:id" element={<CuisineDetail />} />
          <Route path="favorieten" element={<Favorites />} />
          <Route path="eigen-recept" element={<CustomRecipe />} />
          <Route path="over-ons" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
