import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Heart, RotateCcw, ShieldCheck, ShoppingBag, Truck, Zap } from 'lucide-react'
import ColorSelector from './ColorSelector'
import SizeSelector from './SizeSelector'
import SizeGuideModal from './SizeGuideModal'
import QuantityPicker from '../ui/QuantityPicker'
import Button from '../ui/Button'
import Stars from '../ui/Stars'
import { useShop } from '../../context/ShopContext'
import { cn, formatNumber, formatPrice } from '../../utils/format'

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-ink/10">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left font-semibold">
        {title}
        <ChevronDown className={cn('h-5 w-5 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="pb-6 text-sm leading-relaxed text-steel">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Right-hand product information & purchase panel. */
export default function ProductDetails({ product, colorIndex, setColorIndex }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const navigate = useNavigate()
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState('')
  const [guideOpen, setGuideOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const wished = isWishlisted(product.id)

  const validate = () => {
    if (!size) {
      setSizeError('Please select a size.')
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const handleAdd = () => {
    if (!validate()) return
    addToCart(product, { colorIndex, size, qty, openDrawer: true })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleBuy = () => {
    if (!validate()) return
    addToCart(product, { colorIndex, size, qty, silent: true })
    navigate('/checkout')
  }

  const swatches = product.colors.map((c) => ({ name: c.name, hex: c.colors.main, accent: c.colors.accent }))

  return (
    <div className="lg:sticky lg:top-28">
      <div className="flex items-center gap-2">
        <p className="eyebrow text-volt">{product.category}</p>
        {product.isNew && <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-white">New</span>}
      </div>
      <h1 className="display-wide mt-3 text-5xl sm:text-6xl">{product.name}</h1>
      <p className="mt-2 text-steel">{product.tagline}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="display text-3xl">{formatPrice(product.price)}</p>
        <a href="#reviews" className="flex items-center gap-2 text-sm hover:underline">
          <Stars rating={product.rating} size={16} />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-steel">({formatNumber(product.reviews)} reviews)</span>
        </a>
      </div>

      <p className="mt-6 max-w-lg leading-relaxed text-steel">{product.description}</p>

      <div className="mt-8 space-y-8">
        <ColorSelector label="Colour" options={swatches} value={colorIndex} onChange={setColorIndex} />
        <div id="size-selector">
          <SizeSelector
            sizes={product.sizes}
            soldOut={product.soldOut}
            value={size}
            onChange={(s) => {
              setSize(s)
              setSizeError('')
            }}
            onOpenGuide={() => setGuideOpen(true)}
            error={sizeError}
          />
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Quantity</p>
          <QuantityPicker value={qty} onChange={setQty} />
        </div>
      </div>

      <div className="mt-8 grid gap-3">
        <div className="flex gap-3">
          <Button onClick={handleAdd} size="lg" variant={added ? 'accent' : 'primary'} className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={added ? 'y' : 'n'} className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {added ? 'Added to Bag' : 'Add to Bag'}
              </motion.span>
            </AnimatePresence>
          </Button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleWishlist(product)}
            aria-pressed={wished}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            title={wished ? 'Remove from wishlist' : 'Add to Wishlist'}
            className={cn('grid h-14 w-14 shrink-0 place-items-center rounded-full border transition', wished ? 'border-red-200 bg-red-50' : 'border-ink/15 bg-white hover:border-ink')}
            data-cursor="hover"
          >
            <Heart className={cn('h-5 w-5', wished ? 'fill-red-500 text-red-500' : '')} />
          </motion.button>
        </div>
        <Button onClick={handleBuy} variant="outline" size="lg">
          <Zap className="h-4 w-4" /> Buy Now
        </Button>
        <button onClick={() => toggleWishlist(product)} className="text-sm font-medium text-steel underline-offset-4 hover:text-ink hover:underline">
          {wished ? 'Saved to your wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      <ul className="mt-8 grid gap-3 rounded-[24px] bg-white p-5 text-sm sm:grid-cols-3">
        {[
          { icon: Truck, t: 'Free shipping', d: 'On orders over $150' },
          { icon: RotateCcw, t: '30-day returns', d: 'Wear-tested guarantee' },
          { icon: ShieldCheck, t: '2-year warranty', d: 'On every pair' },
        ].map(({ icon: Icon, t, d }) => (
          <li key={t} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-volt" />
            <span>
              <span className="block font-semibold">{t}</span>
              <span className="text-steel">{d}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Accordion title="Details & Technology" defaultOpen>
          <ul className="space-y-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-volt" /> {d}
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion title="Shipping & Returns">
          Standard delivery in 3–5 business days ($10) or Express in 1–2 days ($25). Free returns within 30 days — even if you’ve
          worn them outside.
        </Accordion>
        <Accordion title="Care">Spot clean with a soft brush and mild soap. Air dry away from direct heat. Do not machine wash.</Accordion>
      </div>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} highlight={size} />
    </div>
  )
}
