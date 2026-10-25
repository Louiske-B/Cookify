import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-gray-900 shadow-soft hover:bg-brand-400 hover:shadow-lift',
  secondary: 'bg-ink text-bg hover:opacity-90',
  outline: 'border-2 border-line bg-surface text-ink hover:border-brand-500 hover:text-brand-700',
  ghost: 'text-ink hover:bg-brand-50 hover:text-brand-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm sm:text-base',
  lg: 'px-7 py-3.5 text-base sm:text-lg',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type Props = CommonProps &
  (
    | ({ to: string } & { onClick?: () => void })
    | ({ to?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  )

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if ('to' in rest && rest.to) {
    return (
      <Link to={rest.to} className={cls} onClick={rest.onClick}>
        {children}
      </Link>
    )
  }
  const { to: _to, ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }
  void _to
  return (
    <button type="button" className={cls} {...btn}>
      {children}
    </button>
  )
}
