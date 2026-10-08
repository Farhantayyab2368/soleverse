import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/format'

export default function QuantityPicker({ value, onChange, min = 1, max = 10, size = 'md', label = 'Quantity' }) {
  const btn = size === 'sm' ? 'h-8 w-8' : 'h-12 w-12'
  return (
    <div className={cn('inline-flex items-center rounded-full border border-fog bg-white', size === 'sm' ? 'h-9' : 'h-12')} role="group" aria-label={label}>
      <button
        type="button"
        className={cn('grid place-items-center rounded-full transition hover:bg-paper disabled:opacity-30', btn)}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn('min-w-6 text-center font-semibold tabular-nums', size === 'sm' ? 'text-sm' : 'text-base')} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cn('grid place-items-center rounded-full transition hover:bg-paper disabled:opacity-30', btn)}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
