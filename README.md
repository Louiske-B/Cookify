# Cookify

Kooktutorial-website in het Nederlands: recepten, stap-voor-stap tutorials met timers, favorieten en eigen recepten (met foto).

**Stack:** Vite · React · TypeScript · Tailwind CSS · React Router · Framer Motion · lucide-react · idb-keyval

## Starten

```bash
npm install
npm run dev        # ontwikkelserver op http://localhost:5173
npm run build      # typecheck + productiebuild naar dist/
npm run preview    # build lokaal bekijken
npm run check-images   # controleert of alle Unsplash-foto's HTTP 200 geven en uniek zijn
npm run validate-data  # controleert receptdata (velden, dieet-tags, tijden, dubbele slugs/foto's)
```

## Opslag

- `localStorage` (met veilige fallback): favorieten, voltooide recepten, afgevinkte ingrediënten en stappen, thema.
- IndexedDB (`idb-keyval`): eigen recepten, inclusief foto. Foto's worden client-side verkleind (max. 1200 px, JPEG 0,8).

## Structuur

```
src/
  components/  herbruikbare UI (RecipeCard, Timer, Toast, ...)
  pages/       Home, Recipes, RecipeDetail, Favorites, CustomRecipe, About, NotFound
  hooks/       useFavorites, useLocalStorage, useCustomRecipes, useTimer, useTheme, ...
  data/        meta.ts (categorieën, keukens, diëten) en recipes/ (per categorie: ontbijt, lunch,
               avondeten, desserts, snacks; index.ts laadt ze lazy)
  lib/         opslag, afbeeldingen, formattering, geluid
```

## Deployen naar Cloudflare Pages (via GitHub)

1. Push dit project naar een GitHub-repository.
2. Ga in het Cloudflare-dashboard naar **Workers & Pages → Create → Pages → Connect to Git** en kies de repository.
3. Stel in:
   - **Framework preset:** None (of Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Klik op **Save and Deploy**. Elke push naar `main` deployt automatisch.

Het bestand `public/_redirects` (`/* /index.html 200`) zorgt dat routes zoals `/recepten/pasta-carbonara` ook bij herladen werken.
