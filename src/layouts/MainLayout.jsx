import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CustomCursor from '../components/layout/CustomCursor'
import CartDrawer from '../components/cart/CartDrawer'
import SearchModal from '../components/search/SearchModal'
import Toast from '../components/ui/Toast'
import ScrollProgress from '../components/layout/ScrollProgress'
import RouteCurtain from '../components/layout/RouteCurtain'

export default function MainLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <Toast />
      <CustomCursor />
      <RouteCurtain />
    </div>
  )
}
