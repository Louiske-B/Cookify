// Controleert of elke Unsplash-afbeelding uit src/data/recipes.ts echt laadt (HTTP 200).
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../src/data/recipes.ts', import.meta.url), 'utf8')
const ids = [...new Set([...src.matchAll(/u\('([0-9a-z-]+)'\)/g)].map((m) => m[1]))]

let failed = 0
for (const id of ids) {
  const url = `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format`
  try {
    const res = await fetch(url, { method: 'GET' })
    const type = res.headers.get('content-type') ?? ''
    const ok = res.status === 200 && type.startsWith('image/')
    if (!ok) failed++
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${res.status} ${id}`)
  } catch (e) {
    failed++
    console.log(`FAIL ERR ${id} ${e.message}`)
  }
}
console.log(`\n${ids.length - failed}/${ids.length} afbeeldingen laden correct.`)
process.exit(failed ? 1 : 0)
