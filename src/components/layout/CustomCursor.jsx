import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Move3d } from 'lucide-react'
import useMediaQuery from '../../hooks/useMediaQuery'

/**
 * Subtle desktop-only cursor follower.
 * Reacts to [data-cursor] targets: "hover" (buttons/links) · "view" (product cards) · "drag" (3D viewers).
 */
export default function CustomCursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })
  const [mode, setMode] = useState('default')
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!finePointer || reduced) return
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target instanceof Element ? e.target : null
      const tagged = target?.closest('[data-cursor]')
      const interactive = target?.closest('button, a, input, select, textarea, label')
      // the nearest tagged ancestor wins; untagged buttons/links read as "hover"
      let next = tagged?.getAttribute('data-cursor') ?? (interactive ? 'hover' : 'default')
      // buttons nested inside a "view"/"drag" area (e.g. viewer controls) read as "hover"
      if (interactive?.tagName === 'BUTTON' && tagged && tagged !== interactive && tagged.contains(interactive)) next = 'hover'
      setMode(next)
    }
    const onLeave = () => setVisible(false)
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [finePointer, reduced, x, y])

  if (!finePointer || reduced) return null

  const size = { default: 30, hover: 54, view: 84, drag: 84 }[mode]
  const filled = mode === 'view' || mode === 'drag'

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block"
      style={{ x: sx, y: sy }}
      aria-hidden
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.85 : 1,
          backgroundColor: filled ? 'rgba(10,10,12,0.88)' : mode === 'hover' ? 'rgba(47,107,255,0.12)' : 'rgba(10,10,12,0)',
          borderColor: filled ? 'rgba(255,255,255,0.15)' : mode === 'hover' ? 'rgba(47,107,255,0.6)' : 'rgba(120,120,130,0.5)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        style={{ borderWidth: 1, borderStyle: 'solid', backdropFilter: filled ? 'blur(6px)' : 'none' }}
      >
        {mode === 'view' && <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white">View</span>}
        {mode === 'drag' && (
          <span className="flex flex-col items-center gap-0.5 text-white">
            <Move3d className="h-4 w-4" />
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em]">Drag</span>
          </span>
        )}
      </motion.div>
    </motion.div>
  )
}
