import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { SpinScene } from '../three/Lazy3D'
import { cn } from '../../utils/format'

const STEPS = [
  {
    eyebrow: '360° Aero X1',
    title: 'Every angle, engineered.',
    text: 'Scroll to spin. Each panel, seam and sole edge is shaped in 3D before it ever reaches a factory.',
    name: 'Volt Bone',
    colors: { main: '#ededea', sole: '#fafaf8', lace: '#121316', accent: '#2f6bff' },
    glow: 'rgb(47 107 255 / 0.35)',
  },
  {
    eyebrow: 'Engineered knit',
    title: 'Breathes where you heat up.',
    text: 'A zoned knit upper opens up over the forefoot and tightens around the midfoot for a locked-in feel.',
    name: 'Midnight Navy',
    colors: { main: '#1b2a52', sole: '#fafaf8', lace: '#fafaf8', accent: '#5b8cff' },
    glow: 'rgb(91 140 255 / 0.3)',
  },
  {
    eyebrow: 'AeroFoam™ midsole',
    title: 'Light. Springy. Relentless.',
    text: 'Supercritical foam returns 84% of your energy and stays soft from your first mile to your hundredth.',
    name: 'Ember Rush',
    colors: { main: '#ff6a1a', sole: '#fafaf8', lace: '#fafaf8', accent: '#121316' },
    glow: 'rgb(255 106 26 / 0.3)',
  },
  {
    eyebrow: 'Made your way',
    title: 'One shoe. Endless colourways.',
    text: 'Pick your upper, sole, laces and stripes in the 3D customizer — every pair is made to order.',
    name: 'Moss Gum',
    colors: { main: '#22a565', sole: '#d8c8ad', lace: '#fafaf8', accent: '#fafaf8' },
    glow: 'rgb(34 165 101 / 0.3)',
  },
]

const ease = [0.22, 1, 0.36, 1]

export default function SpinShowcase() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length * 0.999)))))
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const current = STEPS[step]

  return (
    <section ref={ref} className="relative h-[320vh] bg-ink text-white lg:h-[420vh]" aria-label="360 degree product showcase">
      <div className="noise sticky top-0 h-[100svh] overflow-hidden">
        {/* colour-matched glow that shifts with each step */}
        <motion.div
          className="absolute inset-0"
          animate={{ background: `radial-gradient(ellipse 55% 55% at 68% 50%, ${current.glow}, transparent 70%)` }}
          transition={{ duration: 1.2, ease }}
          aria-hidden
        />
        <motion.div
          style={{ rotate: ringRotate }}
          className="absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 lg:left-[66%] lg:top-1/2"
          aria-hidden
        />
        <p className="display-wide text-outline pointer-events-none absolute bottom-4 left-0 select-none whitespace-nowrap text-[22vw] leading-none lg:text-[13vw]" aria-hidden>
          360°
        </p>

        <SpinScene progress={scrollYProgress} colors={current.colors} />

        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-16 sm:px-8 lg:justify-center lg:px-12 lg:pb-0">
          <div className="max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
                transition={{ duration: 0.55, ease }}
              >
                <p className="eyebrow flex items-center gap-3 text-volt-glow">
                  <span className="font-mono">0{step + 1}</span>
                  <span className="h-px w-8 bg-current" /> {current.eyebrow}
                </p>
                <h2 className="display mt-4 text-[2.3rem] sm:text-5xl lg:text-6xl">{current.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">{current.text}</p>
                <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm backdrop-blur">
                  <span className="h-3 w-3 rounded-full ring-1 ring-white/30" style={{ background: current.colors.main }} />
                  Colourway · {current.name}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex gap-2">
              {STEPS.map((s, i) => (
                <span key={s.name} className={cn('h-1.5 rounded-full transition-all duration-500', i === step ? 'w-10 bg-white' : 'w-1.5 bg-white/25')} />
              ))}
            </div>
            <div className="relative h-px w-32 overflow-hidden bg-white/15">
              <motion.span className="absolute inset-0 origin-left bg-volt" style={{ scaleX: barScale }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
