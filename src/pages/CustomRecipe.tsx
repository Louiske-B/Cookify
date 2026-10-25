import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { CATEGORIES } from '../data/recipes'
import { useCustomRecipes } from '../hooks/useCustomRecipes'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Button } from '../components/Button'
import { SmartImage } from '../components/SmartImage'
import { useToast } from '../components/Toast'
import { resizeImage } from '../lib/images'
import { slugify } from '../lib/format'
import type { Category, Difficulty, Ingredient, Recipe, Step } from '../types'

interface IngRow { amount: string; unit: string; name: string }
interface StepRow { text: string; timer: string }

interface FormState {
  title: string
  category: Category | ''
  description: string
  prepTime: string
  cookTime: string
  servings: string
  difficulty: Difficulty
  ingredients: IngRow[]
  steps: StepRow[]
  chefTip: string
  image: string
}

const emptyForm = (): FormState => ({
  title: '',
  category: '',
  description: '',
  prepTime: '',
  cookTime: '0',
  servings: '4',
  difficulty: 'Makkelijk',
  ingredients: [{ amount: '', unit: '', name: '' }],
  steps: [{ text: '', timer: '' }],
  chefTip: '',
  image: '',
})

const fromRecipe = (r: Recipe): FormState => ({
  title: r.title,
  category: r.category,
  description: r.description,
  prepTime: String(r.prepTime),
  cookTime: String(r.cookTime),
  servings: String(r.servings),
  difficulty: r.difficulty,
  ingredients: r.ingredients.map((i) => ({ amount: i.amount === null ? '' : String(i.amount).replace('.', ','), unit: i.unit, name: i.name })),
  steps: r.steps.map((s) => ({ text: s.text, timer: s.timerMinutes ? String(s.timerMinutes) : '' })),
  chefTip: r.chefTip,
  image: r.image,
})

const num = (v: string) => Number(v.replace(',', '.').trim())

type Errors = Record<string, string>

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (f.title.trim().length < 3) e.title = 'Geef je recept een naam van minimaal 3 tekens.'
  if (!f.category) e.category = 'Kies een categorie.'
  if (f.description.trim().length < 10) e.description = 'Schrijf een korte beschrijving (minimaal 10 tekens).'
  if (f.prepTime.trim() === '' || isNaN(num(f.prepTime)) || num(f.prepTime) < 1) e.prepTime = 'Vul een voorbereidingstijd in van minimaal 1 minuut.'
  if (f.cookTime.trim() === '' || isNaN(num(f.cookTime)) || num(f.cookTime) < 0) e.cookTime = 'Vul een kooktijd in (0 als er niet gekookt wordt).'
  if (f.servings.trim() === '' || !Number.isInteger(num(f.servings)) || num(f.servings) < 1 || num(f.servings) > 24)
    e.servings = 'Vul een aantal porties in tussen 1 en 24.'

  const ings = f.ingredients
  const filled = ings.filter((i) => i.name.trim() || i.amount.trim() || i.unit.trim())
  if (filled.length === 0) e.ingredients = 'Voeg minimaal één ingrediënt toe.'
  ings.forEach((i, idx) => {
    const used = i.name.trim() || i.amount.trim() || i.unit.trim()
    if (used && !i.name.trim()) e[`ing-${idx}-name`] = 'Vul de naam van het ingrediënt in.'
    if (i.amount.trim() && (isNaN(num(i.amount)) || num(i.amount) <= 0)) e[`ing-${idx}-amount`] = 'Vul een geldig getal in, bijvoorbeeld 250 of 1,5.'
  })

  const steps = f.steps.filter((s) => s.text.trim() || s.timer.trim())
  if (steps.length === 0) e.steps = 'Voeg minimaal één bereidingsstap toe.'
  f.steps.forEach((s, idx) => {
    if (s.timer.trim() && !s.text.trim()) e[`step-${idx}-text`] = 'Beschrijf wat er in deze stap gebeurt.'
    if (s.timer.trim() && (isNaN(num(s.timer)) || num(s.timer) <= 0 || num(s.timer) > 600))
      e[`step-${idx}-timer`] = 'Timer in minuten, tussen 1 en 600.'
  })
  return e
}

