import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/format'
import useScrollLock from '../../hooks/useScrollLock'
import useFocusTrap from '../../hooks/useFocusTrap'

/**
 * Accessible animated modal.
 * variant: 'center' (dialog) | 'right' (drawer) | 'full' (fullscreen overlay)
 */
export default function Modal({ open, onClose, title, hideTitle = false, variant = 'center', className, children, labelledBy }) {
  const panelRef = useRef(null)
  const titleId = useId()
  useScrollLock(open)
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const panelMotion = {
    center: {
      initial: { opacity: 0, y: 24, scale: 0.97 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 16, scale: 0.98 },
    },
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    full: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } },
  }[variant]

  const layout = {
    center: 'items-end sm:items-center justify-center p-0 sm:p-6',
    right: 'justify-end',
    full: 'items-start justify-center',
  }[variant]

  const panelClass = {
    center: 'relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white shadow-lift',
    right: 'relative h-full w-full max-w-[460px] bg-white shadow-lift flex flex-col',
    full: 'relative h-full w-full overflow-y-auto bg-paper/95 backdrop-blur-xl',
  }[variant]

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-[90] flex', layout)}>
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy ?? (title ? titleId : undefined)}
            className={cn(panelClass, className)}
            {...panelMotion}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
          >
            {title && (
              <div className={cn('flex items-center justify-between gap-4 px-6 pt-6', hideTitle && 'sr-only')}>
                <h2 id={titleId} className="display text-xl">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="grid h-10 w-10 place-items-center rounded-full bg-paper transition hover:bg-fog"
                  aria-label="Close"
                  data-cursor="hover"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
