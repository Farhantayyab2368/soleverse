import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin electric-blue reading-progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[85] h-[3px] origin-left bg-gradient-to-r from-volt-deep via-volt to-volt-glow"
      style={{ scaleX }}
      aria-hidden
    />
  )
}
