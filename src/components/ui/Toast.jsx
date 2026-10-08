import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useShop } from '../../context/ShopContext'

export default function Toast() {
  const { toast, dismissToast } = useShop()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[95] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-full bg-ink py-2.5 pl-3 pr-2.5 text-sm text-white shadow-lift"
            role="status"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-volt">
              <Check className="h-4 w-4" />
            </span>
            <span className="line-clamp-1 font-medium">{toast.message}</span>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick()
                  dismissToast()
                }}
                className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20"
              >
                {toast.action.label}
              </button>
            )}
            <button onClick={dismissToast} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/60 hover:text-white" aria-label="Dismiss notification">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
