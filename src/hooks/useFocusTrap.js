import { useEffect } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Keeps keyboard focus inside `ref` while active and restores it afterwards. */
export default function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return
    const previous = document.activeElement
    const frame = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      const auto = el.querySelector('[data-autofocus]')
      ;(auto ?? el.querySelector(FOCUSABLE) ?? el).focus?.({ preventScroll: true })
    })
    const onKey = (e) => {
      if (e.key !== 'Tab' || !ref.current) return
      const nodes = [...ref.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null)
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      previous?.focus?.({ preventScroll: true })
    }
  }, [ref, active])
}
