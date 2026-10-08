import { motion } from 'framer-motion'
import { Ruler } from 'lucide-react'
import { cn } from '../../utils/format'

export default function SizeSelector({ sizes, soldOut = [], value, onChange, onOpenGuide, error }) {
  return (
    <fieldset>
      <legend className="mb-3 flex w-full items-center justify-between text-sm">
        <span className="font-semibold">
          Select size <span className="font-normal text-steel">(EU)</span>
        </span>
        <button
          type="button"
          onClick={onOpenGuide}
          className="inline-flex items-center gap-1.5 text-steel underline-offset-4 transition hover:text-ink hover:underline"
          data-cursor="hover"
        >
          <Ruler className="h-4 w-4" /> Size Guide
        </button>
      </legend>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7" role="radiogroup" aria-label="Shoe size" aria-invalid={!!error}>
        {sizes.map((s) => {
          const out = soldOut.includes(s)
          const isOn = value === s
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={isOn}
              aria-label={`EU ${s}${out ? ', sold out' : ''}`}
              disabled={out}
              onClick={() => onChange(s)}
              data-cursor="hover"
              className={cn(
                'relative h-12 overflow-hidden rounded-xl border text-sm font-semibold transition-colors duration-200',
                isOn ? 'border-ink text-white' : 'border-fog bg-white hover:border-ink',
                out && 'cursor-not-allowed border-fog bg-paper text-mist line-through decoration-mist/60',
                error && !isOn && !out && 'border-red-300',
              )}
            >
              {isOn && <motion.span layoutId="size-pill" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
              <span className="relative">EU {s}</span>
            </button>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
