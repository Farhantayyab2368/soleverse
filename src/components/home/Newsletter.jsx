import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import AnimatedText from '../ui/AnimatedText'
import { isEmail } from '../../utils/format'
import { writeStorage } from '../../hooks/useLocalStorage'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!isEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 700))
    writeStorage('stridevolt:newsletter', email)
    setStatus('done')
  }

  return (
    <section className="px-3 pb-3 sm:px-5 sm:pb-5" aria-labelledby="newsletter-title">
      <div className="noise relative mx-auto max-w-[1440px] overflow-hidden rounded-[36px] bg-[radial-gradient(ellipse_at_80%_20%,#5b8cff_0%,#2f6bff_30%,#1a46d6_60%,#0f1b3d_100%)] px-6 py-20 text-white sm:px-12 lg:px-20 lg:py-28">
        <div className="grid-floor absolute inset-0 opacity-60" aria-hidden />
        <p className="display-wide pointer-events-none absolute -right-10 bottom-[-0.15em] select-none text-[30vw] leading-none text-white/[0.06] lg:text-[16vw]" aria-hidden>
          New
        </p>
        <div className="relative max-w-2xl">
          <h2 id="newsletter-title" className="display-wide text-[2.6rem] leading-[0.9] sm:text-6xl lg:text-7xl">
            <AnimatedText text="Step into something new" stagger={0.08} />
          </h2>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-md text-lg text-white/75">Get early access to new drops, exclusive releases and special offers.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 flex items-center gap-3 rounded-full bg-white/10 px-5 py-4 backdrop-blur" role="status">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <p className="font-medium">You’re in. Watch your inbox for your first drop — plus 10% off with code SOLE10.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate className="mt-10" exit={{ opacity: 0, y: -10 }}>
                  <div className="flex flex-col gap-3 rounded-[28px] bg-white/10 p-2 backdrop-blur sm:flex-row sm:rounded-full">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      autoComplete="email"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'newsletter-error' : undefined}
                      className="h-14 flex-1 rounded-full bg-transparent px-5 text-white placeholder:text-white/50 focus:outline-none"
                    />
                    <Button type="submit" variant="light" size="lg" loading={status === 'loading'} arrow>
                      Join Us
                    </Button>
                  </div>
                  {error && (
                    <p id="newsletter-error" className="mt-3 pl-5 text-sm text-white" role="alert">
                      {error}
                    </p>
                  )}
                  <p className="mt-4 pl-5 text-xs text-white/50">No spam. Unsubscribe anytime.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
