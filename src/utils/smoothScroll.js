import Lenis from 'lenis'

/** Single Lenis instance for inertial smooth scrolling (desktop wheel only; touch stays native). */
let lenis = null

export function initSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
  document.documentElement.classList.add('lenis')
  const raf = (time) => {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  return lenis
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

export function scrollToElement(el, { immediate = false } = {}) {
  if (lenis) lenis.scrollTo(el, { offset: -96, immediate, force: true })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' })
}
