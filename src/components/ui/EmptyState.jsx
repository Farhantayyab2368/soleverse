import { motion } from 'framer-motion'
import Button from './Button'
import ShoeSilhouette from './ShoeSilhouette'
import { cn } from '../../utils/format'

export default function EmptyState({ icon: Icon, title, description, actionLabel = 'Continue shopping', actionTo = '/shop', onAction, compact = false, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col items-center text-center', compact ? 'py-10' : 'py-20 sm:py-28', className)}
    >
      <div className="relative mb-8 grid h-28 w-28 place-items-center rounded-full bg-white shadow-soft">
        <div className="absolute inset-0 rounded-full bg-volt/10 blur-2xl" aria-hidden />
        {Icon ? <Icon className="relative h-10 w-10 text-ink" strokeWidth={1.5} /> : <ShoeSilhouette className="relative w-16 text-ink" outline />}
      </div>
      <h2 className="display max-w-md text-2xl sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-sm text-steel">{description}</p>}
      {(actionTo || onAction) && (
        <Button className="mt-8" to={onAction ? undefined : actionTo} onClick={onAction} arrow>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
