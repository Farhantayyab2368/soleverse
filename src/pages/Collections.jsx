import PageTransition from '../components/layout/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import CollectionBanner from '../components/home/CollectionBanner'
import ProductGrid from '../components/product/ProductGrid'
import SectionHeading from '../components/ui/SectionHeading'
import Newsletter from '../components/home/Newsletter'
import { collections } from '../data/collections'
import { products } from '../data/products'

export default function Collections() {
  const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4)
  return (
    <PageTransition title="Collections" darkHero>
      <PageHeader
        dark
        eyebrow="Collections"
        title="Built for your lane"
        description="Running, street, basketball or training — every SOLEVERSE collection is engineered around a different kind of movement."
        crumbs={[{ label: 'Collections' }]}
      />
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24" aria-label="All collections">
        <div className="grid gap-5 lg:grid-cols-2">
          {collections.map((c, i) => (
            <CollectionBanner key={c.slug} collection={c} index={i} size="lg" />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12" aria-labelledby="best-title">
        <SectionHeading eyebrow="Across every collection" id="best-title" title="Best Sellers" />
        <ProductGrid products={bestSellers} className="mt-12" />
      </section>
      <Newsletter />
    </PageTransition>
  )
}
