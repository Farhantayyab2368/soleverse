import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import Logo from '../ui/Logo'
import { useShop } from '../../context/ShopContext'
import { useAuth } from '../../context/AuthContext'
import useScrollLock from '../../hooks/useScrollLock'
import useNavTheme from '../../hooks/useNavTheme'
import { cn } from '../../utils/format'

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/about', label: 'About' },
]


function CountBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 18 }}
          className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-volt px-1 text-[0.62rem] font-bold text-white"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function IconButton({ label, onClick, to, children, className, ...rest }) {
  const classes = cn('relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-300', className)
  const inner = (
    <motion.span whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} className="grid place-items-center">
      {children}
    </motion.span>
  )
  return to ? (
    <Link to={to} aria-label={label} className={classes} data-cursor="hover" {...rest}>
      {inner}
    </Link>
  ) : (
    <button onClick={onClick} aria-label={label} className={classes} data-cursor="hover" {...rest}>
      {inner}
    </button>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useShop()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  useScrollLock(menuOpen)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 500 && y > prev && !menuOpen)
  })

  useEffect(() => {
    setMenuOpen(false)
    setHidden(false)
  }, [pathname])

  const navTheme = useNavTheme()
  const overDark = navTheme === 'dark' && !scrolled && !menuOpen
  const iconTone = overDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5'

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-5"
      >
        <nav
          aria-label="Main"
          className={cn(
            'mx-auto flex h-16 max-w-[1440px] items-center justify-between rounded-full pl-5 pr-2 transition-all duration-500 ease-[var(--ease-premium)] sm:pl-6',
            scrolled || menuOpen ? 'glass shadow-soft ring-1 ring-black/5' : 'bg-transparent',
          )}
        >
          <Logo light={overDark} onClick={() => setMenuOpen(false)} />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  data-cursor="hover"
                  className={({ isActive }) =>
                    cn(
                      'relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                      overDark ? (isActive ? 'text-white' : 'text-white/65 hover:text-white') : isActive ? 'text-ink' : 'text-ink/55 hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className={cn('absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full', overDark ? 'bg-white' : 'bg-volt')}
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-0.5">
            <IconButton label="Search" onClick={() => setSearchOpen(true)} className={iconTone}>
              <Search className="h-[19px] w-[19px]" />
            </IconButton>
            <IconButton label={`Wishlist, ${wishlist.length} items`} to="/wishlist" className={cn(iconTone, 'hidden sm:grid')}>
              <Heart className="h-[19px] w-[19px]" />
              <CountBadge count={wishlist.length} />
            </IconButton>
            <IconButton label={`Shopping bag, ${cartCount} items`} onClick={() => setCartOpen(true)} className={iconTone} data-cart-icon>
              <ShoppingBag className="h-[19px] w-[19px]" />
              <CountBadge count={cartCount} />
            </IconButton>
            <IconButton label={user ? 'Your account' : 'Sign in'} to="/account" className={cn(iconTone, 'hidden sm:grid')}>
              <User className="h-[19px] w-[19px]" />
            </IconButton>
            <IconButton
              label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
              className={cn('lg:hidden', menuOpen ? 'text-ink hover:bg-ink/5' : iconTone)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={menuOpen ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </IconButton>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-paper px-6 pb-8 pt-28 lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            id="mobile-menu"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li key={link.to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => cn('display block py-1.5 text-[2.1rem] sm:text-6xl', isActive ? 'text-volt' : 'text-ink')}
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-auto grid grid-cols-2 gap-3">
              <Link to="/wishlist" className="flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white py-4 font-semibold">
                <Heart className="h-4 w-4" /> Wishlist ({wishlist.length})
              </Link>
              <Link to="/account" className="flex items-center justify-center gap-2 rounded-full bg-ink py-4 font-semibold text-white">
                <User className="h-4 w-4" /> {user ? 'Account' : 'Sign in'}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
