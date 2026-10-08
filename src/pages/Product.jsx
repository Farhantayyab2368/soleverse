import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import ProductGallery from '../components/product/ProductGallery'
import ProductDetails from '../components/product/ProductDetails'
import ProductGrid from '../components/product/ProductGrid'
import SectionHeading from '../components/ui/SectionHeading'
import Stars from '../components/ui/Stars'
import Reveal from '../components/ui/Reveal'
import NotFound from './NotFound'
import { getProduct, getRelated } from '../data/products'
import { testimonials } from '../data/testimonials'
import { formatNumber } from '../utils/format'

const BARS = [
  [5, 0.82],
  [4, 0.13],
  [3, 0.03],
  [2, 0.01],
  [1, 0.01],
]

export default function Product() {
  const { id } = useParams()
  const product = getProduct(id)
  // `key` on the page resets colour/mode when navigating between products
  if (!product) return <NotFound />
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const [colorIndex, setColorIndex] = useState(0)
  const [mode, setMode] = useState('images')
  const related = getRelated(product)

  return (
    <PageTransition title={product.name}>
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32 lg:px-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-mist">
            <li>
              <Link to="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link to={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-ink">
                {product.category}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <ProductGallery product={product} colorIndex={colorIndex} mode={mode} onModeChange={setMode} />
          <ProductDetails product={product} colorIndex={colorIndex} setColorIndex={setColorIndex} />
        </div>

        <section id="reviews" className="mt-28 scroll-mt-28 rounded-[32px] bg-white p-6 sm:p-10 lg:p-14" aria-labelledby="reviews-title">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
            <div>
              <h2 id="reviews-title" className="display text-3xl">
                Reviews
              </h2>
              <div className="mt-6 flex items-end gap-3">
                <p className="display text-6xl">{product.rating}</p>
                <div className="pb-2">
                  <Stars rating={product.rating} size={16} />
                  <p className="mt-1 text-sm text-steel">{formatNumber(product.reviews)} reviews</p>
                </div>
              </div>
              <ul className="mt-6 space-y-2">
                {BARS.map(([stars, pct]) => (
                  <li key={stars} className="flex items-center gap-3 text-sm">
                    <span className="w-3 text-steel">{stars}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper">
                      <span className="block h-full rounded-full bg-ink" style={{ width: `${pct * 100}%` }} />
                    </span>
                    <span className="w-9 text-right text-steel">{Math.round(pct * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {testimonials.slice(0, 4).map((t, i) => (
                <Reveal as="li" key={t.name} delay={i * 0.05} className="rounded-[24px] bg-paper p-6">
                  <Stars rating={t.rating} size={14} />
                  <p className="mt-4 leading-relaxed">“{t.quote}”</p>
                  <p className="mt-4 text-sm font-semibold">
                    {t.name} <span className="font-normal text-steel">· Verified buyer</span>
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-28" aria-labelledby="related-title">
          <SectionHeading eyebrow="Complete the rotation" id="related-title" title="You may also like" />
          <ProductGrid products={related} className="mt-12" />
        </section>
      </div>
    </PageTransition>
  )
}