function toRecipe(f: FormState, existing?: Recipe): Recipe {
  const prep = Math.round(num(f.prepTime))
  const cook = Math.round(num(f.cookTime))
  const ingredients: Ingredient[] = f.ingredients
    .filter((i) => i.name.trim())
    .map((i) => ({ amount: i.amount.trim() ? num(i.amount) : null, unit: i.unit.trim(), name: i.name.trim() }))
  const steps: Step[] = f.steps
    .filter((s) => s.text.trim())
    .map((s) => ({ text: s.text.trim(), ...(s.timer.trim() ? { timerMinutes: num(s.timer) } : {}) }))
  const slug = existing?.slug ?? `${slugify(f.title) || 'recept'}-${Date.now().toString(36)}`
  return {
    id: existing?.id ?? slug,
    slug,
    title: f.title.trim(),
    description: f.description.trim(),
    category: f.category as Category,
    prepTime: prep,
    cookTime: cook,
    totalTime: prep + cook,
    difficulty: f.difficulty,
    servings: Math.round(num(f.servings)),
    image: f.image,
    ingredients,
    steps,
    chefTip: f.chefTip.trim() || 'Proef tussendoor en pas de kruiden aan op jouw smaak.',
    tags: [f.category as string, 'eigen recept'],
    custom: true,
  }
}

