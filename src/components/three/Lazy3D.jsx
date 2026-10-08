import { lazy, Suspense } from 'react'
import ErrorBoundary from '../ui/ErrorBoundary'
import ProductImage from '../product/ProductImage'
import { getProduct } from '../../data/products'
import { cn } from '../../utils/format'

/*
 * Code-split entry points for every WebGL scene. Three.js only downloads when a
 * 3D scene is actually rendered, and any WebGL failure degrades to a studio image.
 */
const ThreeDShoeViewerImpl = lazy(() => import('./ThreeDShoeViewer'))
const HeroSceneImpl = lazy(() => import('./HeroScene'))
const TechSceneImpl = lazy(() => import('./TechScene'))
const SpinSceneImpl = lazy(() => import('./SpinScene'))

function Loading3D({ dark }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-3">
        <span className={cn('h-9 w-9 animate-spin rounded-full border-2', dark ? 'border-white/15 border-t-white' : 'border-ink/10 border-t-ink')} />
        <span className={cn('eyebrow', dark ? 'text-white/50' : 'text-mist')}>Loading 3D</span>
      </div>
    </div>
  )
}

function ImageFallback({ colors, style, dark }) {
  const base = getProduct('aero-x1')
  const product = { ...base, style: style ?? base.style, colors: [{ ...base.colors[0], colors: colors ?? base.colors[0].colors }] }
  return (
    <div className="absolute inset-0 grid place-items-center p-8">
      <ProductImage product={product} colorIndex={0} view="angle" className="absolute inset-[6%]" alt={dark ? 'SOLEVERSE sneaker' : undefined} />
    </div>
  )
}

export function ThreeDShoeViewer(props) {
  return (
    <ErrorBoundary fallback={<ImageFallback {...props} />}>
      <Suspense fallback={<Loading3D dark={props.dark} />}>
        <ThreeDShoeViewerImpl {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

export function HeroScene(props) {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <HeroSceneImpl {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

export function SpinScene(props) {
  return (
    <ErrorBoundary fallback={<ImageFallback colors={props.colors} dark />}>
      <Suspense fallback={<Loading3D dark />}>
        <SpinSceneImpl {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

export function TechScene(props) {
  return (
    <ErrorBoundary fallback={<ImageFallback colors={{ main: '#1b1c20', sole: '#f4f4f0', lace: '#2a2c32', accent: '#2f6bff' }} dark />}>
      <Suspense fallback={<Loading3D dark />}>
        <TechSceneImpl {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}
