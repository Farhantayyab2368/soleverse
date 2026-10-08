import { motion } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import ProductImage from '../components/product/ProductImage'
import { getProduct } from '../data/products'

export default function AuthLayout({ title, heading, subheading, children, productId = 'aero-x1', colorIndex = 1 }) {
  const product = getProduct(productId)
  return (
    <PageTransition title={title}>
      <div className="mx-auto grid min-h-[100svh] max-w-[1440px] gap-6 px-3 pb-6 pt-24 sm:px-5 lg:grid-cols-2">
        <div className="noise relative hidden overflow-hidden rounded-[36px] bg-ink text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgb(47_107_255/0.45),transparent_65%)]" aria-hidden />
          <div className="grid-floor absolute inset-0" aria-hidden />
          <motion.div
            className="absolute inset-x-[8%] top-[18%] h-[52%]"
            animate={{ y: [0, -14, 0], rotate: [-3, 0, -3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ProductImage product={product} colorIndex={colorIndex} view="angle" eager className="absolute inset-0" />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 p-12">
            <p className="display-wide text-5xl xl:text-6xl">Step into the future.</p>
            <p className="mt-4 max-w-sm text-white/60">Members get early access to drops, free express shipping and exclusive colourways.</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-2 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <h1 className="display-wide text-4xl sm:text-5xl">{heading}</h1>
            {subheading && <p className="mt-3 text-steel">{subheading}</p>}
            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
