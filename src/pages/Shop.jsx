import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import ProductGrid from '../components/product/ProductGrid'
import ShopFilters, { SHOP_CATEGORIES } from '../components/product/ShopFilters'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { MAX_PRICE, products } from '../data/products'
import { cn } from '../utils/format'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
]

const EMPTY_FILTERS = { sizes: [], colors: [], maxPrice: MAX_PRICE, minRating: 0 }

const sorters = {
  featured: (a, b) => b.isFeatured - a.isFeatured || b.isNew - a.isNew || b.reviews - a.reviews,
  newest: (a, b) => b.releaseDate.localeCompare(a.releaseDate),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
}

const matchCategory = (p, c) => c === 'All' || p.tags.includes(c)

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [drawer, setDrawer] = useState(false)

  const categoryParam = params.get('category') ?? 'all'
  const category = SHOP_CATEGORIES.find((c) => c.toLowerCase() === categoryParam.toLowerCase()) ?? 'All'
  const sort = SORTS.some((s) => s.value === params.get('sort')) ? params.get('sort') : 'featured'
  const query = params.get('q') ?? ''

  const updateParam = (key, value, fallback) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!value || value === fallback) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )

  const setCategory = (c) => updateParam('category', c.toLowerCase(), 'all')

  const base = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (q && ![p.name, p.category, ...p.tags, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(q)) return false
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s) && !p.soldOut.includes(s))) return false
      if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c.family))) return false
      if (p.price > filters.maxPrice) return false
      if (p.rating < filters.minRating) return false
      return true
    })
  }, [filters, query])

  const counts = useMemo(() => Object.fromEntries(SHOP_CATEGORIES.map((c) => [c, base.filter((p) => matchCategory(p, c)).length])), [base])
  const results = useMemo(() => base.filter((p) => matchCategory(p, category)).sort(sorters[sort]), [base, category, sort])

  const chips = [
    ...(category !== 'All' ? [{ label: category, clear: () => setCategory('All') }] : []),
    ...(query ? [{ label: `“${query}”`, clear: () => updateParam('q', '') }] : []),
    ...filters.sizes.map((s) => ({ label: `EU ${s}`, clear: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })) })),
    ...filters.colors.map((c) => ({ label: c, clear: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })) })),
    ...(filters.maxPrice < MAX_PRICE ? [{ label: `Under $${filters.maxPrice}`, clear: () => setFilters((f) => ({ ...f, maxPrice: MAX_PRICE })) }] : []),
    ...(filters.minRating ? [{ label: `${filters.minRating}+ stars`, clear: () => setFilters((f) => ({ ...f, minRating: 0 })) }] : []),
  ]

  const clearAll = () => {
    setFilters(EMPTY_FILTERS)
    setParams({}, { replace: true })
  }

  const filterProps = { filters, setFilters, category, setCategory, counts }

  return (
    <PageTransition title="Shop">
      <PageHeader
        eyebrow="Shop"
        title={category === 'All' ? 'All Shoes' : category}
        description="Performance and lifestyle footwear, engineered in 3D. Filter by fit, colour and feel."
        crumbs={[{ label: 'Shop', to: '/shop' }, ...(category !== 'All' ? [{ label: category }] : [])]}
      />

      {/* Category pills */}
      <div className="no-scrollbar mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 pb-2 sm:px-8 lg:px-12">
        {SHOP_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={cn(
              'relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
              category === c ? 'text-white' : 'bg-white text-ink hover:bg-fog',
            )}
          >
            {category === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />}
            <span className="relative">{c === 'All' ? 'All Products' : c}</span>
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-8 sm:px-8 lg:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:gap-10">
          <aside className="hidden lg:block" aria-label="Filters">
            <div data-lenis-prevent className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[28px] bg-white p-6 no-scrollbar">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="display text-lg">Filters</h2>
                {chips.length > 0 && (
                  <button onClick={clearAll} className="text-sm text-steel underline-offset-4 hover:text-ink hover:underline">
                    Clear all
                  </button>
                )}
              </div>
              <ShopFilters {...filterProps} />
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-steel" aria-live="polite">
                <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'style' : 'styles'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDrawer(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 text-sm font-semibold lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                  {chips.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-[0.65rem] text-white">{chips.length}</span>}
                </button>
                <label htmlFor="sort" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value, 'featured')}
                  className="h-11 rounded-full border border-ink/10 bg-white pl-4 pr-9 text-sm font-semibold focus:border-volt focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      Sort: {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {chips.length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="flex flex-wrap gap-2 pt-4">
                    {chips.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={chip.clear}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 py-1.5 pl-3 pr-2 text-sm font-medium transition hover:bg-ink/10"
                        aria-label={`Remove filter ${chip.label}`}
                      >
                        {chip.label} <X className="h-3.5 w-3.5" />
                      </button>
                    ))}
                    <button onClick={clearAll} className="px-2 text-sm font-semibold text-volt hover:underline">
                      Clear all
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {results.length ? (
              <ProductGrid key={`${category}-${sort}`} products={results} className="mt-8" columns={4} />
            ) : (
              <EmptyState
                title="We couldn't find that pair."
                description="Try removing a filter or searching for something else."
                actionLabel="Clear filters"
                onAction={clearAll}
              />
            )}
          </div>
        </div>
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} variant="right" labelledBy="filters-title">
        <div className="flex items-center justify-between border-b border-fog px-6 py-5">
          <h2 id="filters-title" className="display text-xl">
            Filters
          </h2>
          <button onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-full bg-paper" aria-label="Close filters">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ShopFilters {...filterProps} />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-fog p-5">
          <Button variant="outline" onClick={clearAll}>
            Clear all
          </Button>
          <Button onClick={() => setDrawer(false)}>Show {results.length}</Button>
        </div>
      </Modal>
    </PageTransition>
  )
}
