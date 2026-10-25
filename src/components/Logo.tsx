interface Props {
  className?: string
  withWordmark?: boolean
  size?: number
}

/** Cookify-logo: koksmuts boven een vlam in een afgeronde oranje tegel. */
export function LogoMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Cookify logo"
      className={className}
    >
      <defs>
        <linearGradient id="cookify-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FB923C" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#cookify-g)" />
      {/* koksmuts */}
      <path
        d="M19 37v-5.2A9 9 0 0 1 22 14.4a10.5 10.5 0 0 1 20 0 9 9 0 0 1 3 17.4V37z"
        fill="#fff"
      />
      <path d="M26 24v13M32 21v16M38 24v13" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
      <rect x="19" y="39" width="26" height="7" rx="3" fill="#fff" />
      {/* vlam */}
      <path
        d="M32 59c-5 0-8-3-8-7 0-3 2-5 3-7 .4 1.6 1.4 2.6 2.6 2.8-.6-3 .8-6 3.4-8 0 3 3 4.6 3 8 .6-.4 1.2-1.2 1.4-2.2 1 1.4 1.6 3 1.6 4.6 0 4.2-3 7.8-7 7.8z"
        fill="#FEF3C7"
      />
    </svg>
  )
}

export function Logo({ className = '', withWordmark = true, size = 40 }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="font-display text-2xl font-bold tracking-tight">
          Cook<span className="text-brand-700">ify</span>
        </span>
      )}
    </span>
  )
}
