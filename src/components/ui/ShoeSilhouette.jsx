import { motion } from 'framer-motion'

export const UPPER_PATH =
  'M20 74 C15 60 15 45 21 33 C31 35 44 37 55 41 C57 33 62 27 70 27 C74 34 78 40 87 44 C108 52 136 55 160 59 C177 62 189 67 191 74 Z'
export const SOLE_PATH = 'M12 74 L194 74 C197 81 192 90 183 90 L23 90 C14 90 9 83 12 74 Z'
export const STRIPE_PATH = 'M40 66 C72 64 112 56 152 64'

/**
 * Vector sneaker used for the loader, empty states and as the image fallback
 * when WebGL is not available.
 */
export default function ShoeSilhouette({ className, outline = false, colors, animate = false }) {
  const c = colors ?? { main: 'currentColor', sole: 'currentColor', accent: '#2f6bff' }
  if (outline || animate) {
    const draw = animate
      ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.3, ease: [0.65, 0, 0.35, 1] } }
      : {}
    return (
      <svg viewBox="0 0 204 100" fill="none" className={className} aria-hidden>
        <motion.path d={UPPER_PATH} stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" {...draw} />
        <motion.path d={SOLE_PATH} stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" {...draw} transition={{ ...draw.transition, delay: 0.25 }} />
        <motion.path d={STRIPE_PATH} stroke="#2f6bff" strokeWidth="3" strokeLinecap="round" {...draw} transition={{ ...draw.transition, delay: 0.5 }} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 204 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="sv-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <ellipse cx="102" cy="93" rx="88" ry="5" fill="#000" opacity="0.12" />
      <path d={UPPER_PATH} fill={c.main} />
      <path d={UPPER_PATH} fill="url(#sv-shade)" />
      <path d={SOLE_PATH} fill={c.sole} stroke="#00000014" />
      <path d={STRIPE_PATH} stroke={c.accent} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M22 34 C32 36 44 38 55 42" stroke="#0005" strokeWidth="3" fill="none" />
    </svg>
  )
}
