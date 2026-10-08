import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ShoppingBag } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import CheckoutForm from '../components/checkout/CheckoutForm'
import OrderSummary from '../components/cart/OrderSummary'
import ProductImage from '../components/product/ProductImage'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { useShop } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice, orderNumber } from '../utils/format'

function Confirmation({ order }) {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-32 text-center sm:pt-40">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-volt text-white shadow-glow"
      >
        <Check className="h-11 w-11" strokeWidth={3} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <h1 className="display-wide mt-10 text-5xl sm:text-6xl">Order Confirmed</h1>
        <p className="mt-4 text-lg text-steel">
          Thanks, {order.name.split(' ')[0]}! Your pairs are being prepared. A confirmation has been sent to <strong className="text-ink">{order.email}</strong>.
        </p>
        <div className="mt-10 rounded-[28px] bg-white p-6 text-left sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-fog pb-5">
            <div>
              <p className="eyebrow text-mist">Order number</p>
              <p className="display mt-1 text-2xl">{order.number}</p>
            </div>
            <div className="text-right">
              <p className="eyebrow text-mist">Delivery</p>
              <p className="mt-1 font-semibold">{order.delivery === 'express' ? 'Express · 1–2 days' : 'Standard · 3–5 days'}</p>
            </div>
          </div>
          <ul className="divide-y divide-fog">
            {order.items.map((i) => (
              <li key={i.key} className="flex items-center gap-4 py-4">
                <span className="relative h-16 w-16 shrink-0 rounded-xl bg-paper">
                  <ProductImage product={i.imgProduct} colorIndex={i.colorIndex} view="side"
                        size="sm" className="absolute inset-1" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">
                    {i.name} × {i.qty}
                  </span>
                  <span className="text-sm text-steel">
                    {i.color} · EU {i.size}
                  </span>
                </span>
                <span className="font-semibold">{formatPrice(i.total)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-fog pt-5">
            <span className="font-semibold">Total paid</span>
            <span className="display text-xl">{formatPrice(order.total)}</span>
          </div>
          <p className="mt-2 text-sm text-steel">Paid with {order.payment === 'card' ? `card ending ${order.cardLast4}` : 'Cash on Delivery'}</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button to="/shop" size="lg" arrow>
            Continue shopping
          </Button>
          <Button to="/account" variant="outline" size="lg">
            View orders
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Checkout() {
  const { cartItems, getTotals, clearCart, removePromo } = useShop()
  const { user, addOrder } = useAuth()
  const [delivery, setDelivery] = useState('standard')
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState(null)
  const totals = getTotals(delivery)

  const placeOrder = async (data) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1400)) // mock payment gateway
    const placed = {
      number: orderNumber(),
      date: new Date().toISOString(),
      email: data.email,
      name: data.fullName,
      delivery,
      payment: data.payment,
      cardLast4: data.cardLast4,
      total: totals.total,
      items: cartItems.map((i) => ({
        key: i.key,
        productId: i.product.id,
        name: i.product.name,
        color: i.custom ? 'Custom' : i.colorway.name,
        colorIndex: i.custom ? 0 : i.colorIndex,
        imgProduct: i.custom ? { ...i.product, colors: [{ ...i.colorway, colors: i.custom }] } : i.product,
        size: i.size,
        qty: i.qty,
        total: i.lineTotal,
      })),
    }
    addOrder({ ...placed, items: placed.items.map(({ imgProduct, ...rest }) => rest) }) // eslint-disable-line no-unused-vars
    clearCart()
    removePromo()
    setOrder(placed)
    setSubmitting(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (order) {
    return (
      <PageTransition title="Order confirmed">
        <Confirmation order={order} />
      </PageTransition>
    )
  }

  return (
    <PageTransition title="Checkout">
      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h1 className="display-wide text-5xl sm:text-6xl">Checkout</h1>
          <Link to="/cart" className="text-sm font-semibold underline-offset-4 hover:underline">
            ← Back to bag
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Your bag is waiting for its next step." description="Add a pair to your bag to check out." actionLabel="Shop now" />
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
            <CheckoutForm
              initialEmail={user?.email}
              initialName={user?.name}
              delivery={delivery}
              setDelivery={setDelivery}
              onSubmit={placeOrder}
              submitting={submitting}
              totalLabel={formatPrice(totals.total)}
            />
            <aside className="h-fit rounded-[28px] bg-white p-6 sm:p-8 lg:sticky lg:top-28" aria-label="Order summary">
              <h2 className="display text-xl">In your bag</h2>
              <ul data-lenis-prevent className="my-5 max-h-80 space-y-4 overflow-y-auto pr-1">
                {cartItems.map((i) => (
                  <li key={i.key} className="flex items-center gap-4">
                    <span className="relative h-16 w-16 shrink-0 rounded-xl bg-paper">
                      <ProductImage
                        product={i.custom ? { ...i.product, colors: [{ ...i.colorway, colors: i.custom }] } : i.product}
                        colorIndex={i.custom ? 0 : i.colorIndex}
                        view="side"
                        size="sm"
                        className="absolute inset-1"
                      />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.65rem] font-bold text-white">{i.qty}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{i.product.name}</span>
                      <span className="text-xs text-steel">
                        {i.custom ? 'Custom' : i.colorway.name} · EU {i.size}
                      </span>
                    </span>
                    <span className="text-sm font-semibold">{formatPrice(i.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <OrderSummary shippingMethod={delivery} />
            </aside>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
