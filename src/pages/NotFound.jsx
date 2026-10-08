import { motion } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import Button from '../components/ui/Button'
import ShoeSilhouette from '../components/ui/ShoeSilhouette'

export default function NotFound() {
  return (
    <PageTransition title="Page not found" darkHero>
      <section className="noise relative flex min-h-[100svh] items-center overflow-hidden bg-ink px-5 pb-20 pt-32 text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/25 blur-[120px]" aria-hidden />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="display-wide text-outline select-none text-[38vw] leading-none sm:text-[16rem]" aria-hidden>
            404
          </p>
          <motion.div
            className="-mt-[14vw] w-48 sm:-mt-36 sm:w-64"
            animate={{ y: [0, -12, 0], rotate: [-4, 2, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ShoeSilhouette className="w-full" colors={{ main: '#ededea', sole: '#ffffff', accent: '#2f6bff' }} />
          </motion.div>
          <h1 className="display mt-10 text-4xl sm:text-5xl">Looks like you’ve stepped off the path.</h1>
          <p className="mt-4 max-w-md text-white/60">The page you’re looking for has moved, sold out or never existed. Let’s get you back on track.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/shop" variant="light" size="lg" arrow>
              Back to shopping
            </Button>
            <Button to="/" variant="outline-light" size="lg">
              Go home
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
