import { AnimatePresence } from 'framer-motion'
import { Lock, ShoppingBag } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import CartItem from '../components/cart/CartItem'
import OrderSummary from '../components/cart/OrderSummary'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import ProductGrid from '../components/product/ProductGrid'
import { useShop } from '../context/ShopContext'
import { featuredProducts } from '../data/products'

export default function Cart() {
  const { cartItems, cartCount } = useShop()
  return (
    <PageTransition title="Bag">
      <PageHeader eyebrow="Checkout" title="Your Bag" crumbs={[{ label: 'Bag' }]} description={cartCount ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'} ready to go.` : undefined} />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12">
        {cartItems.length === 0 ? (
          <>
            <EmptyState icon={ShoppingBag} title="Your bag is waiting for its next step." description="Nothing here yet — let’s change that." actionLabel="Start shopping" />
            <h2 className="display mt-6 text-3xl">Popular right now</h2>
            <ProductGrid products={featuredProducts} className="mt-8" />
          </>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
            <ul className="divide-y divide-ink/5 rounded-[28px] bg-white px-5 sm:px-8" aria-label="Items in bag">
              <AnimatePresence initial={false}>
                {cartItems.map((item) => (
                  <CartItem key={item.key} item={item} />
                ))}
              </AnimatePresence>
            </ul>
            <aside className="h-fit rounded-[28px] bg-white p-6 sm:p-8 lg:sticky lg:top-28" aria-label="Order summary">
              <h2 className="display mb-6 text-xl">Summary</h2>
              <OrderSummary>
                <Button to="/checkout" size="lg" arrow className="mt-4 w-full">
                  Checkout
                </Button>
                <p className="flex items-center justify-center gap-1.5 pt-2 text-xs text-mist">
                  <Lock className="h-3.5 w-3.5" /> Secure checkout · Free 30-day returns
                </p>
              </OrderSummary>
            </aside>
          </div>
        )}
      </section>
    </PageTransition>
  )
}
