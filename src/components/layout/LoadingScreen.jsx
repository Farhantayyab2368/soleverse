import { useEffect, useId, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * "Step into the future" splash screen.
 *  - glowing sole prints walk across the screen as loading progresses
 *  - a shoe-size ruler (EU 39 → 45) acts as the progress bar
 *  - the wordmark letters step up one by one, with a live counter + status lines
 *  - exit: a volt seam flashes and the screen opens like a shoebox lid
 */

const MIN_DURATION = 1700
const ease = [0.76, 0, 0.24, 1]
const STEPS = 8
const STATUS = ['Lacing up', 'Inflating AeroFoam™', 'Calibrating fit', 'Tying the knot', 'Ready to step']
const SIZES = [39, 40, 41, 42, 43, 44, 45]
const WORD = 'SOLEVERSE'

// Footprint trail: walks diagonally from bottom-left to top-right, alternating feet.
const PRINTS = Array.from({ length: STEPS }, (_, i) => {
  const t = i / (STEPS - 1)
  const left = i % 2 === 0
  return { x: 8 + t * 80 + (left ? -2.5 : 2.5), y: 82 - t * 66 + (left ? 3 : -3), left }
})

const SOLE =
  'M20 2 C33 2 38 14 38 30 C38 44 33 52 31 60 C29 68 32 76 32 84 C32 94 26 98 20 98 C14 98 8 94 8 84 C8 76 11 68 9 60 C7 52 2 44 2 30 C2 14 7 2 20 2 Z'

function SolePrint({ left }) {
  const clip = useId()
  return (
    <svg viewBox="0 0 40 100" className="h-full w-full" style={{ transform: left ? 'scaleX(-1)' : undefined }} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <path d={SOLE} />
        </clipPath>
      </defs>
      <path d={SOLE} fill="rgb(47 107 255 / 0.12)" stroke="#5b8cff" strokeWidth="1.6" />
      <g clipPath={`url(#${clip})`} stroke="#5b8cff" strokeWidth="1.3" opacity="0.7">
        {[10, 16, 22, 28, 34, 40, 46].map((y) => (
          <path key={y} d={`M0 ${y} L40 ${y - 4}`} />
        ))}
        {[72, 78, 84, 90].map((y) => (
          <path key={y} d={`M0 ${y} L40 ${y - 3}`} />
        ))}
      </g>
    </svg>
  )
}

const panel = (dir) => ({
  initial: { y: '0%' },
  animate: { y: '0%' },
  exit: { y: dir === 'up' ? '-102%' : '102%', rotateX: dir === 'up' ? 8 : 0, transition: { duration: 0.75, delay: 0.32, ease } },
})

const fadeOut = { exit: { opacity: 0, scale: 0.98, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } } }

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let frame
    let loaded = document.readyState === 'complete'
    const onLoad = () => (loaded = true)
    window.addEventListener('load', onLoad)
    const tick = (now) => {
      const t = Math.min(1, (now - start) / MIN_DURATION)
      const eased = 1 - Math.pow(1 - t, 2.4)
      const p = loaded ? eased : Math.min(eased, 0.92)
      setProgress(p)
      if (p >= 1) onDone()
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const failsafe = setTimeout(onDone, 3800) // never block for long
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(failsafe)
      window.removeEventListener('load', onLoad)
    }
  }, [onDone])

  const pct = Math.round(progress * 100)
  const stepsShown = Math.ceil(progress * STEPS)
  const status = STATUS[Math.min(STATUS.length - 1, Math.floor(progress * STATUS.length))]
  const size = SIZES[Math.min(SIZES.length - 1, Math.floor(progress * SIZES.length))]

  return (
    <motion.div
      className="fixed inset-0 z-[300] overflow-hidden text-white [perspective:1200px]"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{ exit: { opacity: 1, transition: { duration: 1.1 } } }}
      role="status"
      aria-label={`Loading SOLEVERSE, ${pct}%`}
    >
      {/* shoebox halves */}
      <motion.div className="absolute inset-x-0 top-0 h-1/2 origin-top bg-ink" variants={panel('up')} />
      <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" variants={panel('down')} />

      {/* seam flash on exit */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 bg-volt shadow-[0_0_24px_4px_rgb(47_107_255/0.8)]"
        variants={{
          initial: { scaleX: 0, opacity: 0 },
          animate: { scaleX: 0, opacity: 0 },
          exit: { scaleX: [0, 1, 1], opacity: [1, 1, 0], transition: { duration: 0.9, times: [0, 0.35, 1], ease } },
        }}
      />

      <motion.div className="absolute inset-0" variants={fadeOut}>
        {/* ambience */}
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/20 blur-[120px]" aria-hidden />
        <div className="grid-floor absolute inset-0 opacity-50" aria-hidden />

        {/* walking footprints */}
        {PRINTS.map((p, i) => {
          const shown = i < stepsShown
          const isLatest = i === stepsShown - 1
          return (
            <motion.div
              key={i}
              className="absolute h-16 w-7 sm:h-20 sm:w-8"
              style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: 42 }}
              initial={{ opacity: 0, scale: 1.6 }}
              animate={shown ? { opacity: isLatest ? 1 : 0.28, scale: 1, filter: isLatest ? 'drop-shadow(0 0 12px rgb(91 140 255 / 0.9))' : 'none' } : { opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            >
              <SolePrint left={p.left} />
            </motion.div>
          )
        })}

        {/* centre: stepping wordmark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <p className="eyebrow mb-5 text-volt-glow" aria-hidden>
            Step into the future
          </p>
          <div className="display-wide flex overflow-hidden text-[10.5vw] leading-none sm:text-7xl" aria-hidden>
            {WORD.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: progress > i / (WORD.length + 2) ? '0%' : '110%' }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          {/* size ruler progress */}
          <div className="mt-12 w-full max-w-md" aria-hidden>
            <div className="relative h-8">
              <div className="absolute inset-x-0 bottom-0 flex justify-between">
                {Array.from({ length: 25 }, (_, i) => (
                  <span key={i} className={i % 4 === 0 ? 'h-4 w-px bg-white/40' : 'h-2 w-px bg-white/15'} />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] bg-volt shadow-[0_0_12px_rgb(47_107_255/0.8)]" style={{ width: `${progress * 100}%` }} />
              <div className="absolute -top-1 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-volt" style={{ left: `${progress * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[0.6rem] text-white/35">
              {SIZES.map((s) => (
                <span key={s} className={s === size ? 'text-white' : undefined}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* corners */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10" aria-hidden>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/40">Fitting · EU {size}</p>
          <motion.p key={status} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm font-medium text-white/80">
            {status}…
          </motion.p>
        </div>
        <p className="display absolute bottom-4 right-6 text-6xl tabular-nums text-white/90 sm:bottom-8 sm:right-10 sm:text-8xl" aria-hidden>
          {String(pct).padStart(3, '0')}
          <span className="text-2xl text-volt sm:text-3xl">%</span>
        </p>
        <p className="absolute left-6 top-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-white/35 sm:left-10 sm:top-10" aria-hidden>
          SV / 2026 Collection
        </p>
      </motion.div>
    </motion.div>
  )
}
