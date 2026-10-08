import { Link } from 'react-router-dom'
import { cn } from '../../utils/format'

export default function Logo({ light = false, className, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn('group inline-flex items-center gap-2', light ? 'text-white' : 'text-ink', className)}
      aria-label="STRIDEVOLT home"
      data-cursor="hover"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[-12deg]" aria-hidden>
        <rect width="32" height="32" rx="9" fill="currentColor" />
        <path d="M18.6 5.5 9.4 17.6h6.1l-2.1 8.9 9.4-12.6h-6.3l2.1-8.4Z" fill="#2f6bff" />
      </svg>
      <span className="display-wide text-[1.15rem] tracking-[-0.02em]">Stridevolt</span>
    </Link>
  )
}
