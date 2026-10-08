import { Link } from 'react-router-dom'
import { Heart, LogOut, Package, ShoppingBag, User } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'
import { formatPrice } from '../utils/format'

export default function Account() {
  const { user, logout, orders } = useAuth()
  const { wishlist, cartCount, setCartOpen } = useShop()

  if (!user) {
    return (
      <PageTransition title="Account">
        <div className="mx-auto max-w-[1440px] px-5 pt-24 sm:px-8 lg:px-12">
          <EmptyState
            icon={User}
            title="Sign in to your account"
            description="Track orders, manage your wishlist and check out faster."
            actionLabel="Log in"
            actionTo="/login"
          />
          <p className="-mt-14 pb-24 text-center text-sm text-steel">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-ink underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </PageTransition>
    )
  }

  const since = new Date(user.since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <PageTransition title="Account">
      <PageHeader eyebrow="Member" title={`Hi, ${user.name.split(' ')[0]}`} description={`${user.email} · Member since ${since}`} crumbs={[{ label: 'Account' }]}>
        <Button variant="outline" className="mt-6" onClick={logout}>
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6">
            <Package className="h-5 w-5 text-volt" />
            <p className="display mt-6 text-4xl">{orders.length}</p>
            <p className="text-sm text-steel">Orders placed</p>
          </div>
          <Link to="/wishlist" className="rounded-[28px] bg-white p-6 transition hover:shadow-soft">
            <Heart className="h-5 w-5 text-volt" />
            <p className="display mt-6 text-4xl">{wishlist.length}</p>
            <p className="text-sm text-steel">Saved in wishlist →</p>
          </Link>
          <button onClick={() => setCartOpen(true)} className="rounded-[28px] bg-white p-6 text-left transition hover:shadow-soft">
            <ShoppingBag className="h-5 w-5 text-volt" />
            <p className="display mt-6 text-4xl">{cartCount}</p>
            <p className="text-sm text-steel">Items in bag →</p>
          </button>
        </div>

        <h2 className="display mt-14 text-3xl">Order history</h2>
        {orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders yet" description="When you place an order with this email it will show up here." compact />
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((o) => (
              <li key={o.number} className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-white p-6">
                <div>
                  <p className="font-semibold">{o.number}</p>
                  <p className="text-sm text-steel">
                    {new Date(o.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.items.reduce((n, i) => n + i.qty, 0)} items
                  </p>
                </div>
                <p className="hidden max-w-sm truncate text-sm text-steel md:block">{o.items.map((i) => `${i.name} (EU ${i.size})`).join(', ')}</p>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-volt/10 px-3 py-1 text-xs font-semibold text-volt">Processing</span>
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageTransition>
  )
}
