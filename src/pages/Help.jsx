import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronDown, Mail, MessageCircle, Phone, RotateCcw, Truck } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import { SizeTable } from '../components/product/SizeGuideModal'
import { Field } from '../components/checkout/CheckoutForm'
import Button from '../components/ui/Button'
import { cn, isEmail } from '../utils/format'

const FAQ = [
  { q: 'How do STRIDEVOLT shoes fit?', a: 'True to size for most feet. If you’re between sizes, go half a size up for running styles and true to size for lifestyle styles.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled within 1 hour of being placed. Contact us as soon as possible and we’ll do our best.' },
  { q: 'Do you ship internationally?', a: 'Yes — we ship to 40+ countries. Duties and taxes are calculated at checkout so there are no surprises.' },
  { q: 'How does the 3D customizer work?', a: 'Pick colours for the upper, sole, laces and accents in real time. Custom pairs are made to order and ship in 10–14 days.' },
  { q: 'What is your warranty?', a: 'Every pair is covered by a 2-year warranty against manufacturing defects.' },
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <ul className="divide-y divide-ink/5 rounded-[28px] bg-white px-6 sm:px-8">
      {FAQ.map((f, i) => (
        <li key={f.q}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-6 text-left font-semibold">
            {f.q}
            <ChevronDown className={cn('h-5 w-5 shrink-0 transition-transform', open === i && 'rotate-180')} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-steel">
                <span className="block pb-6">{f.a}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  )
}

function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!v.name.trim() || !isEmail(v.email) || v.message.trim().length < 5) {
      setError('Please fill in your name, a valid email and a short message.')
      return
    }
    setSent(true)
  }
  if (sent)
    return (
      <div className="flex items-center gap-3 rounded-[28px] bg-white p-8" role="status">
        <CheckCircle2 className="h-6 w-6 text-volt" /> Thanks {v.name.split(' ')[0]} — we’ll reply within 24 hours.
      </div>
    )
  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-[28px] bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="c-name" label="Name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
        <Field id="c-email" label="Email" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
      </div>
      <Field id="c-message" label="Message">
        <textarea id="c-message" rows={4} className="field resize-none" value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
      </Field>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" arrow>
        Send message
      </Button>
    </form>
  )
}

function Block({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 py-10">
      <h2 className="display mb-6 text-3xl sm:text-4xl">{title}</h2>
      {children}
    </section>
  )
}

export default function Help() {
  return (
    <PageTransition title="Help">
      <PageHeader eyebrow="Support" title="Help Centre" description="Shipping, returns, sizing and everything in between." crumbs={[{ label: 'Help' }]} />
      <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <nav aria-label="Help topics" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-4">
          {['contact', 'shipping', 'returns', 'size-guide', 'faq'].map((id) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold capitalize transition hover:bg-ink hover:text-white">
              {id.replace('-', ' ')}
            </a>
          ))}
        </nav>

        <Block id="contact" title="Contact">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            {[
              { icon: MessageCircle, t: 'Live chat', d: 'Mon–Fri, 8am–8pm' },
              { icon: Mail, t: 'hello@stridevolt.example', d: 'Reply within 24h' },
              { icon: Phone, t: '+1 (800) 555-0199', d: 'Toll free' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-[24px] bg-white p-5">
                <Icon className="h-5 w-5 text-volt" />
                <p className="mt-4 break-words font-semibold">{t}</p>
                <p className="text-sm text-steel">{d}</p>
              </div>
            ))}
          </div>
          <ContactForm />
        </Block>

        <Block id="shipping" title="Shipping">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white p-6">
              <Truck className="h-5 w-5 text-volt" />
              <p className="mt-4 font-semibold">Standard · Rs 299</p>
              <p className="text-sm text-steel">3–5 business days. Free on orders over Rs 50,000.</p>
            </div>
            <div className="rounded-[24px] bg-white p-6">
              <Truck className="h-5 w-5 text-volt" />
              <p className="mt-4 font-semibold">Express · Rs 799</p>
              <p className="text-sm text-steel">1–2 business days. Free for members.</p>
            </div>
          </div>
        </Block>

        <Block id="returns" title="Returns">
          <div className="flex gap-4 rounded-[24px] bg-white p-6">
            <RotateCcw className="h-5 w-5 shrink-0 text-volt" />
            <p className="text-steel">
              Not the one? Return any unwashed pair within 30 days for a full refund — even if you’ve worn them outside. Start a return
              from your account and drop it off at any carrier location.
            </p>
          </div>
        </Block>

        <Block id="size-guide" title="Size Guide">
          <SizeTable />
        </Block>

        <Block id="faq" title="FAQ">
          <Faq />
        </Block>
      </div>
    </PageTransition>
  )
}
