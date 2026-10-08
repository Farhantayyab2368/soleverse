import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AuthLayout from '../layouts/AuthLayout'
import { Field } from '../components/checkout/CheckoutForm'
import PasswordField from '../components/ui/PasswordField'
import GoogleButton from '../components/ui/GoogleButton'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { cn, isEmail } from '../utils/format'

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const score = strength(form.password)

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (form.name.trim().length < 2) errs.name = 'Enter your full name.'
    if (!isEmail(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 8) errs.password = 'Use at least 8 characters.'
    if (form.confirm !== form.password) errs.confirm = 'Passwords don’t match.'
    setErrors(errs)
    setFormError('')
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      navigate('/account', { replace: true })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create account" heading="Join Soleverse" subheading="Become a member for early access, free express shipping and exclusive drops." productId="velocity-pro" colorIndex={0}>
      <GoogleButton />
      <form onSubmit={submit} noValidate className="space-y-5">
        <AnimatePresence>
          {formError && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {formError}
            </motion.p>
          )}
        </AnimatePresence>
        <Field id="name" label="Full Name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <div>
          <PasswordField id="password" label="Password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} hint="At least 8 characters." />
          <div className="mt-2 flex gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn('h-1 flex-1 rounded-full transition-colors duration-300', i < score ? (score < 2 ? 'bg-red-400' : score < 4 ? 'bg-amber-400' : 'bg-green-500') : 'bg-fog')} />
            ))}
          </div>
        </div>
        <PasswordField id="confirm" label="Confirm Password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        <Button type="submit" size="lg" className="w-full" loading={loading} arrow>
          Create Account
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-steel">
        Already a member?{' '}
        <Link to="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
