import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { getProduct } from '../data/products'
import { CUSTOM_UPCHARGE } from '../data/customizer'

const ShopContext = createContext(null)

export const SHIPPING_RATES = { standard: 299, express: 799 }
export const FREE_SHIPPING_THRESHOLD = 50000 // standard delivery is free above this subtotal (PKR)
export const PROMO_CODES = { SOLE10: 0.1, FUTURE15: 0.15 }
export const DEFAULT_SIZE = 42

const itemKey = ({ productId, colorIndex, size, custom }) =>
  [productId, colorIndex, size, custom ? Object.values(custom).join('') : ''].join('|')

export function ShopProvider({ children }) {
  const [cart, setCart] = useLocalStorage('soleverse:cart', [])
  const [wishlist, setWishlist] = useLocalStorage('soleverse:wishlist', [])
  const [promo, setPromo] = useLocalStorage('soleverse:promo', null)
  const [isCartOpen, setCartOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const notify = useCallback((message, action) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message, action })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  /* ---------------- Cart ---------------- */

  const addToCart = useCallback(
    (product, { colorIndex = 0, size = DEFAULT_SIZE, qty = 1, custom = null, openDrawer = false, silent = false } = {}) => {
      const entry = { productId: product.id, colorIndex, size, custom }
      const key = itemKey(entry)
      setCart((prev) => {
        const existing = prev.find((i) => i.key === key)
        if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
        return [...prev, { ...entry, key, qty, addedAt: Date.now() }]
      })
      if (openDrawer) setCartOpen(true)
      else if (!silent) notify(`${product.name}${custom ? ' Custom' : ''} · EU ${size} added to bag`, { label: 'View bag', onClick: () => setCartOpen(true) })
    },
    [setCart, notify],
  )

  const updateQty = useCallback(
    (key, qty) => setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i))),
    [setCart],
  )

  const updateSize = useCallback(
    (key, size) =>
      setCart((prev) => {
        const item = prev.find((i) => i.key === key)
        if (!item) return prev
        const nextKey = itemKey({ ...item, size })
        const clash = prev.find((i) => i.key === nextKey)
        if (clash) {
          return prev
            .filter((i) => i.key !== key)
            .map((i) => (i.key === nextKey ? { ...i, qty: Math.min(10, i.qty + item.qty) } : i))
        }
        return prev.map((i) => (i.key === key ? { ...i, size, key: nextKey } : i))
      }),
    [setCart],
  )

  const removeFromCart = useCallback((key) => setCart((prev) => prev.filter((i) => i.key !== key)), [setCart])
  const clearCart = useCallback(() => setCart([]), [setCart])

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = getProduct(item.productId)
          if (!product) return null
          const colorway = product.colors[item.colorIndex] ?? product.colors[0]
          const unitPrice = product.price + (item.custom ? CUSTOM_UPCHARGE : 0)
          return { ...item, product, colorway, unitPrice, lineTotal: unitPrice * item.qty }
        })
        .filter(Boolean),
    [cart],
  )

  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0)

  const getTotals = useCallback(
    (shippingMethod = 'standard') => {
      const subtotal = cartItems.reduce((s, i) => s + i.lineTotal, 0)
      const method = SHIPPING_RATES[shippingMethod] ? shippingMethod : 'standard'
      const freeStandard = method === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD
      const shipping = subtotal > 0 && !freeStandard ? SHIPPING_RATES[method] : 0
      const rate = promo ? PROMO_CODES[promo] ?? 0 : 0
      const discount = Math.round(subtotal * rate)
      return { subtotal, shipping, discount, total: Math.max(0, subtotal - discount + shipping) }
    },
    [cartItems, promo],
  )

  const applyPromo = useCallback(
    (code) => {
      const normalized = code.trim().toUpperCase()
      if (PROMO_CODES[normalized]) {
        setPromo(normalized)
        return true
      }
      return false
    },
    [setPromo],
  )

  /* ---------------- Wishlist ---------------- */

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])

  const toggleWishlist = useCallback(
    (product) => {
      const has = wishlist.includes(product.id)
      setWishlist((prev) => (has ? prev.filter((id) => id !== product.id) : [...new Set([...prev, product.id])]))
      notify(has ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`)
    },
    [wishlist, setWishlist, notify],
  )

  const removeFromWishlist = useCallback((id) => setWishlist((prev) => prev.filter((x) => x !== id)), [setWishlist])

  const moveToCart = useCallback(
    (product, size = DEFAULT_SIZE) => {
      addToCart(product, { size, silent: true })
      removeFromWishlist(product.id)
      notify(`${product.name} moved to your bag`, { label: 'View bag', onClick: () => setCartOpen(true) })
    },
    [addToCart, removeFromWishlist, notify],
  )

  const wishlistProducts = useMemo(() => wishlist.map(getProduct).filter(Boolean), [wishlist])

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      addToCart,
      updateQty,
      updateSize,
      removeFromCart,
      clearCart,
      getTotals,
      promo,
      applyPromo,
      removePromo: () => setPromo(null),
      wishlist,
      wishlistProducts,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      moveToCart,
      isCartOpen,
      setCartOpen,
      isSearchOpen,
      setSearchOpen,
      toast,
      dismissToast: () => setToast(null),
      notify,
    }),
    [
      cartItems, cartCount, addToCart, updateQty, updateSize, removeFromCart, clearCart, getTotals, promo, applyPromo,
      setPromo, wishlist, wishlistProducts, isWishlisted, toggleWishlist, removeFromWishlist, moveToCart, isCartOpen,
      isSearchOpen, toast, notify,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
