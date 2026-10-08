import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import LoadingScreen from './components/layout/LoadingScreen'
import Home from './pages/Home'
import { markAppReady, preloadStudio } from './utils/shoeImages'
import { initSmoothScroll, scrollToElement, scrollToTop } from './utils/smoothScroll'

const Shop = lazy(() => import('./pages/Shop'))
const Collections = lazy(() => import('./pages/Collections'))
const NewArrivals = lazy(() => import('./pages/NewArrivals'))
const About = lazy(() => import('./pages/About'))
const Product = lazy(() => import('./pages/Product'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Account = lazy(() => import('./pages/Account'))
const Help = lazy(() => import('./pages/Help'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="grid min-h-[100svh] place-items-center" aria-busy="true" aria-label="Loading page">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/10 border-t-ink" />
    </div>
  )
}

/** Scrolls to a #hash target, waiting for lazily-loaded pages to mount it. */
function seekHash(hash, behavior = 'smooth') {
  let tries = 0
  const seek = () => {
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) scrollToElement(el, { immediate: behavior !== 'smooth' })
    else if (tries++ < 40) setTimeout(seek, 100)
  }
  seek()
}

/** After a page transition: jump to #hash targets, otherwise scroll to top. */
function scrollAfterTransition(hash) {
  scrollToTop()
  if (hash) seekHash(hash)
}

export default function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [introDone, setIntroDone] = useState(false)
  const done = useCallback(() => setLoading(false), [])
  const onIntroExit = useCallback(() => {
    markAppReady()
    setIntroDone(true)
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    initSmoothScroll()
    // warm up the 3D photo studio while the loader is on screen
    preloadStudio()
  }, [])

  // same-page hash links (e.g. /help#faq while already on /help)
  useEffect(() => {
    if (location.hash) seekHash(location.hash)
  }, [location.hash])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence onExitComplete={onIntroExit}>{loading && <LoadingScreen key="loader" onDone={done} />}</AnimatePresence>
      <MainLayout>
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollAfterTransition(window.location.hash)}>
          <Suspense key={location.pathname} fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home ready={introDone} />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<Account />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </MainLayout>
    </MotionConfig>
  )
}
