import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ShoeSilhouette from '../ui/ShoeSilhouette'

const MIN_DURATION = 1300

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
      const eased = 1 - Math.pow(1 - t, 3)
      const p = loaded ? eased : Math.min(eased, 0.9)
      setProgress(p)
      if (p >= 1) onDone()
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    // never block for long, even on slow font loads
    const failsafe = setTimeout(onDone, 3500)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(failsafe)
      window.removeEventListener('load', onLoad)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-ink text-white"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-label="Loading SOLEVERSE"
    >
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/25 blur-[100px]" aria-hidden />
      <ShoeSilhouette animate className="relative w-40 text-white sm:w-52" />
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        animate={{ opacity: 1, letterSpacing: '0.32em' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative mt-8 font-display text-xl font-extrabold uppercase sm:text-2xl"
        style={{ fontStretch: '125%' }}
      >
        Soleverse
      </motion.p>
      <div className="relative mt-8 h-px w-44 overflow-hidden bg-white/10">
        <div className="absolute inset-y-0 left-0 bg-volt" style={{ width: `${progress * 100}%` }} />
      </div>
      <p className="relative mt-3 font-mono text-[0.65rem] tabular-nums text-white/40">{String(Math.round(progress * 100)).padStart(3, '0')}</p>
    </motion.div>
  )
}
