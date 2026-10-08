import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Cpu, Droplets, Leaf, Recycle, Sparkles, Wind } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ProductImage from '../components/product/ProductImage'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { getProduct } from '../data/products'
import { cn } from '../utils/format'

const ease = [0.22, 1, 0.36, 1]

/** Editorial "photo": a studio render staged on a styled backdrop with parallax. */
function EditorialImage({ productId, colorIndex = 0, view = 'angle', tone, word, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 4])
  const product = getProduct(productId)
  return (
    <div ref={ref} className={cn('noise relative overflow-hidden rounded-[32px]', className)} style={{ background: tone }}>
      <p className="display-wide pointer-events-none absolute -left-3 bottom-2 select-none whitespace-nowrap text-[22vw] leading-none text-white/[0.07] lg:text-[11vw]" aria-hidden>
        {word}
      </p>
      <motion.div style={{ y, rotate }} className="absolute inset-[6%]">
        <ProductImage product={product} colorIndex={colorIndex} view={view} className="absolute inset-0" alt={`${product.name} editorial`} />
      </motion.div>
    </div>
  )
}

const CHAPTERS = [
  {
    id: 'story',
    eyebrow: 'Our Story',
    title: 'Born on the track. Raised in the city.',
    body: 'STRIDEVOLT started in 2019 in a small studio with a 3D printer, a foot scanner and a simple question: what if shoes were designed around how people actually move? Seven years later, that question still shapes every pair we make.',
    image: { productId: 'aero-x1', colorIndex: 1, view: 'side', tone: 'linear-gradient(135deg,#0f1b3d,#1a46d6 60%,#5b8cff)', word: 'Origin' },
  },
  {
    id: 'mission',
    eyebrow: 'Our Mission',
    title: 'Make every step feel effortless.',
    body: 'We build performance footwear that removes friction — between you and the ground, between training and everyday life, and between great design and responsible making.',
    image: { productId: 'velocity-pro', colorIndex: 0, view: 'angle', tone: 'linear-gradient(135deg,#0a0a0c,#2a2c32)', word: 'Motion' },
  },
  {
    id: 'design',
    eyebrow: 'Our Design Philosophy',
    title: 'Nothing extra. Nothing missing.',
    body: 'Every line on a STRIDEVOLT shoe has a job. We strip away decoration until only function remains — then refine that function until it becomes beautiful.',
    image: { productId: 'eclipse-street', colorIndex: 1, view: 'angle', tone: 'linear-gradient(135deg,#d9d4ca,#f4f1ea)', word: 'Form' },
  },
]

const TECH = [
  { icon: Cpu, title: 'Digital twins', text: 'Every model is simulated in 3D thousands of times before a physical sample exists.' },
  { icon: Wind, title: 'AeroFoam™', text: 'Supercritical foam that is 38% lighter and returns 84% of your energy.' },
  { icon: Sparkles, title: 'Adaptive knit', text: 'Zoned engineered mesh that breathes where you heat up and holds where you need lockdown.' },
]

const SUSTAIN = [
  { icon: Recycle, value: '62%', label: 'Recycled materials by weight' },
  { icon: Droplets, value: '−48%', label: 'Water used vs. 2022' },
  { icon: Leaf, value: '100%', label: 'Renewable energy in our studios' },
]

export default function About() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <PageTransition title="About" darkHero>
      <section ref={heroRef} className="noise relative flex min-h-[92svh] items-end overflow-hidden bg-ink pb-20 pt-36 text-white">
        <div className="pointer-events-none absolute right-[-10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-volt/25 blur-[140px]" aria-hidden />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="eyebrow flex items-center gap-3 text-volt-glow">
            <span className="h-px w-8 bg-current" /> About STRIDEVOLT
          </motion.p>
          <h1 className="display-wide mt-6 text-[3rem] leading-[0.88] sm:text-7xl lg:text-[8.5rem]">
            {['We design', 'the next', 'step.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <motion.span className={cn('block', i === 2 && 'text-volt-glow')} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1 + i * 0.12, ease }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-8 max-w-xl text-lg text-white/60">
            A design and engineering studio obsessed with movement — building premium footwear in 3D, for real life.
          </motion.p>
        </motion.div>
      </section>

      {CHAPTERS.map((c, i) => (
        <section key={c.id} id={c.id} className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className={cn('grid items-center gap-10 lg:grid-cols-2 lg:gap-20', i % 2 && 'lg:[&>*:first-child]:order-2')}>
            <Reveal x={i % 2 ? 40 : -40} y={0}>
              <EditorialImage {...c.image} className="aspect-[4/3.4]" />
            </Reveal>
            <div>
              <Reveal>
                <p className="eyebrow flex items-center gap-3 text-volt">
                  <span className="h-px w-8 bg-current" /> {c.eyebrow}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="display mt-5 text-4xl sm:text-5xl lg:text-6xl">{c.title}</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-steel">{c.body}</p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section id="technology" className="noise relative scroll-mt-24 overflow-hidden bg-ink py-24 text-white lg:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-volt/20 blur-[120px]" aria-hidden />
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-volt-glow">
              <span className="h-px w-8 bg-current" /> Our Technology
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display mt-5 max-w-3xl text-4xl sm:text-6xl">Engineered in 3D. Proven in the real world.</h2>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {TECH.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 transition-colors hover:bg-white/[0.06]">
                <Icon className="h-7 w-7 text-volt-glow" strokeWidth={1.5} />
                <h3 className="display mt-10 text-2xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-white/55">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="sustainability" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-volt">
                <span className="h-px w-8 bg-current" /> Sustainability
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-5 text-4xl sm:text-6xl">Lighter on the planet.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-steel">
                Digital prototyping means fewer physical samples and less waste. Our uppers use recycled polyester, our laces are 100%
                recycled, and every box is plastic-free. By 2028, every STRIDEVOLT shoe will be fully recyclable through our Return &
                Renew programme.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {SUSTAIN.map(({ icon: Icon, value, label }, i) => (
                <Reveal key={label} delay={0.1 + i * 0.06} className="rounded-[24px] bg-white p-6">
                  <Icon className="h-5 w-5 text-volt" />
                  <p className="display mt-6 text-3xl">{value}</p>
                  <p className="mt-1 text-sm text-steel">{label}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal x={40} y={0}>
            <EditorialImage productId="orbit-low" colorIndex={2} view="angle" tone="linear-gradient(135deg,#0e3b26,#22a565 70%,#8fb39a)" word="Renew" className="aspect-square lg:aspect-auto lg:h-full" />
          </Reveal>
        </div>
      </section>

      <section id="careers" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[32px] bg-white p-8 sm:p-12 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow text-volt">Careers</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Build the future of movement with us.</h2>
            <p className="mt-3 max-w-xl text-steel">We’re hiring designers, engineers and storytellers in Portland, Amsterdam and Seoul.</p>
          </div>
          <Button to="/help#contact" size="lg" arrow>
            Get in touch
          </Button>
        </div>
      </section>
    </PageTransition>
  )
}
