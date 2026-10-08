import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Tag, X } from 'lucide-react'
import { useShop } from '../../context/ShopContext'
import { formatPrice } from '../../utils/format'

function Row({ label, value, muted, accent }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? 'text-steel' : ''}>{label}</span>
      <motion.span key={value} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className={accent ? 'font-semibold text-volt' : 'font-medium tabular-nums'}>
        {value}
      </motion.span>
    </div>
  )
}

export default function OrderSummary({ shippingMethod = 'standard', showPromo = true, children }) {
  const { getTotals, promo, applyPromo, removePromo } = useShop()
  const totals = getTotals(shippingMethod)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!code.trim()) return
    if (applyPromo(code)) {
      setCode('')
      setError('')
    } else setError('That code isn’t valid. Try SOLE10.')
  }

  return (
    <div className="space-y-3">
      {showPromo && (
        <div className="pb-2">
          <AnimatePresence mode="wait" initial={false}>
            {promo ? (
              <motion.div key="on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between rounded-2xl bg-volt/10 px-4 py-3 text-sm">
                <span className="flex items-center gap-2 font-semibold text-volt">
                  <Tag className="h-4 w-4" /> {promo} applied
                </span>
                <button onClick={removePromo} className="text-steel hover:text-ink" aria-label="Remove promo code">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <motion.form key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={submit} className="flex gap-2">
                <label htmlFor="promo" className="sr-only">
                  Promo code
                </label>
                <input
                  id="promo"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Promo code (try SOLE10)"
                  className="field !rounded-full !py-2.5 text-sm"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'promo-error' : undefined}
                />
                <button type="submit" className="shrink-0 rounded-full border border-ink px-5 text-sm font-semibold transition hover:bg-ink hover:text-white">
                  Apply
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          {error && (
            <p id="promo-error" className="mt-2 text-xs text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
      <Row label="Subtotal" value={formatPrice(totals.subtotal)} muted />
      <Row label={`Shipping${shippingMethod === 'express' ? ' (Express)' : ''}`} value={totals.shipping ? formatPrice(totals.shipping) : 'Free'} muted />
      {totals.discount > 0 && <Row label="Discount" value={`−${formatPrice(totals.discount)}`} accent />}
      <div className="flex items-end justify-between border-t border-fog pt-4">
        <span className="font-semibold">Total</span>
        <motion.span key={totals.total} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="display text-2xl tabular-nums">
          {formatPrice(totals.total)}
        </motion.span>
      </div>
      {children}
    </div>
  )
}
