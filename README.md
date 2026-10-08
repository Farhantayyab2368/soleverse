# SOLEVERSE — Step Into The Future

A premium, 3D-first sneaker e-commerce experience built with React, Vite, Tailwind CSS v4,
Three.js / React Three Fiber / Drei and Framer Motion.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build
```

## Animations

Lenis smooth scrolling · scroll progress bar · page-transition curtain · hero pair drop-in + scroll split ·
pinned 360° scroll-spin showcase with colourway changes · word-by-word heading reveals · count-up stats ·
3D tilt + glare product cards · magnetic CTA buttons with shine sweep · fly-to-bag on Quick Add · footer wordmark reveal.
All respect `prefers-reduced-motion`.

## Highlights

- **Interactive 3D sneaker** (hero, product viewer, customizer, technology section) — drag to rotate,
  zoom buttons / click + scroll / pinch, auto-rotate when idle, reset view, cursor tilt, soft contact shadows.
- **3D colour customizer** — upper, sole, laces and accent with smooth colour transitions; custom pairs can be added to the bag.
- **Studio product photography generated from the 3D model** — every colourway and angle (side, front, back,
  top, lifestyle) is rendered off-screen once and cached, so the catalogue needs no image files.
- Shop with category / size / colour / price / rating filters and sorting (URL-synced), product details with
  gallery zoom + "View in 3D", size guide, cart drawer, promo codes (`SOLE10`, `FUTURE15`), wishlist,
  search overlay (`/` or `Ctrl/⌘ + K`), mock checkout with order confirmation, mock login / sign-up / account.
- Cart, wishlist, orders and accounts persist in `localStorage`.

## 3D model & credits

The sneaker is a photoscanned model: **"Materials Variants Shoe" by Shopify**, from the
[Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MaterialsVariantsShoe),
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and credited in the site footer.

A shader patch (`src/three/realShoe.js`) recolours its texture in four zones (knit upper, foam sole, laces & lining,
stripes & heel tab) while keeping the real knit and stitch detail, so every colourway and the 3D customizer use the
same realistic model. Product photos show left + right pairs plus single-shoe angles.

To swap the model, replace `public/models/shoe.glb` (see `public/models/README.md`). If the file is missing or
invalid, the procedural SOLEVERSE sneaker is used instead and nothing crashes.

## Project structure

```
src/
├── components/
│   ├── cart/        CartDrawer, CartItem, OrderSummary
│   ├── checkout/    CheckoutForm
│   ├── home/        Hero, FeatureHighlights, FeaturedProducts, CustomizerSection, CollectionBanner,
│   │                TechSection, NewArrivalsSection, Testimonials, Newsletter
│   ├── layout/      Navbar, Footer, CustomCursor, LoadingScreen, PageTransition
│   ├── product/     ProductCard, ProductGrid, ProductImage, ProductGallery, ProductDetails,
│   │                ColorSelector, SizeSelector, SizeGuideModal, ShopFilters
│   ├── search/      SearchModal
│   ├── three/       ThreeDShoeViewer, ShoeModel, HeroScene, TechScene, StudioEnvironment, Lazy3D
│   └── ui/          Button, Modal, Stars, Reveal, SectionHeading, EmptyState, …
├── context/         ShopContext (cart, wishlist, UI), AuthContext (mock auth + orders)
├── data/            products.js, collections.js, testimonials.js, customizer.js
├── hooks/           useLocalStorage, useInView, useShoeImage, useScrollLock, useFocusTrap, …
├── layouts/         MainLayout, AuthLayout
├── pages/           Home, Shop, Collections, NewArrivals, About, Product, Wishlist, Cart,
│                    Checkout, Login, Signup, Account, Help, NotFound
├── three/           buildShoe.js (procedural sneaker), shoeRenderer.js (photo studio)
├── styles/          index.css (design tokens & utilities)
└── utils/
```

## Adding a product

Append an entry to `src/data/products.js` (`id`, `name`, `category`, `price`, `style`, `colors`, `sizes`, …).
The `style` (`runner`, `court`, `street`, `trainer`) selects the 3D silhouette; product images are generated automatically
for each colourway. To use real photos, put image URLs in `images`.

## Notes

- Payments and authentication are mocked — no data leaves the browser. "Continue with Google" is a visual placeholder.
- Three.js is code-split and only downloads when a 3D scene or product image is needed; WebGL scenes pause when off-screen.
