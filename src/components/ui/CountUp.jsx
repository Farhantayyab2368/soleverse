import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'

/** Animates the number inside a string like "238g", "84%", "4.8" or "40,000+" when it scrolls into view. */
export default function CountUp({ value, duration = 1.6, className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const match = String(value).match(/^([^\d−-]*)([−-]?[\d,]*\.?\d+)(.*)$/)

  useEffect(() => {
    if (!inView || !match || !ref.current) return
    const [, prefix, num, suffix] = match
    const target = parseFloat(num.replace(/,/g, '').replace('−', '-'))
    const decimals = (num.split('.')[1] ?? '').length
    const grouped = num.includes(',')
    const fmt = (v) => {
      const fixed = v.toFixed(decimals)
      const n = grouped ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: decimals }) : fixed
      return `${prefix}${num.startsWith('−') ? n.replace('-', '−') : n}${suffix}`
    }
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = fmt(v)
      },
    })
    return () => controls.stop()
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {match ? `${match[1]}0${match[3]}` : value}
    </span>
  )
}
