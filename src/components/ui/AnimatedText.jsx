import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/**
 * Word-by-word masked reveal when scrolled into view.
 * Each word slides up from behind a mask with a slight rotation, staggered.
 */
export default function AnimatedText({ text, as = 'span', className, delay = 0, stagger = 0.06, once = true }) {
  const Tag = motion[as] ?? motion.span
  const words = String(text).split(' ')
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '110%', rotate: 6, opacity: 0 },
              show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 0.85, ease } },
            }}
          >
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
