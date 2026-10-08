import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AuthLayout from '../layouts/AuthLayout'
import { Field } from '../components/checkout/CheckoutForm'
import PasswordField from '../components/ui/PasswordField'
import GoogleButton from '../components/ui/GoogleButton'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { isEmail } from '../utils/format'

function ForgotPassword({ open, onClose, defaultEmail }) {
  const [email, setEmail] = useState(defaultEmail)
  const [sent, setSent] = useState(false)
  return (
    <Modal open={open} onClose={onClose} title="Reset password">
      <div className="px-6 pb-7 pt-3">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.p key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-steel" role="status">
              If an account exists for <strong className="text-ink">{email}</strong>, you’ll receive a reset link shortly. (Demo — no email is sent.)
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={(e) => {
                e.preventDefault()
                if (isEmail(email)) setSent(true)
              }}
              className="space-y-4"
            >
              <p className="text-sm text-steel">Enter your email and we’ll send you a link to reset your password.</p>
              <Field id="reset-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-autofocus />
              <Button type="submit" className="w-full" disabled={!isEmail(email)}>
                Send reset link
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgot, setForgot] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!isEmail(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.password) errs.password = 'Enter your password.'
    setErrors(errs)
    setFormError('')
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      await login(form)
      navigate(location.state?.from ?? '/account', { replace: true })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Log in" heading="Welcome back" subheading="Log in to track orders, save favourites and check out faster.">
      <GoogleButton />
      <form onSubmit={submit} noValidate className="space-y-5">
        <AnimatePresence>
          {formError && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {formError}
            </motion.p>
          )}
        </AnimatePresence>
        <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          extra={
            <button type="button" onClick={() => setForgot(true)} className="text-sm text-steel underline-offset-4 hover:text-ink hover:underline">
              Forgot password?
            </button>
          }
        />
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="h-4 w-4 rounded accent-volt" />
          Remember me
        </label>
        <Button type="submit" size="lg" className="w-full" loading={loading} arrow>
          Login
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-steel">
        New to SOLEVERSE?{' '}
        <Link to="/signup" className="font-semibold text-ink underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
      <ForgotPassword open={forgot} onClose={() => setForgot(false)} defaultEmail={form.email} />
    </AuthLayout>
  )
}
