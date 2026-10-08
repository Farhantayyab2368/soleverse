import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const ease = [0.76, 0, 0.24, 1]

/**
 * Page-transition wipe: on every route change a dark panel sweeps up over the old page,
 * shows the wordmark, then lifts away to reveal the new one. Skipped on first load.
 */
export default function RouteCurtain() {
  const { pathname } = useLocation()
  const prev = useRef(pathname)
  const count = useRef(0)
  if (prev.current !== pathname) {
    prev.current = pathname
    count.current += 1
  }
  if (count.current === 0) return null

  return (
    <div key={count.current} className="pointer-events-none fixed inset-0 z-[150]" aria-hidden>
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'] }}
        transition={{ duration: 1.05, times: [0, 0.32, 0.55, 1], ease }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-1.5 bg-volt"
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: ['100vh', '0vh', '0vh', '-1vh'], opacity: [1, 1, 1, 0] }}
        transition={{ duration: 1.05, times: [0, 0.32, 0.55, 1], ease }}
      />
      <motion.p
        className="display-wide absolute inset-0 grid place-items-center text-2xl text-white sm:text-4xl"
        style={{ letterSpacing: '0.3em' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, -16] }}
        transition={{ duration: 1.05, times: [0, 0.34, 0.52, 0.72], ease }}
      >
        Stridevolt
      </motion.p>
    </div>
  )
}
