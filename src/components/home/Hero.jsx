import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Box } from 'lucide-react'
import Button from '../ui/Button'
import { HeroScene } from '../three/Lazy3D'
import CountUp from '../ui/CountUp'

const ease = [0.22, 1, 0.36, 1]

function Line({ children, delay, className }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span className={`block ${className ?? ''}`} initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  )
}

const STATS = [
  { value: '238g', label: 'Featherweight build' },
  { value: '84%', label: 'Energy return' },
  { value: '100%', label: 'Recycled laces' },
]

export default function Hero({ ready = true }) {
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], [0, 120])
  const contentOpacity = useTransform(scrollY, [0, 450], [1, 0])
  const d = ready ? 0 : 1.2

  const explore3D = () => document.getElementById('explore-3d')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section className="noise relative h-[100svh] min-h-[680px] overflow-hidden bg-ink text-white" aria-labelledby="hero-title">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_45%,rgb(47_107_255/0.35)_0%,rgb(26_70_214/0.12)_40%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_10%_100%,rgb(91_140_255/0.15),transparent_70%)]" />
        <div className="grid-floor absolute inset-x-0 bottom-0 h-2/3 [transform:perspective(600px)_rotateX(55deg)] [transform-origin:bottom]" />
        <motion.p
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: d + 0.2, ease }}
          className="display-wide text-outline absolute left-1/2 top-[18%] -translate-x-1/2 whitespace-nowrap text-[28vw] lg:top-[14%] lg:text-[19vw]"
        >
          Soleverse
        </motion.p>
      </div>

      {/* mount WebGL after the intro loader so its exit animation stays smooth */}
      {ready && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease }}>
          <HeroScene />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-24 sm:px-8 lg:justify-center lg:px-12 lg:pb-0"
      >
        <div className="pointer-events-auto max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: d + 0.1, ease }}
            className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-white/80 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt" /> New · Aero X1 Collection
          </motion.p>
          <h1 id="hero-title" className="display-wide text-[2.9rem] leading-[0.86] sm:text-7xl lg:text-[6.6rem] xl:text-[7.6rem]">
            <Line delay={d + 0.15}>Step into</Line>
            <Line delay={d + 0.28} className="bg-gradient-to-r from-white via-[#b9cdff] to-volt-glow bg-clip-text text-transparent">
              the future
            </Line>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: d + 0.5, ease }}
            className="mt-6 max-w-md text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Engineered for movement. Designed for your next step.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: d + 0.62, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button to="/shop" variant="light" size="lg" arrow>
              Shop Collection
            </Button>
            <Button onClick={explore3D} variant="glass" size="lg">
              <Box className="h-4 w-4" /> Explore 3D
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating product tag */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: d + 1, ease }}
        className="absolute right-8 top-[22%] z-10 hidden xl:block"
      >
        <Link to="/product/aero-x1" className="glass-dark group flex items-center gap-4 rounded-2xl border border-white/10 p-4 pr-5 transition hover:border-white/25" data-cursor="hover">
          <div>
            <p className="eyebrow text-[0.6rem] text-volt-glow">Just dropped</p>
            <p className="mt-1 font-semibold">Aero X1 — Volt Bone</p>
            <p className="text-sm text-white/55">$129 · Joggers</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: d + 1.1 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10"
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <dl className="flex gap-6 sm:gap-12">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="display text-lg sm:text-2xl">
                  <CountUp value={s.value} delay={d + 1.2} />
                </dd>
                <dd className="text-[0.65rem] text-white/45 sm:text-xs">{s.label}</dd>
              </div>
            ))}
          </dl>
          <button onClick={explore3D} className="hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/50 transition hover:text-white sm:flex" data-cursor="hover">
            Scroll
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15">
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ArrowDown className="h-4 w-4" />
              </motion.span>
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  )
}
