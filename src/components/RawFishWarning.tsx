import { AlertTriangle, ShieldCheck } from 'lucide-react'

/** Vaste waarschuwingstekst voor rauwe vis, op één plek bewaard. */
export function RawFishNotice({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm ${className}`}>
      Gebruik alleen verse vis van <strong>&ldquo;sushi-kwaliteit&rdquo;</strong> van een betrouwbare visboer, die eerst
      diepgevroren is geweest (minstens 24 uur op −20&nbsp;°C) om parasieten te doden. Rauwe vis wordt afgeraden voor
      zwangere vrouwen, jonge kinderen en mensen met een verzwakte weerstand.
    </p>
  )
}

/** Waarschuwingskader bovenaan de bereiding van een recept met rauwe vis, inclusief veilig alternatief. */
export function RawFishWarning({ alternatief }: { alternatief: string }) {
  return (
    <aside
      aria-labelledby="rauwe-vis-titel"
      data-testid="rauwe-vis"
      className="mt-6 rounded-3xl border-2 border-amber-500/60 bg-amber-50 p-5 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
        <div>
          <h3 id="rauwe-vis-titel" className="font-display text-lg font-bold">
            Let op: rauwe vis
          </h3>
          <RawFishNotice className="mt-1" />
          <p className="mt-3 flex items-start gap-2 text-sm">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden />
            <span>
              <strong>Veilig alternatief:</strong> {alternatief}
            </span>
          </p>
        </div>
      </div>
    </aside>
  )
}
