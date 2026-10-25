// Controleert de receptdata op volledigheid, consistentie en dieet-tags.
// Gebruik: node scripts/validate-data.mjs   (Node 22.18+ draait .ts-bestanden zonder extra tooling)
import { loadBuiltInRecipes } from '../src/data/recipes/index.ts'

const recipes = await loadBuiltInRecipes()
const problems = []
const warn = (r, msg) => problems.push(`${r.slug}: ${msg}`)

const MEAT = /\b(kip|kipfilet|kippen|rund|rundvlees|rundergehakt|gehakt|spek|spekblokjes|ham|worst|rookworst|chorizo|zalm|tonijn|vis|garnalen?|mosselen|bacon|lam|lams|varken|kalf|ansjovis|gelatine|vlees|biefstuk|entrecote|kabeljauw|kalkoen|eend|pancetta|guanciale|salami|schol|haring|krab|reepjes kip|draadjesvlees|speklapjes|runderbouillon|kippenbouillon|vissaus)\b/i
const ANIMAL = /\b(ei|eieren|eidooiers?|eiwit(ten)?|melk|boter|kaas|room|slagroom|zure room|yoghurt|honing|feta|mozzarella|parmezaan|pecorino|roomkaas|mascarpone|mayonaise|ricotta|kwark|karnemelk|cheddar|gruyère|geitenkaas|brie|halloumi|crème fraîche|condensmelk|vla)\b/i
const VEGAN_OK = /(kokos|plantaardig|soja|amandel|haver|rijst)(melk|drank|room|yoghurt|boter)|pindaboter|notenboter|amandelboter|kokosboter|plantaardige boter|veganistisch|vegan/i
const GLUTEN = /\b(bloem|pasta|spaghetti|penne|fusilli|macaroni|tagliatelle|lasagnebladen|gnocchi|brood|broodje|broodjes|stokbrood|ciabatta|baguette|pita|tortilla|tortilla's|wrap|paneermeel|couscous|bulgur|sojasaus|bladerdeeg|filodeeg|deeg|pizzadeeg|wafel|koekjes|speculaas|digestive|lange vingers|noedels|vermicelli|surimi|krabstick|beschuit|bier|havermout|granola|seitan|croutons|loempiavellen|gyozavellen|bakmeel|rijstwafel|mie|udon|ramen|biscuit)\b/i

const slugSet = new Set(recipes.map((r) => r.slug))
const RAW_FISH = /sashimi|rauwe? (zalm|tonijn|vis)|sushi-?kwaliteit/i
const seen = new Map()
const imgs = new Map()
for (const r of recipes) {
  if (seen.has(r.slug)) warn(r, 'dubbele slug')
  seen.set(r.slug, true)
  for (const k of ['title', 'description', 'category', 'cuisine', 'difficulty', 'chefTip']) if (!r[k]) warn(r, `ontbreekt: ${k}`)
  if (!Array.isArray(r.diet)) warn(r, 'diet ontbreekt')
  if (!r.image) warn(r, 'geen hoofdfoto')
  imgs.set(r.image, [...(imgs.get(r.image) ?? []), r.slug])
  for (const s of r.steps) if (s.image) imgs.set(s.image, [...(imgs.get(s.image) ?? []), r.slug + ' (stap)'])
  if (r.totalTime !== r.prepTime + r.cookTime) warn(r, 'totalTime klopt niet')
  if (r.ingredients.length < 3) warn(r, 'minder dan 3 ingrediënten')
  if (r.steps.length < 3) warn(r, 'minder dan 3 stappen')
  if (!r.tags?.length) warn(r, 'geen tags')
  if (r.description.length < 40) warn(r, 'beschrijving te kort')
  if (r.servings < 1) warn(r, 'porties')
  for (const i of r.ingredients) if (!i.name || (i.amount !== null && !(i.amount > 0))) warn(r, `ingrediënt ongeldig: ${JSON.stringify(i)}`)
  const bakeWords = /(bak|kook|stoof|oven|sudder|prut|rijs|rust|marineer|afkoel|opstijf|weken|laat)/i
  const untimed = r.steps.filter((s) => !s.timerMinutes && /\b(\d+)\s*(minuten|min|uur|uren)\b/i.test(s.text))
  if (untimed.length && bakeWords.test(untimed[0].text)) warn(r, `stap noemt tijd maar heeft geen timer: "${untimed[0].text.slice(0, 50)}…"`)
  const tot = r.steps.reduce((n, s) => n + (s.timerMinutes ?? 0), 0)
  if (r.cookTime >= 20 && tot < r.cookTime * 0.4 && !/frituur|marineer/.test(r.slug)) warn(r, `timers (${tot} min) dekken kooktijd (${r.cookTime}) slecht`)

  const names = r.ingredients.map((i) => i.name).join(' | ')
  if (r.basisRecept && !slugSet.has(r.basisRecept)) warn(r, `basisRecept bestaat niet: ${r.basisRecept}`)
  if (r.basisRecept === r.slug) warn(r, 'basisRecept verwijst naar zichzelf')
  if (RAW_FISH.test(names) && !r.rauweVis) warn(r, 'rauwe vis maar geen rauweVis-waarschuwing')
  if (r.rauweVis && !RAW_FISH.test(names)) warn(r, 'rauweVis-waarschuwing maar geen rauwe vis in de ingrediënten')
  if (r.rauweVis && r.rauweVis.alternatief.length < 20) warn(r, 'alternatief te kort')
  if (r.rauweVis && (r.diet ?? []).some((d) => d === 'vegetarisch' || d === 'vegan')) warn(r, 'vegetarisch met rauwe vis')
  const veg = r.diet?.includes('vegetarisch') || r.diet?.includes('vegan')
  if (veg && MEAT.test(names)) warn(r, `vegetarisch maar bevat vlees/vis: ${names.match(MEAT)[0]}`)
  if (r.diet?.includes('vegan')) {
    const hit = r.ingredients.filter((i) => ANIMAL.test(i.name) && !VEGAN_OK.test(i.name)).map((i) => i.name)
    if (hit.length) warn(r, `vegan maar bevat: ${hit.join(', ')}`)
  }
  if (r.diet?.includes('glutenvrij')) {
    const hit = r.ingredients.filter((i) => GLUTEN.test(i.name) && !/glutenvrij|rijst(bloem|noedels|papier|wafel)|maïs|mais|boekweit/i.test(i.name)).map((i) => i.name)
    if (hit.length) warn(r, `glutenvrij maar bevat: ${hit.join(', ')}`)
  }
}
for (const [img, who] of imgs) if (who.length > 1) problems.push(`foto dubbel (${who.length}x): ${img} → ${who.join(', ')}`)

const by = (f) => recipes.reduce((m, r) => ((m[f(r)] = (m[f(r)] ?? 0) + 1), m), {})
console.log('totaal', recipes.length)
console.log('categorie', by((r) => r.category))
console.log('keuken', by((r) => r.cuisine))
console.log('moeilijkheid', by((r) => r.difficulty))
console.log('onder 20 min', recipes.filter((r) => r.totalTime < 20).length)
console.log('vegetarisch (incl. vegan)', recipes.filter((r) => r.diet?.some((d) => d === 'vegetarisch' || d === 'vegan')).length)
console.log('vegan', recipes.filter((r) => r.diet?.includes('vegan')).length, ' glutenvrij', recipes.filter((r) => r.diet?.includes('glutenvrij')).length)
console.log(problems.length ? `\n${problems.length} PROBLEMEN:\n` + problems.join('\n') : '\nGeen problemen gevonden.')
process.exit(problems.length ? 1 : 0)
