import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import ProductGrid from '../product/ProductGrid'
import { newArrivals } from '../../data/products'

export default function NewArrivalsSection() {
  const latest = [...newArrivals].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 4)
  return (
    <section className="bg-white py-24 lg:py-32" aria-labelledby="new-title">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Just Landed"
          id="new-title" title="New Arrivals"
          description="Fresh silhouettes and first-look colourways, straight from the SOLEVERSE lab."
          action={
            <Button to="/new-arrivals" variant="primary" arrow>
              Explore New Arrivals
            </Button>
          }
        />
        <ProductGrid products={latest} className="mt-14" />
      </div>
    </section>
  )
}
