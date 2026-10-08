import { Link } from 'react-router-dom'
import { cn } from '../../utils/format'

export default function Logo({ light = false, className, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn('group inline-flex items-center gap-2', light ? 'text-white' : 'text-ink', className)}
      aria-label="SOLEVERSE home"
      data-cursor="hover"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[-12deg]" aria-hidden>
        <rect width="32" height="32" rx="9" fill="currentColor" />
        <path d="M7 20.5c5 1.2 12 .6 18-4.5" stroke="#2f6bff" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </svg>
      <span className="display-wide text-[1.15rem] tracking-[-0.02em]">Soleverse</span>
    </Link>
  )
}
