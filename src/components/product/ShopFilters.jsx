import { Check, Star } from 'lucide-react'
import { COLOR_FAMILIES, MAX_PRICE, MIN_PRICE, SIZES } from '../../data/products'
import { cn, formatPrice } from '../../utils/format'

export const SHOP_CATEGORIES = ['All', 'Joggers', 'Sneakers', 'Comfort']

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-ink/5 py-6 first:pt-0 last:border-0">
      <legend className="mb-4 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  )
}

export default function ShopFilters({ filters, setFilters, category, setCategory, counts }) {
  const toggle = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }))

  return (
    <div>
      <Group title="Category">
        <ul className="space-y-1">
          {SHOP_CATEGORIES.map((c) => {
            const on = category === c
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={on}
                  className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition', on ? 'bg-ink text-white' : 'hover:bg-ink/5')}
                >
                  <span className="font-medium">{c === 'All' ? 'All Products' : c}</span>
                  <span className={cn('text-xs', on ? 'text-white/60' : 'text-mist')}>{counts[c] ?? 0}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </Group>

      <Group title="Size (EU)">
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => {
            const on = filters.sizes.includes(s)
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggle('sizes', s)}
                className={cn('h-10 rounded-xl border text-sm font-medium transition', on ? 'border-ink bg-ink text-white' : 'border-fog bg-white hover:border-ink')}
              >
                {s}
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Colour">
        <div className="grid grid-cols-4 gap-3">
          {COLOR_FAMILIES.map((c) => {
            const on = filters.colors.includes(c.name)
            const light = c.name === 'White'
            return (
              <button key={c.name} type="button" aria-pressed={on} onClick={() => toggle('colors', c.name)} className="group flex flex-col items-center gap-1.5" title={c.name}>
                <span
                  className={cn('grid h-9 w-9 place-items-center rounded-full ring-offset-2 transition', on ? 'ring-2 ring-ink' : 'ring-1 ring-black/10 group-hover:ring-black/30')}
                  style={{ background: c.hex }}
                >
                  {on && <Check className={cn('h-4 w-4', light ? 'text-ink' : 'text-white')} strokeWidth={3} />}
                </span>
                <span className="text-[0.7rem] text-steel">{c.name}</span>
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Price">
        <div className="flex items-center justify-between text-sm">
          <span className="text-steel">Up to</span>
          <span className="font-semibold">{formatPrice(filters.maxPrice)}</span>
        </div>
        <label htmlFor="price-range" className="sr-only">
          Maximum price
        </label>
        <input
          id="price-range"
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={5}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="mt-3 w-full accent-volt"
        />
        <div className="mt-1 flex justify-between text-xs text-mist">
          <span>{formatPrice(MIN_PRICE)}</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </Group>

      <Group title="Rating">
        <div className="flex flex-wrap gap-2">
          {[0, 4.5, 4.7, 4.8].map((r) => {
            const on = filters.minRating === r
            return (
              <button
                key={r}
                type="button"
                aria-pressed={on}
                onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
                className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium transition', on ? 'border-ink bg-ink text-white' : 'border-fog bg-white hover:border-ink')}
              >
                {r === 0 ? 'Any' : (
                  <>
                    <Star className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} /> {r}+
                  </>
                )}
              </button>
            )
          })}
        </div>
      </Group>
    </div>
  )
}
