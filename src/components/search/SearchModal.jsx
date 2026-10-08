import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Search, X } from 'lucide-react'
import Modal from '../ui/Modal'
import ProductImage from '../product/ProductImage'
import ShoeSilhouette from '../ui/ShoeSilhouette'
import { useShop } from '../../context/ShopContext'
import { products, searchProducts } from '../../data/products'
import { formatPrice } from '../../utils/format'

// show the colourway that matched the query (e.g. 'black' → black pair)
const matchColor = (p, q) => Math.max(0, p.colors.findIndex((c) => `${c.name} ${c.family}`.toLowerCase().includes(q.trim().toLowerCase())))

const POPULAR = ['Running', 'Aero', 'Basketball', 'Black', 'Lifestyle', 'Training']

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useShop()
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const navigate = useNavigate()
  const results = useMemo(() => searchProducts(deferred), [deferred])
  const trending = useMemo(() => products.filter((p) => p.isNew || p.isFeatured).slice(0, 4), [])
  const close = () => setSearchOpen(false)

  // Keyboard shortcut: Ctrl/Cmd + K or "/"
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  useEffect(() => {
    if (!isSearchOpen) setQuery('')
  }, [isSearchOpen])

  const onSubmit = (e) => {
    e.preventDefault()
    if (results.length === 1) navigate(`/product/${results[0].id}`)
    else navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
    close()
  }

  const list = query.trim() ? results : trending

  return (
    <Modal open={isSearchOpen} onClose={close} variant="full" labelledBy="search-title">
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
        <div className="flex items-center justify-between">
          <h2 id="search-title" className="eyebrow text-mist">
            Search Soleverse
          </h2>
          <button onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition hover:bg-fog" aria-label="Close search" data-cursor="hover">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="relative mt-6" role="search">
          <Search className="absolute left-0 top-1/2 h-7 w-7 -translate-y-1/2 text-mist sm:h-9 sm:w-9" aria-hidden />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            data-autofocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your next pair…"
            autoComplete="off"
            className="display w-full border-b-2 border-ink/10 bg-transparent py-4 pl-11 text-3xl placeholder:text-ink/20 focus:border-volt focus:outline-none sm:pl-14 sm:text-5xl"
          />
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {POPULAR.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium transition hover:border-ink"
            >
              {term}
            </button>
          ))}
        </div>

        <p className="eyebrow mt-10 text-mist" aria-live="polite">
          {query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Trending now'}
        </p>

        <AnimatePresence mode="wait">
          {query.trim() && results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-16 text-center">
              <ShoeSilhouette outline className="w-28 text-ink/30" />
              <p className="display mt-6 text-2xl">No products found.</p>
              <p className="mt-2 text-steel">We couldn’t find that pair. Try “running” or “black”.</p>
            </motion.div>
          ) : (
            <motion.ul key={query.trim() ? 'results' : 'trending'} className="mt-4 grid gap-3 sm:grid-cols-2" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }}>
              {list.map((p) => (
                <motion.li key={p.id} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
                  <Link
                    to={`/product/${p.id}`}
                    onClick={close}
                    className="group flex items-center gap-4 rounded-3xl bg-white p-3 pr-5 shadow-[0_1px_0_rgb(0_0_0/0.04)] transition hover:shadow-soft"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-paper">
                      <ProductImage product={p} colorIndex={query.trim() ? matchColor(p, query) : 0} view="side" size="sm" className="absolute inset-1 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-[0.62rem] text-mist">{p.category}</p>
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="text-sm text-steel">{formatPrice(p.price)}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-mist transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}
