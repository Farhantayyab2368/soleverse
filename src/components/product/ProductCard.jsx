import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { Check, Heart, Plus } from 'lucide-react'
import ProductImage from './ProductImage'
import Stars from '../ui/Stars'
import { useShop, DEFAULT_SIZE } from '../../context/ShopContext'
import { cn, formatPrice } from '../../utils/format'
import { flyToCart } from '../../utils/flyToCart'

function ProductCard({ product, priority = false, showNewBadge = true }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const [colorIndex, setColorIndex] = useState(0)
  const [added, setAdded] = useState(false)
  const wished = isWishlisted(product.id)
  const size = product.soldOut.includes(DEFAULT_SIZE) ? product.sizes.find((s) => !product.soldOut.includes(s)) : DEFAULT_SIZE

  // 3D tilt + moving glare that follow the cursor (pointer devices only)
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 })
  const glare = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgb(255 255 255 / 0.55), transparent 55%)`
  const onTilt = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    rotateY.set((px - 0.5) * 12)
    rotateX.set((0.5 - py) * 10)
    mx.set(px * 100)
    my.set(py * 100)
  }
  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const quickAdd = (e) => {
    e.preventDefault()
    flyToCart(e.currentTarget.closest('article')?.querySelector('img'))
    addToCart(product, { colorIndex, size })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.article
      className="group relative flex flex-col"
      whileHover="hover"
      initial="rest"
      animate="rest"
      data-cursor="view"
    >
      <motion.div
        variants={{ rest: { y: 0 }, hover: { y: -8 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        onPointerMove={onTilt}
        onPointerLeave={resetTilt}
        className="relative overflow-hidden rounded-[26px] bg-gradient-to-b from-white to-[#ecece7] shadow-[0_1px_0_rgb(0_0_0/0.03)] transition-shadow duration-500 group-hover:shadow-lift"
      >
        <Link to={`/product/${product.id}`} className="block" aria-label={`${product.name}, ${formatPrice(product.price)}`}>
          <div className="relative aspect-square">
            <div className="absolute inset-x-[10%] bottom-[12%] h-1/3 rounded-full bg-volt/0 blur-3xl transition-colors duration-700 group-hover:bg-volt/15" aria-hidden />
            <ProductImage
              product={product}
              colorIndex={colorIndex}
              view="pair"
              size="md"
              eager={priority}
              className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.08] group-hover:-rotate-[4deg]"
            />
          </div>
          <motion.div className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100" style={{ background: glare }} aria-hidden />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex gap-2 sm:left-4 sm:top-4">
          {showNewBadge && product.isNew && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white">New</span>
          )}
          {product.soldOut.length > 0 && product.isFeatured && (
            <span className="hidden rounded-full bg-white/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ink backdrop-blur sm:inline">
              Selling fast
            </span>
          )}
        </div>

        <motion.button
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product)
          }}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          whileTap={{ scale: 0.8 }}
          data-cursor="hover"
          className={cn(
            'absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center sm:right-4 sm:top-4 sm:h-10 sm:w-10 rounded-full bg-white/90 shadow-soft backdrop-blur transition-all duration-300',
            wished ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
          )}
        >
          <motion.span key={wished ? 'on' : 'off'} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart className={cn('h-[18px] w-[18px]', wished ? 'fill-red-500 text-red-500' : 'text-ink')} />
          </motion.span>
        </motion.button>

        <div className="absolute bottom-2.5 right-2.5 sm:inset-x-3 sm:bottom-3 md:translate-y-[130%] md:opacity-0 md:transition-all md:duration-500 md:ease-[var(--ease-premium)] md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button
            onClick={quickAdd}
            data-cursor="hover"
            className={cn(
              'relative flex h-10 w-10 items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-semibold shadow-soft transition-colors duration-300 sm:h-11 sm:w-full',
              added ? 'bg-volt text-white' : 'bg-ink text-white hover:bg-charcoal',
            )}
            aria-label={`Quick add ${product.name} size EU ${size} to bag`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="ok" className="flex items-center gap-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                  <Check className="h-4 w-4" /> <span className="hidden sm:inline">Added</span>
                </motion.span>
              ) : (
                <motion.span key="add" className="flex items-center gap-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Quick Add <span className="text-white/50">· EU {size}</span>
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      <div className="mt-4 flex flex-col gap-1.5 px-1">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-[0.65rem] text-mist">{product.category}</p>
            <h3 className="mt-1 truncate text-[0.95rem] font-semibold tracking-tight sm:text-[1.05rem]">
              <Link to={`/product/${product.id}`} className="hover:text-volt">
                {product.name}
              </Link>
            </h3>
          </div>
          <p className="shrink-0 pt-[1.1rem] text-[0.95rem] font-semibold sm:text-[1.05rem]">{formatPrice(product.price)}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
          <Stars rating={product.rating} size={12} showValue reviews={product.reviews} />
          <div className="flex items-center gap-1" role="radiogroup" aria-label={`${product.name} colourways`}>
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                role="radio"
                aria-checked={i === colorIndex}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColorIndex(i)}
                onMouseEnter={() => setColorIndex(i)}
                className={cn(
                  'h-3.5 w-3.5 rounded-full border border-black/10 ring-offset-2 ring-offset-paper transition sm:h-4 sm:w-4',
                  i === colorIndex ? 'ring-2 ring-ink' : 'hover:scale-110',
                )}
                style={{ background: `linear-gradient(135deg, ${c.colors.main} 50%, ${c.colors.accent} 50%)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default memo(ProductCard)