const inputCls = (err?: string) =>
  `w-full rounded-2xl border-2 bg-surface px-4 py-2.5 text-base placeholder:text-ink-soft focus:border-brand-500 ${
    err ? 'border-red-500' : 'border-line'
  }`

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-ink-soft">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default function CustomRecipe() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { customRecipes, add, update, remove } = useCustomRecipes()
  const { toast } = useToast()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Recipe | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const loadedFor = useRef<string | null>(null)

  const editId = params.get('bewerk')
  const editing = editId ? customRecipes.find((r) => r.id === editId) : undefined

  useDocumentMeta(editing ? 'Recept bewerken' : 'Eigen recept toevoegen', 'Voeg je eigen recept met foto toe aan Cookify en volg het als stap-voor-stap tutorial.')

  useEffect(() => {
    if (editing && loadedFor.current !== editing.id) {
      loadedFor.current = editing.id
      setForm(fromRecipe(editing))
      setErrors({})
    }
    if (!editId) loadedFor.current = null
  }, [editing, editId])

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }))
  const setIng = (i: number, patch: Partial<IngRow>) =>
    setForm((f) => ({ ...f, ingredients: f.ingredients.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }))
  const setStep = (i: number, patch: Partial<StepRow>) =>
    setForm((f) => ({ ...f, steps: f.steps.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }))

  const onPhoto = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((e) => ({ ...e, image: 'Dit bestand is geen afbeelding. Kies een JPG, PNG of WebP.' }))
      return
    }
    setPhotoBusy(true)
    try {
      const data = await resizeImage(file)
      set('image', data)
      setErrors((e) => {
        const { image: _i, ...rest } = e
        void _i
        return rest
      })
    } catch {
      setErrors((e) => ({ ...e, image: 'De foto kon niet worden verwerkt. Probeer een andere afbeelding.' }))
    } finally {
      setPhotoBusy(false)
    }
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      toast({ message: 'Controleer de gemarkeerde velden en probeer opnieuw.', tone: 'info' })
      window.setTimeout(() => {
        const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
        first?.focus()
        first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 50)
      return
    }
    setSaving(true)
    try {
      const recipe = toRecipe(form, editing)
      if (editing) await update(recipe)
      else await add(recipe)
      toast({ message: editing ? 'Wijzigingen opgeslagen!' : 'Je recept is opgeslagen! 🎉' })
      navigate(`/recepten/${recipe.slug}`)
    } catch {
      toast({ message: 'Opslaan is niet gelukt. Controleer of je browser opslag toestaat.', tone: 'info' })
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setParams({}, { replace: true })
    setForm(emptyForm())
    setErrors({})
  }

  const errProps = (key: string) => ({
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `${key}-err` : undefined,
  })

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-700">Eigen creatie</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">{editing ? 'Recept bewerken' : 'Eigen recept toevoegen'}</h1>
        <p className="mt-3 text-lg text-ink-soft">
          Deel je favoriete gerecht met jezelf. Het recept wordt veilig in je browser bewaard, inclusief foto.
        </p>
      </header>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-10 space-y-8" aria-label="Receptformulier">
        <section className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <h2 className="text-2xl font-bold sm:col-span-2">Basis</h2>
          <div className="sm:col-span-2">
            <Field id="title" label="Naam van het recept" error={errors.title}>
              <input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls(errors.title)} placeholder="Bijv. Oma's appeltaart" {...errProps('title')} />
            </Field>
          </div>
          <Field id="category" label="Categorie" error={errors.category}>
            <select id="category" value={form.category} onChange={(e) => set('category', e.target.value as Category)} className={inputCls(errors.category)} {...errProps('category')}>
              <option value="">Kies een categorie…</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Field>
          <Field id="difficulty" label="Moeilijkheid">
            <select id="difficulty" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value as Difficulty)} className={inputCls()}>
              <option>Makkelijk</option>
              <option>Gemiddeld</option>
              <option>Uitdagend</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field id="description" label="Korte beschrijving" error={errors.description}>
              <textarea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls(errors.description)} placeholder="Waarom is dit recept zo lekker?" {...errProps('description')} />
            </Field>
          </div>
          <Field id="prepTime" label="Voorbereidingstijd (min)" error={errors.prepTime}>
            <input id="prepTime" inputMode="numeric" value={form.prepTime} onChange={(e) => set('prepTime', e.target.value)} className={inputCls(errors.prepTime)} placeholder="15" {...errProps('prepTime')} />
          </Field>
          <Field id="cookTime" label="Kooktijd (min)" error={errors.cookTime}>
            <input id="cookTime" inputMode="numeric" value={form.cookTime} onChange={(e) => set('cookTime', e.target.value)} className={inputCls(errors.cookTime)} placeholder="20" {...errProps('cookTime')} />
          </Field>
          <Field id="servings" label="Aantal porties" error={errors.servings}>
            <input id="servings" inputMode="numeric" value={form.servings} onChange={(e) => set('servings', e.target.value)} className={inputCls(errors.servings)} {...errProps('servings')} />
          </Field>
          <Field id="chefTip" label="Chef-tip (optioneel)">
            <input id="chefTip" value={form.chefTip} onChange={(e) => set('chefTip', e.target.value)} className={inputCls()} placeholder="Jouw beste kooktruc" />
          </Field>
        </section>

        <section className="card p-6 sm:p-8" aria-labelledby="foto-titel">
          <h2 id="foto-titel" className="text-2xl font-bold">Foto</h2>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              {form.image ? (
                <SmartImage src={form.image} alt="Voorbeeld van je geüploade foto" aspect="aspect-[4/3]" className="rounded-2xl" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-line bg-muted text-ink-soft">
                  <ImagePlus className="h-10 w-10" aria-hidden />
                  <span className="sr-only">Nog geen foto gekozen</span>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="image" className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-line bg-surface px-5 py-2.5 font-semibold hover:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500">
                <ImagePlus className="h-5 w-5" aria-hidden />
                {photoBusy ? 'Foto verwerken…' : form.image ? 'Andere foto kiezen' : 'Foto kiezen'}
                <input id="image" type="file" accept="image/*" className="sr-only" onChange={(e) => { void onPhoto(e.target.files?.[0]); e.target.value = '' }} aria-describedby="image-hint" />
              </label>
              {form.image && (
                <button type="button" onClick={() => set('image', '')} className="ml-3 text-sm font-semibold text-red-600 hover:underline dark:text-red-400">
                  Foto verwijderen
                </button>
              )}
              <p id="image-hint" className="mt-2 text-sm text-ink-soft">Optioneel. De foto wordt automatisch verkleind (max. 1200 px breed).</p>
              {errors.image && <p role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">{errors.image}</p>}
            </div>
          </div>
        </section>

        <section className="card p-6 sm:p-8" aria-labelledby="ing-titel">
          <h2 id="ing-titel" className="text-2xl font-bold">Ingrediënten</h2>
          {errors.ingredients && <p role="alert" className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{errors.ingredients}</p>}
          <ul className="mt-4 space-y-3">
            {form.ingredients.map((row, i) => (
              <li key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:grid-cols-[110px_130px_1fr_auto]">
                <div>
                  <label htmlFor={`ing-${i}-amount`} className="sr-only">Hoeveelheid ingrediënt {i + 1}</label>
                  <input id={`ing-${i}-amount`} value={row.amount} onChange={(e) => setIng(i, { amount: e.target.value })} placeholder="Hoeveelheid" inputMode="decimal" className={inputCls(errors[`ing-${i}-amount`])} {...errProps(`ing-${i}-amount`)} />
                </div>
                <div>
                  <label htmlFor={`ing-${i}-unit`} className="sr-only">Eenheid ingrediënt {i + 1}</label>
                  <input id={`ing-${i}-unit`} value={row.unit} onChange={(e) => setIng(i, { unit: e.target.value })} placeholder="Eenheid (g, ml…)" className={inputCls()} />
                </div>
                <div className="col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-auto sm:row-start-auto">
                  <label htmlFor={`ing-${i}-name`} className="sr-only">Naam ingrediënt {i + 1}</label>
                  <input id={`ing-${i}-name`} value={row.name} onChange={(e) => setIng(i, { name: e.target.value })} placeholder="Naam, bijv. bloem" className={inputCls(errors[`ing-${i}-name`])} {...errProps(`ing-${i}-name`)} />
                </div>
                <button type="button" onClick={() => set('ingredients', form.ingredients.length > 1 ? form.ingredients.filter((_, idx) => idx !== i) : [{ amount: '', unit: '', name: '' }])} aria-label={`Verwijder ingrediënt ${i + 1}`} className="self-start rounded-full p-3 text-ink-soft hover:bg-muted hover:text-red-600">
                  <X className="h-5 w-5" aria-hidden />
                </button>
                {(errors[`ing-${i}-amount`] || errors[`ing-${i}-name`]) && (
                  <div className="col-span-full">
                    {errors[`ing-${i}-amount`] && <p id={`ing-${i}-amount-err`} role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{errors[`ing-${i}-amount`]}</p>}
                    {errors[`ing-${i}-name`] && <p id={`ing-${i}-name-err`} role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{errors[`ing-${i}-name`]}</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => set('ingredients', [...form.ingredients, { amount: '', unit: '', name: '' }])}>
            <Plus className="h-4 w-4" aria-hidden /> Ingrediënt toevoegen
          </Button>
        </section>

        <section className="card p-6 sm:p-8" aria-labelledby="stap-titel">
          <h2 id="stap-titel" className="text-2xl font-bold">Bereidingsstappen</h2>
          {errors.steps && <p role="alert" className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{errors.steps}</p>}
          <ol className="mt-4 space-y-4">
            {form.steps.map((row, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-display font-bold text-gray-900" aria-hidden>{i + 1}</span>
                <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_150px]">
                  <div>
                    <label htmlFor={`step-${i}-text`} className="sr-only">Beschrijving stap {i + 1}</label>
                    <textarea id={`step-${i}-text`} rows={2} value={row.text} onChange={(e) => setStep(i, { text: e.target.value })} placeholder="Beschrijf de stap…" className={inputCls(errors[`step-${i}-text`])} {...errProps(`step-${i}-text`)} />
                    {errors[`step-${i}-text`] && <p id={`step-${i}-text-err`} role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">{errors[`step-${i}-text`]}</p>}
                  </div>
                  <div>
                    <label htmlFor={`step-${i}-timer`} className="sr-only">Timer in minuten voor stap {i + 1}</label>
                    <input id={`step-${i}-timer`} value={row.timer} onChange={(e) => setStep(i, { timer: e.target.value })} placeholder="Timer (min)" inputMode="decimal" className={inputCls(errors[`step-${i}-timer`])} {...errProps(`step-${i}-timer`)} />
                    {errors[`step-${i}-timer`] && <p id={`step-${i}-timer-err`} role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">{errors[`step-${i}-timer`]}</p>}
                  </div>
                </div>
                <button type="button" onClick={() => set('steps', form.steps.length > 1 ? form.steps.filter((_, idx) => idx !== i) : [{ text: '', timer: '' }])} aria-label={`Verwijder stap ${i + 1}`} className="self-start rounded-full p-3 text-ink-soft hover:bg-muted hover:text-red-600">
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </li>
            ))}
          </ol>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => set('steps', [...form.steps, { text: '', timer: '' }])}>
            <Plus className="h-4 w-4" aria-hidden /> Stap toevoegen
          </Button>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving || photoBusy} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-lg font-semibold text-gray-900 shadow-soft transition hover:bg-brand-400 disabled:opacity-50">
            {saving ? 'Opslaan…' : editing ? 'Wijzigingen opslaan' : 'Recept opslaan'}
          </button>
          {editing && <Button variant="outline" size="lg" onClick={cancelEdit}>Annuleren</Button>}
        </div>
      </form>

      <section className="mt-16" aria-labelledby="mijn-recepten">
        <h2 id="mijn-recepten" className="text-3xl font-bold">Mijn recepten</h2>
        {customRecipes.length === 0 ? (
          <p className="mt-4 text-ink-soft">Je hebt nog geen eigen recepten. Vul het formulier hierboven in om te beginnen.</p>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {customRecipes.map((r) => (
              <li key={r.id} className="card flex items-center gap-4 p-3 pr-4">
                <SmartImage src={r.image} alt="" aspect="aspect-square" width={200} className="w-24 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <Link to={`/recepten/${r.slug}`} className="block truncate font-display text-lg font-bold hover:text-brand-700">{r.title}</Link>
                  <p className="text-sm text-ink-soft">{r.totalTime} min · {r.difficulty}</p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => { setParams({ bewerk: r.id }, { replace: true }); formRef.current?.scrollIntoView({ behavior: 'smooth' }) }} aria-label={`Bewerk ${r.title}`} className="rounded-full p-2.5 hover:bg-muted hover:text-brand-700">
                    <Pencil className="h-5 w-5" aria-hidden />
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(r)} aria-label={`Verwijder ${r.title}`} className="rounded-full p-2.5 hover:bg-muted hover:text-red-600">
                    <Trash2 className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AnimatePresence>
        {confirmDelete && (
          <ConfirmDialog
            title={`“${confirmDelete.title}” verwijderen?`}
            text="Dit recept wordt definitief verwijderd. Dit kun je niet ongedaan maken."
            onCancel={() => setConfirmDelete(null)}
            onConfirm={async () => {
              const r = confirmDelete
              setConfirmDelete(null)
              await remove(r.id)
              if (editId === r.id) cancelEdit()
              toast({ message: `${r.title} is verwijderd.`, tone: 'info' })
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ConfirmDialog({ title, text, onCancel, onConfirm }: { title: string; text: string; onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])
  return (
    <motion.div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dlg-title"
        aria-describedby="dlg-text"
        className="card w-full max-w-md p-7"
        initial={{ scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dlg-title" className="text-2xl font-bold">{title}</h2>
        <p id="dlg-text" className="mt-2 text-ink-soft">{text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} className="rounded-full border-2 border-line px-5 py-2.5 font-semibold hover:border-brand-500">Annuleren</button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700">Ja, verwijderen</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
