import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import ProductImage from '../product/ProductImage'
import { getProduct } from '../../data/products'
import { cn } from '../../utils/format'

/** Large visual banner for a collection (used on Home + Collections page). */
export default function CollectionBanner({ collection, size = 'md', index = 0 }) {
  const product = getProduct(collection.productId)
  const tall = size === 'lg'
  const to = `/shop?category=${collection.category.toLowerCase()}`
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      data-cursor="view"
    >
      <Link
        to={to}
        className={cn(
          'relative flex flex-col overflow-hidden rounded-[32px] p-7 sm:p-10',
          tall ? 'min-h-[520px] lg:min-h-[600px]' : 'min-h-[440px] sm:min-h-[480px]',
          collection.dark ? 'text-white' : 'text-ink',
        )}
        style={{ background: collection.tone }}
        aria-label={`${collection.name} — ${collection.blurb} Shop now`}
      >
        <div className="noise absolute inset-0" aria-hidden />
        <p
          className={cn(
            'display-wide pointer-events-none absolute -bottom-6 left-4 select-none whitespace-nowrap text-[24vw] transition-transform duration-1000 ease-[var(--ease-premium)] group-hover:-translate-x-6 sm:text-[16vw] lg:text-[10vw]',
            collection.dark ? 'text-white/[0.07]' : 'text-ink/[0.05]',
          )}
          aria-hidden
        >
          {collection.short}
        </p>

        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="max-w-sm">
            <p className={cn('eyebrow', collection.dark ? 'text-white/60' : 'text-volt')}>Collection · 0{index + 1}</p>
            <h3 className="display mt-3 text-3xl sm:text-[2.6rem]">{collection.name}</h3>
            <p className={cn('mt-3 text-base', collection.dark ? 'text-white/70' : 'text-steel')}>{tall ? collection.description : collection.blurb}</p>
          </div>
          <span
            className={cn(
              'grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45',
              collection.dark ? 'bg-white text-ink' : 'bg-ink text-white',
            )}
            aria-hidden
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-[2%] bottom-[-4%] top-[30%] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-3 group-hover:scale-[1.05] group-hover:-rotate-3 sm:left-[14%] sm:right-[-6%]">
          <ProductImage product={product} colorIndex={collection.colorIndex} view="pairAngle" className="absolute inset-0" />
        </div>

        <span
          className={cn(
            'relative z-10 mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold backdrop-blur transition-colors',
            collection.dark ? 'bg-white/10 group-hover:bg-white group-hover:text-ink' : 'bg-ink/5 group-hover:bg-ink group-hover:text-white',
          )}
        >
          Shop {collection.short}
        </span>
      </Link>
    </motion.article>
  )
}
