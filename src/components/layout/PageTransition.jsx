import { motion } from 'framer-motion'
import { useLayoutEffect } from 'react'
import { setNavTheme } from '../../hooks/useNavTheme'

/**
 * Wraps each page: fade/slide transition, document title and navbar theme.
 * `darkHero` = the page starts with a dark section (navbar shows light text while transparent).
 */
export default function PageTransition({ title, darkHero = false, children, className }) {
  useLayoutEffect(() => {
    document.title = title ? `${title} — SOLEVERSE` : 'SOLEVERSE — Step Into The Future'
    setNavTheme(darkHero ? 'dark' : 'light')
  }, [title, darkHero])

  return (
    <motion.main
      id="main"
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
    >
      {children}
    </motion.main>
  )
}
