import { useEffect } from 'react'
import { startScroll, stopScroll } from '../utils/smoothScroll'

let locks = 0

/** Locks body scroll while `active`; supports nested modals. */
export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    locks += 1
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    if (locks === 1) {
      stopScroll()
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbar}px`
    }
    return () => {
      locks -= 1
      if (locks === 0) {
        startScroll()
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}
