// Controleert of elke Unsplash-afbeelding uit src/data/recipes.ts echt laadt (HTTP 200)
// en of geen enkele foto dubbel gebruikt wordt. Ook slugs en ids moeten uniek zijn.
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../src/data/recipes.ts', import.meta.url), 'utf8')
const all = [...src.matchAll(/u\('([0-9a-z-]+)'\)/g)].map((m) => m[1])
const ids = [...new Set(all)]

let failed = 0

const dupes = ids.filter((id) => all.filter((x) => x === id).length > 1)
if (dupes.length) {
  failed += dupes.length
  dupes.forEach((d) => console.log(`DUBBEL ${d}`))
}

const slugs = [...src.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])
const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i)
if (dupSlugs.length) {
  failed += dupSlugs.length
  dupSlugs.forEach((s) => console.log(`DUBBELE SLUG ${s}`))
}
console.log(`${slugs.length} recepten, ${ids.length} unieke foto's`)

for (const id of ids) {
  const url = `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format`
  try {
    const res = await fetch(url)
    const type = res.headers.get('content-type') ?? ''
    const ok = res.status === 200 && type.startsWith('image/')
    if (!ok) failed++
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${res.status} ${id}`)
  } catch (e) {
    failed++
    console.log(`FAIL ERR ${id} ${e.message}`)
  }
}
console.log(`\n${failed ? `${failed} probleem/problemen gevonden.` : 'Alle foto\'s laden en zijn uniek.'}`)
process.exit(failed ? 1 : 0)
