import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../utils/format'

/**
 * Colour swatch picker.
 * options: [{ name, hex, accent? }]; value: selected index (or hex when `byHex`).
 */
export default function ColorSelector({ label, options, value, onChange, size = 'md', showName = true, byHex = false, light = false }) {
  const selected = byHex ? options.find((o) => o.hex === value) : options[value]
  const dims = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11'
  return (
    <fieldset>
      <legend className={cn('mb-3 flex w-full items-center justify-between text-sm', light ? 'text-white' : 'text-ink')}>
        <span className="font-semibold">{label}</span>
        {showName && selected && <span className={light ? 'text-white/60' : 'text-steel'}>{selected.name}</span>}
      </legend>
      <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={label}>
        {options.map((opt, i) => {
          const isOn = byHex ? opt.hex === value : i === value
          const isLight = ['#f4f4f0', '#fafaf8', '#ededea', '#ffffff', '#d8c8ad', '#9cc3ff'].includes(opt.hex.toLowerCase())
          return (
            <motion.button
              key={opt.name + i}
              type="button"
              role="radio"
              aria-checked={isOn}
              aria-label={opt.name}
              title={opt.name}
              onClick={() => onChange(byHex ? opt.hex : i)}
              whileTap={{ scale: 0.88 }}
              data-cursor="hover"
              className={cn(
                'relative grid place-items-center rounded-full transition-shadow duration-300',
                dims,
                isOn ? (light ? 'ring-2 ring-white ring-offset-2 ring-offset-ink' : 'ring-2 ring-ink ring-offset-2 ring-offset-white') : 'ring-1 ring-black/10 hover:ring-black/30',
              )}
              style={{
                background: opt.accent ? `linear-gradient(135deg, ${opt.hex} 55%, ${opt.accent} 55%)` : opt.hex,
              }}
            >
              {isOn && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                  <Check className={cn('h-4 w-4', isLight ? 'text-ink' : 'text-white')} strokeWidth={3} />
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
    </fieldset>
  )
}
