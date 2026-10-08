import PageTransition from '../components/layout/PageTransition'
import Hero from '../components/home/Hero'
import FeatureHighlights, { Marquee } from '../components/home/FeatureHighlights'
import FeaturedProducts from '../components/home/FeaturedProducts'
import SpinShowcase from '../components/home/SpinShowcase'
import CustomizerSection from '../components/home/CustomizerSection'
import CollectionBanner from '../components/home/CollectionBanner'
import TechSection from '../components/home/TechSection'
import NewArrivalsSection from '../components/home/NewArrivalsSection'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { collections } from '../data/collections'

export default function Home({ ready }) {
  return (
    <PageTransition darkHero>
      <Hero ready={ready} />
      <Marquee />
      <FeatureHighlights />
      <SpinShowcase />
      <div className="h-24 lg:h-32" aria-hidden />
      <FeaturedProducts />
      <CustomizerSection />

      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32" aria-labelledby="collections-title">
        <SectionHeading
          eyebrow="Collections"
          id="collections-title" title="Find your lane"
          description="Joggers, sneakers and comfort shoes — three collections engineered for exactly how you move."
          action={
            <Button to="/collections" variant="outline" arrow>
              All collections
            </Button>
          }
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:gap-5">
          {collections.map((c, i) => (
            <CollectionBanner key={c.slug} collection={c} index={i} />
          ))}
        </div>
      </section>

      <TechSection />
      <NewArrivalsSection />
      <Testimonials />
      <Newsletter />
    </PageTransition>
  )
}
