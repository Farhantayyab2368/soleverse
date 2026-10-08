import { Star } from 'lucide-react'
import { cn } from '../../utils/format'

export default function Stars({ rating, size = 14, className, showValue = false, reviews, light = false }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)))
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden>
              <Star className={light ? 'text-white/25' : 'text-ink/15'} style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={light ? 'text-white' : 'text-ink'} style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className={cn('text-xs font-semibold', light ? 'text-white/80' : 'text-ink/70')}>
          {rating.toFixed(1)}
          {reviews != null && <span className={cn('hidden sm:inline', light ? 'text-white/50' : 'text-mist')}> ({reviews.toLocaleString()})</span>}
        </span>
      )}
    </div>
  )
}
