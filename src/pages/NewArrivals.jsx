import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import ProductGrid from '../components/product/ProductGrid'
import ProductImage from '../components/product/ProductImage'
import Button from '../components/ui/Button'
import { newArrivals, products } from '../data/products'
import { formatPrice } from '../utils/format'

export default function NewArrivals() {
  const latest = [...newArrivals].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  const spotlight = latest[0]
  const upcoming = products.filter((p) => !p.isNew).sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 4)

  return (
    <PageTransition title="New Arrivals">
      <PageHeader
        eyebrow="Fresh drops"
        title="New Arrivals"
        description="The newest silhouettes and colourways from the STRIDEVOLT lab. Updated every week."
        crumbs={[{ label: 'New Arrivals' }]}
      />

      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12" aria-label="Spotlight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="noise group relative grid overflow-hidden rounded-[36px] bg-ink text-white lg:grid-cols-2"
        >
          <div className="pointer-events-none absolute -left-20 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-volt/30 blur-[110px]" aria-hidden />
          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="w-fit rounded-full bg-volt px-3 py-1 text-xs font-bold uppercase tracking-[0.15em]">New · Spotlight</span>
            <h2 className="display-wide mt-6 text-5xl sm:text-7xl">{spotlight.name}</h2>
            <p className="mt-4 max-w-md text-lg text-white/65">{spotlight.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button to={`/product/${spotlight.id}`} variant="light" size="lg" arrow>
                Shop {spotlight.name} · {formatPrice(spotlight.price)}
              </Button>
            </div>
          </div>
          <Link to={`/product/${spotlight.id}`} className="relative min-h-[320px] sm:min-h-[420px]" aria-label={`View ${spotlight.name}`} data-cursor="view">
            <ProductImage
              product={spotlight}
              view="pairAngle"
              eager
              className="absolute inset-[6%] transition-transform duration-1000 ease-[var(--ease-premium)] group-hover:-rotate-3 group-hover:scale-105"
            />
            <ArrowUpRight className="absolute right-8 top-8 h-8 w-8 text-white/40 transition group-hover:text-white" aria-hidden />
          </Link>
        </motion.div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12" aria-labelledby="latest-title">
        <h2 id="latest-title" className="display text-3xl sm:text-4xl">
          Latest drops <span className="text-mist">({latest.length})</span>
        </h2>
        <ProductGrid products={latest} className="mt-10" />
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12" aria-labelledby="recent-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="recent-title" className="display text-3xl sm:text-4xl">
            Recently restocked
          </h2>
          <Button to="/shop?sort=newest" variant="outline" arrow>
            Explore all
          </Button>
        </div>
        <ProductGrid products={upcoming} className="mt-10" />
      </section>
    </PageTransition>
  )
}
