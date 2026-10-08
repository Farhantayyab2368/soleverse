import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, CreditCard, Lock, Rocket, Truck } from 'lucide-react'
import Button from '../ui/Button'
import { cn, formatPrice, isEmail } from '../../utils/format'
import { SHIPPING_RATES } from '../../context/ShopContext'

const COUNTRIES = ['Pakistan', 'United Arab Emirates', 'Saudi Arabia', 'United Kingdom', 'United States', 'Canada', 'Germany', 'Australia']

export function Field({ id, label, error, className, hint, children, ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children ?? <input id={id} className="field" aria-invalid={!!error} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...props} />}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-mist">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function Section({ step, title, children }) {
  return (
    <section className="rounded-[28px] bg-white p-6 sm:p-8" aria-labelledby={`step-${step}`}>
      <h2 id={`step-${step}`} className="mb-6 flex items-center gap-3 text-lg font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function OptionCard({ name, value, checked, onChange, icon: Icon, title, desc, price }) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all',
        checked ? 'border-ink bg-paper shadow-[inset_0_0_0_1px_var(--color-ink)]' : 'border-fog hover:border-ink/40',
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', checked ? 'bg-ink text-white' : 'bg-paper text-ink')}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-steel">{desc}</span>
      </span>
      {price && <span className="font-semibold">{price}</span>}
      <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2', checked ? 'border-ink' : 'border-fog')} aria-hidden>
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
      </span>
    </label>
  )
}

const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function validate(v) {
  const e = {}
  if (!isEmail(v.email)) e.email = 'Enter a valid email address.'
  if (v.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number.'
  if (v.fullName.trim().length < 2) e.fullName = 'Enter your full name.'
  if (v.address.trim().length < 5) e.address = 'Enter your street address.'
  if (!v.city.trim()) e.city = 'Enter your city.'
  if (!/^[A-Za-z0-9\- ]{3,10}$/.test(v.postal.trim())) e.postal = 'Enter a valid postal code.'
  if (v.payment === 'card') {
    if (v.cardName.trim().length < 2) e.cardName = 'Enter the name on the card.'
    if (v.cardNumber.replace(/\s/g, '').length < 15) e.cardNumber = 'Enter a valid card number.'
    const m = v.expiry.match(/^(\d{2})\/(\d{2})$/)
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.expiry = 'Use MM/YY.'
    if (!/^\d{3,4}$/.test(v.cvc)) e.cvc = '3–4 digits.'
  }
  return e
}

export default function CheckoutForm({ initialEmail = '', initialName = '', delivery, setDelivery, onSubmit, submitting, totalLabel }) {
  const [v, setV] = useState({
    email: initialEmail,
    phone: '',
    fullName: initialName,
    address: '',
    city: '',
    postal: '',
    country: 'Pakistan',
    payment: 'card',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  })
  const [errors, setErrors] = useState({})
  const set = (key, transform) => (e) => {
    const value = transform ? transform(e.target.value) : e.target.value
    setV((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = document.getElementById(Object.keys(errs)[0])
      first?.focus()
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onSubmit({ ...v, delivery, cardLast4: v.cardNumber.replace(/\s/g, '').slice(-4) })
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Section step={1} title="Contact Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="email" label="Email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
          <Field id="phone" label="Phone" type="tel" autoComplete="tel" value={v.phone} onChange={set('phone')} error={errors.phone} placeholder="+92 300 1234567" />
        </div>
      </Section>

      <Section step={2} title="Shipping Address">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="fullName" label="Full Name" autoComplete="name" value={v.fullName} onChange={set('fullName')} error={errors.fullName} className="sm:col-span-2" />
          <Field id="address" label="Address" autoComplete="street-address" value={v.address} onChange={set('address')} error={errors.address} className="sm:col-span-2" placeholder="Street and number, apartment" />
          <Field id="city" label="City" autoComplete="address-level2" value={v.city} onChange={set('city')} error={errors.city} />
          <Field id="postal" label="Postal Code" autoComplete="postal-code" value={v.postal} onChange={set('postal')} error={errors.postal} />
          <Field id="country" label="Country" className="sm:col-span-2">
            <select id="country" className="field" value={v.country} onChange={set('country')} autoComplete="country-name">
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section step={3} title="Delivery">
        <div className="grid gap-3" role="radiogroup" aria-label="Delivery method">
          <OptionCard name="delivery" value="standard" checked={delivery === 'standard'} onChange={setDelivery} icon={Truck} title="Standard Delivery" desc="3–5 business days" price={formatPrice(SHIPPING_RATES.standard)} />
          <OptionCard name="delivery" value="express" checked={delivery === 'express'} onChange={setDelivery} icon={Rocket} title="Express Delivery" desc="1–2 business days" price={formatPrice(SHIPPING_RATES.express)} />
        </div>
      </Section>

      <Section step={4} title="Payment">
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
          <OptionCard name="payment" value="card" checked={v.payment === 'card'} onChange={(val) => setV((p) => ({ ...p, payment: val }))} icon={CreditCard} title="Credit / Debit Card" desc="Visa, Mastercard, Amex" />
          <OptionCard name="payment" value="cod" checked={v.payment === 'cod'} onChange={(val) => setV((p) => ({ ...p, payment: val }))} icon={Banknote} title="Cash on Delivery" desc="Pay when it arrives" />
        </div>
        <AnimatePresence initial={false}>
          {v.payment === 'card' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
              <div className="mt-5 rounded-2xl border border-dashed border-volt/40 bg-volt/5 px-4 py-3 text-xs text-volt-deep">
                Demo checkout — no real payment is processed. Use a test number such as 4242 4242 4242 4242.
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <Field id="cardName" label="Name on card" autoComplete="cc-name" value={v.cardName} onChange={set('cardName')} error={errors.cardName} className="sm:col-span-4" />
                <Field id="cardNumber" label="Card number" inputMode="numeric" autoComplete="cc-number" value={v.cardNumber} onChange={set('cardNumber', formatCard)} error={errors.cardNumber} placeholder="1234 5678 9012 3456" className="sm:col-span-2" />
                <Field id="expiry" label="Expiry" inputMode="numeric" autoComplete="cc-exp" value={v.expiry} onChange={set('expiry', formatExpiry)} error={errors.expiry} placeholder="MM/YY" />
                <Field id="cvc" label="CVC" inputMode="numeric" autoComplete="cc-csc" value={v.cvc} onChange={set('cvc', (x) => x.replace(/\D/g, '').slice(0, 4))} error={errors.cvc} placeholder="123" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        <Lock className="h-4 w-4" /> Place Order · {totalLabel}
      </Button>
      <p className="text-center text-xs text-mist">By placing your order you agree to our Terms and Privacy Policy.</p>
    </form>
  )
}
