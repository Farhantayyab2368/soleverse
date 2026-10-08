import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { cn } from '../../utils/format'

/** Responsive product grid: 2 cols mobile, 3 tablet, 4 desktop (configurable). */
export default function ProductGrid({ products, columns = 4, className, animateLayout = false }) {
  const cols = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  }[columns]

  return (
    <motion.div layout={animateLayout} className={cn('grid gap-x-3 gap-y-10 sm:gap-x-5 lg:gap-x-6', cols, className)}>
      <AnimatePresence mode="popLayout">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            layout={animateLayout}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: (i % columns) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCard product={product} priority={i < 4} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
