import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn } from 'lucide-react'
import ProductImage from './ProductImage'
import { ThreeDShoeViewer } from '../three/Lazy3D'
import { cn } from '../../utils/format'

const VIEW_LABELS = { pair: 'Pair', side: 'Side', front: 'Front', back: 'Back', top: 'Top', lifestyle: 'Lifestyle', angle: 'Angle' }

function LifestyleBackdrop({ name }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,#1f3c99_0%,#0d1430_45%,#0a0a0c_100%)]" aria-hidden>
      <div className="grid-floor absolute inset-0 opacity-70" />
      <p className="display-wide text-outline absolute -left-2 top-6 whitespace-nowrap text-[18vw] lg:text-[9vw]">{name}</p>
      <div className="absolute bottom-[14%] left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-volt/40 blur-3xl" />
    </div>
  )
}

export default function ProductGallery({ product, colorIndex, mode, onModeChange }) {
  const views = product.images
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })
  const frameRef = useRef(null)
  const view = views[active]
  const colorway = product.colors[colorIndex]

  const step = (d) => setActive((i) => (i + d + views.length) % views.length)

  const onMove = (e) => {
    const r = frameRef.current.getBoundingClientRect()
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse">
      <div className="relative flex-1">
        <div
          ref={frameRef}
          className={cn(
            'relative aspect-square overflow-hidden rounded-[32px] sm:aspect-[5/4] lg:aspect-square',
            mode === '3d' ? 'bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_0%,#ecece7_70%)]' : 'bg-gradient-to-b from-white to-[#ecece7]',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mode === '3d' ? (
              <motion.div key="3d" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <ThreeDShoeViewer style={product.style} colors={colorway.colors} />
              </motion.div>
            ) : (
              <motion.div
                key={`${view}-${colorIndex}`}
                className={cn('absolute inset-0', zoom.on ? 'cursor-zoom-out' : 'cursor-zoom-in')}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onMouseMove={onMove}
                onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
                onClick={(e) => (zoom.on ? setZoom((z) => ({ ...z, on: false })) : onMove(e))}
                data-cursor="view"
              >
                {view === 'lifestyle' && <LifestyleBackdrop name={product.name} />}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-out"
                  style={{ transform: zoom.on ? 'scale(1.9)' : 'scale(1)', transformOrigin: `${zoom.x}% ${zoom.y}%` }}
                >
                  <ProductImage
                    product={product}
                    colorIndex={colorIndex}
                    view={view === 'lifestyle' ? 'lifestyle' : view}
                    eager
                    className={cn('absolute', view === 'lifestyle' ? 'inset-[6%] top-[14%]' : 'inset-[4%]')}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {mode !== '3d' && (
            <>
              <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium text-ink/70 sm:flex">
                <ZoomIn className="h-3.5 w-3.5" /> Hover to zoom
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button onClick={() => step(-1)} className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft transition hover:bg-white" aria-label="Previous image" data-cursor="hover">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => step(1)} className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft transition hover:bg-white" aria-label="Next image" data-cursor="hover">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => onModeChange(mode === '3d' ? 'images' : '3d')}
            data-cursor="hover"
            className={cn(
              'absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-soft transition-colors',
              mode === '3d' ? 'bg-white text-ink hover:bg-paper' : 'bg-ink text-white hover:bg-charcoal',
            )}
          >
            {mode === '3d' ? <ImageIcon className="h-4 w-4" /> : <Box className="h-4 w-4" />}
            {mode === '3d' ? 'View photos' : 'View in 3D'}
          </button>
        </div>
      </div>

      <div className="no-scrollbar -m-1 flex gap-3 overflow-x-auto p-1 lg:m-0 lg:w-24 lg:flex-col lg:overflow-visible lg:p-0" role="tablist" aria-label="Product images">
        {views.map((v, i) => (
          <button
            key={v}
            role="tab"
            aria-selected={mode !== '3d' && i === active}
            aria-label={`${VIEW_LABELS[v] ?? 'Image'} view`}
            onClick={() => {
              setActive(i)
              onModeChange('images')
            }}
            data-cursor="hover"
            className={cn(
              'relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 lg:w-full',
              v === 'lifestyle' ? 'bg-ink' : 'bg-white',
              mode !== '3d' && i === active ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'opacity-70 hover:opacity-100',
            )}
          >
            <ProductImage product={product} colorIndex={colorIndex} view={v} size="sm" className="absolute inset-1.5" />
            <span className={cn('absolute bottom-1 left-0 right-0 text-center text-[0.6rem] font-semibold uppercase tracking-wider', v === 'lifestyle' ? 'text-white/70' : 'text-mist')}>
              {VIEW_LABELS[v]}
            </span>
          </button>
        ))}
        <button
          onClick={() => onModeChange('3d')}
          aria-pressed={mode === '3d'}
          data-cursor="hover"
          className={cn(
            'grid aspect-square w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-volt to-volt-deep text-white transition-all lg:w-full',
            mode === '3d' ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'opacity-90 hover:opacity-100',
          )}
        >
          <span className="flex flex-col items-center gap-1">
            <Box className="h-5 w-5" />
            <span className="text-[0.6rem] font-bold uppercase tracking-wider">3D</span>
          </span>
        </button>
      </div>
    </div>
  )
}
