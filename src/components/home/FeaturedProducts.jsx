import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import ProductGrid from '../product/ProductGrid'
import { featuredProducts } from '../../data/products'

export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32" aria-labelledby="featured-title">
      <SectionHeading
        eyebrow="Featured"
        id="featured-title" title="Featured Sneakers"
        description="Our most-loved silhouettes — engineered in 3D, tuned on the track and built for the street."
        action={
          <Button to="/shop" variant="outline" arrow>
            View all shoes
          </Button>
        }
      />
      <ProductGrid products={featuredProducts} className="mt-14" />
    </section>
  )
}
