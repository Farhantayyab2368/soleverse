import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ShoppingBag, Truck, X } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import CartItem from './CartItem'
import OrderSummary from './OrderSummary'
import { useShop } from '../../context/ShopContext'

const FREE_RETURNS_NOTE = 'Free 30-day returns on every order'

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cartItems, cartCount } = useShop()
  const navigate = useNavigate()
  const close = () => setCartOpen(false)

  return (
    <Modal open={isCartOpen} onClose={close} variant="right" labelledBy="cart-title">
      <header className="flex items-center justify-between border-b border-fog px-6 py-5">
        <h2 id="cart-title" className="display flex items-center gap-3 text-xl">
          Your Bag
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-ink px-2 text-xs font-bold text-white" aria-label={`${cartCount} items`}>
            {cartCount}
          </span>
        </h2>
        <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full bg-paper transition hover:bg-fog" aria-label="Close bag" data-cursor="hover">
          <X className="h-5 w-5" />
        </button>
      </header>

      {cartItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is waiting for its next step."
            description="Explore the latest drops and find your next pair."
            actionLabel="Shop now"
            onAction={() => {
              close()
              navigate('/shop')
            }}
            compact
          />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 bg-paper px-6 py-3 text-xs font-medium text-steel">
            <Truck className="h-4 w-4 text-volt" /> {FREE_RETURNS_NOTE} · Ships in 1–2 days
          </div>
          <ul className="flex-1 divide-y divide-fog overflow-y-auto px-6" aria-label="Items in bag">
            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <CartItem key={item.key} item={item} onNavigate={close} compact />
              ))}
            </AnimatePresence>
          </ul>
          <footer className="border-t border-fog bg-white px-6 pb-6 pt-5">
            <OrderSummary showPromo>
              <div className="grid gap-2 pt-3">
                <Button
                  variant="primary"
                  size="lg"
                  arrow
                  className="w-full"
                  onClick={() => {
                    close()
                    navigate('/checkout')
                  }}
                >
                  Checkout
                </Button>
                <button
                  onClick={() => {
                    close()
                    navigate('/cart')
                  }}
                  className="h-11 rounded-full text-sm font-semibold text-ink underline-offset-4 hover:underline"
                >
                  View full bag
                </button>
              </div>
            </OrderSummary>
          </footer>
        </>
      )}
    </Modal>
  )
}
