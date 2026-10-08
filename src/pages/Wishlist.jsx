import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ShoppingBag, X } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import ProductImage from '../components/product/ProductImage'
import EmptyState from '../components/ui/EmptyState'
import Stars from '../components/ui/Stars'
import { useShop, DEFAULT_SIZE } from '../context/ShopContext'
import { formatPrice } from '../utils/format'
import { flyToCart } from '../utils/flyToCart'

export default function Wishlist() {
  const { wishlistProducts, removeFromWishlist, moveToCart } = useShop()

  return (
    <PageTransition title="Wishlist">
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        description={wishlistProducts.length ? `${wishlistProducts.length} saved ${wishlistProducts.length === 1 ? 'pair' : 'pairs'} — saved on this device.` : undefined}
        crumbs={[{ label: 'Wishlist' }]}
      />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12">
        {wishlistProducts.length === 0 ? (
          <EmptyState icon={Heart} title="Save your favorite pairs here." description="Tap the heart on any shoe to keep it for later." actionLabel="Discover shoes" />
        ) : (
          <motion.ul layout className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {wishlistProducts.map((p) => {
                const size = p.soldOut.includes(DEFAULT_SIZE) ? p.sizes.find((s) => !p.soldOut.includes(s)) : DEFAULT_SIZE
                return (
                  <motion.li key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.4 }} className="group">
                    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-b from-white to-[#ecece7]">
                      <Link to={`/product/${p.id}`} className="block aspect-square" data-cursor="view" aria-label={p.name}>
                        <ProductImage product={p} view="pair" size="md" className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(p.id)}
                        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-soft transition hover:bg-white"
                        aria-label={`Remove ${p.name} from wishlist`}
                        data-cursor="hover"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 px-1">
                      <p className="eyebrow text-[0.65rem] text-mist">{p.category}</p>
                      <div className="mt-1 flex items-start justify-between gap-2">
                        <Link to={`/product/${p.id}`} className="font-semibold hover:text-volt">
                          {p.name}
                        </Link>
                        <span className="font-semibold">{formatPrice(p.price)}</span>
                      </div>
                      <Stars rating={p.rating} size={12} className="mt-1.5" />
                      <button
                        onClick={(e) => {
                          flyToCart(e.currentTarget.closest('li')?.querySelector('img'))
                          moveToCart(p, size)
                        }}
                        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-charcoal"
                        data-cursor="hover"
                      >
                        <ShoppingBag className="h-4 w-4" /> Move to bag <span className="text-white/50">· EU {size}</span>
                      </button>
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>
    </PageTransition>
  )
}
