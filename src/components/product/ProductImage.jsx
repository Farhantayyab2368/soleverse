import { motion } from 'framer-motion'
import useShoeImage from '../../hooks/useShoeImage'
import useInView from '../../hooks/useInView'
import ShoeSilhouette from '../ui/ShoeSilhouette'
import { cn } from '../../utils/format'

const isPhoto = (v) => typeof v === 'string' && (v.startsWith('/') || v.startsWith('http') || v.startsWith('data:'))

/**
 * Product photo. Uses a real image URL when provided, otherwise a studio render
 * of the 3D sneaker in the requested colourway/view (lazy: only when on screen).
 */
export default function ProductImage({ product, colorIndex = 0, view = 'side', size = 'lg', className, imgClassName, alt, eager = false }) {
  const colorway = product.colors[colorIndex] ?? product.colors[0]
  const [ref, inView] = useInView({ rootMargin: '300px', once: true })
  const photo = isPhoto(view) ? view : null
  const { src, status } = useShoeImage({
    style: product.style,
    colors: colorway.colors,
    view: photo ? 'side' : view,
    size,
    enabled: !photo && (eager || inView),
  })
  const finalSrc = photo ?? src
  const label = alt ?? `${product.name} in ${colorway.name} — ${photo ? 'photo' : `${view} view`}`

  return (
    <div ref={ref} className={cn(!/\b(absolute|fixed)\b/.test(className ?? '') && 'relative', className)}>
      {!finalSrc && status !== 'error' && (
        <div className="absolute inset-[12%] grid place-items-center opacity-60" aria-hidden>
          <ShoeSilhouette className="w-full text-ink/[0.06]" />
        </div>
      )}
      {status === 'error' && !photo ? (
        <div className="absolute inset-0 grid place-items-center p-[8%]" role="img" aria-label={label}>
          <ShoeSilhouette className="w-full drop-shadow-xl" colors={colorway.colors} />
        </div>
      ) : (
        finalSrc && (
          <motion.img
            key={finalSrc}
            src={finalSrc}
            alt={label}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: status === 'stale' ? 0.6 : 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn('absolute inset-0 h-full w-full object-contain', imgClassName)}
          />
        )
      )}
    </div>
  )
}
