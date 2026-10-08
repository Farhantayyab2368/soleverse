/**
 * SOLEVERSE product catalogue — three shoe types: Joggers, Sneakers and Comfort. Prices are in PKR.
 *
 * To add a shoe, append an object below. Fields:
 *  - id: URL slug (/product/:id)
 *  - category: 'Joggers' | 'Sneakers' | 'Comfort'
 *  - style: 3D silhouette — see SHAPES in src/three/realShoe.js
 *      joggers:  'jogger' (rocker + heel stack) · 'jogger-max' (max cushion)
 *      sneakers: 'sneaker' (classic) · 'sneaker-low' (slim cupsole) · 'sneaker-mid' (raised collar)
 *      comfort:  'comfort' (wide platform) · 'comfort-cloud' (extra-thick cloud sole)
 *  - images: gallery views. Strings that start with "/" or "http" are treated as real photos;
 *            otherwise they are studio views rendered from the 3D model.
 *  - colors: colourways. `colors` holds the 3D zone colours (upper, sole, laces & lining, stripes & heel tab).
 */

export const SIZES = [39, 40, 41, 42, 43, 44, 45]

export const CATEGORIES = ['Joggers', 'Sneakers', 'Comfort']

export const GALLERY_VIEWS = ['pair', 'side', 'front', 'back', 'top', 'lifestyle']

const C = {
  ink: '#121316',
  charcoal: '#2a2c32',
  graphite: '#4a4d55',
  bone: '#ededea',
  white: '#fafaf8',
  volt: '#2f6bff',
  ice: '#9cc3ff',
  red: '#e5322d',
  ember: '#ff6a1a',
  green: '#22a565',
  sage: '#8fb39a',
  sand: '#d8c8ad',
  navy: '#1b2a52',
  gum: '#b87a45',
  oat: '#e6dac6',
  cream: '#f1e9d8',
  blush: '#e7b3b6',
  olive: '#6b7a4b',
  mocha: '#7b5b46',
  sky: '#bcd6f5',
}

const cw = (name, family, main, sole, lace, accent, extra = {}) => ({
  name,
  family,
  hex: main,
  colors: { main, sole, lace, accent, ...extra },
})

const base = { images: GALLERY_VIEWS, model: '/models/shoe.glb', sizes: SIZES }

export const products = [
  /* ---------------------------------------------------------------- */
  /* JOGGERS                                                           */
  /* ---------------------------------------------------------------- */
  {
    ...base,
    id: 'aero-x1',
    name: 'Aero X1',
    category: 'Joggers',
    tags: ['Joggers', 'Running'],
    collection: 'joggers',
    style: 'jogger',
    price: 35999,
    tagline: 'Lightweight daily jogger',
    description:
      'Built for everyday movement with lightweight cushioning and a responsive sole designed to keep you moving.',
    details: ['Rocker AeroFoam™ midsole, 10mm drop', 'Engineered knit upper', 'Weight: 238g (EU 42)', 'Recycled polyester laces'],
    colors: [
      cw('Volt Bone', 'White', C.bone, C.white, C.ink, C.volt),
      cw('Phantom', 'Black', C.ink, C.charcoal, C.graphite, C.volt),
      cw('Ember Rush', 'Orange', C.ember, C.white, C.white, C.ink),
    ],
    soldOut: [45],
    rating: 4.9,
    reviews: 1284,
    isNew: true,
    isFeatured: true,
    releaseDate: '2026-09-18',
  },
  {
    ...base,
    id: 'velocity-pro',
    name: 'Velocity Pro',
    category: 'Joggers',
    tags: ['Joggers', 'Running'],
    collection: 'joggers',
    style: 'jogger-max',
    price: 44999,
    tagline: 'Max-cushion long-distance jogger',
    description:
      'Our tallest stack of AeroFoam™ on a rolling rocker sole. Velocity Pro makes long miles feel short and recovery runs feel effortless.',
    details: ['38mm max-cushion stack', 'Rocker geometry for smooth transitions', 'Wide, stable landing zone', 'Reflective heel tab'],
    colors: [
      cw('Midnight Volt', 'Black', C.ink, C.white, C.white, C.volt),
      cw('Solar Red', 'Red', C.red, C.white, C.white, C.ink),
      cw('Arctic', 'White', C.white, C.white, C.bone, C.ice),
    ],
    soldOut: [39],
    rating: 4.8,
    reviews: 842,
    isNew: false,
    isFeatured: true,
    releaseDate: '2026-05-02',
  },
  {
    ...base,
    id: 'nova-runner',
    name: 'Nova Runner',
    category: 'Joggers',
    tags: ['Joggers', 'Running'],
    collection: 'joggers',
    style: 'jogger',
    price: 32999,
    tagline: 'Soft miles, every day',
    description: 'Plush, stable and endlessly comfortable. Nova Runner turns easy jogs and long days into effortless movement.',
    details: ['CloudStep™ foam', 'Breathable mesh upper', 'Weight: 252g (EU 42)', 'Reflective heel detail'],
    colors: [
      cw('Glacier', 'Blue', C.ice, C.white, C.white, C.navy),
      cw('Stealth', 'Grey', C.graphite, C.ink, C.ink, C.ice),
      cw('Sage Run', 'Green', C.sage, C.white, C.white, C.ink),
    ],
    soldOut: [],
    rating: 4.7,
    reviews: 2210,
    isNew: false,
    isFeatured: false,
    releaseDate: '2026-02-11',
  },
  {
    ...base,
    id: 'stratus-glide',
    name: 'Stratus Glide',
    category: 'Joggers',
    tags: ['Joggers', 'Running'],
    collection: 'joggers',
    style: 'jogger-max',
    price: 41999,
    tagline: 'Race-day propulsion',
    description: 'A carbon-infused plate meets our most energetic foam yet. Stratus Glide is engineered for personal bests.',
    details: ['Carbon-infused propulsion plate', 'Supercritical AeroFoam™', 'Weight: 205g (EU 42)', 'Race-fit monomesh upper'],
    colors: [
      cw('Electric', 'Blue', C.volt, C.white, C.white, C.ink),
      cw('Solar', 'Orange', C.ember, C.bone, C.ink, C.volt),
    ],
    soldOut: [44],
    rating: 4.9,
    reviews: 412,
    isNew: true,
    isFeatured: false,
    releaseDate: '2026-09-30',
  },
  {
    ...base,
    id: 'pulse-tempo',
    name: 'Pulse Tempo',
    category: 'Joggers',
    tags: ['Joggers', 'Running'],
    collection: 'joggers',
    style: 'jogger',
    price: 29999,
    tagline: 'Speed sessions, sorted',
    description: 'Snappy and light for intervals and tempo days, with just enough cushioning for the miles in between.',
    details: ['Responsive EVA blend', 'Lightweight mesh', 'Weight: 228g (EU 42)', 'Rubberised forefoot pods'],
    colors: [
      cw('Crimson', 'Red', C.red, C.ink, C.ink, C.white),
      cw('Volt Ink', 'Black', C.charcoal, C.white, C.white, C.volt),
    ],
    soldOut: [],
    rating: 4.6,
    reviews: 689,
    isNew: false,
    isFeatured: false,
    releaseDate: '2025-11-05',
  },

  /* ---------------------------------------------------------------- */
  /* SNEAKERS                                                          */
  /* ---------------------------------------------------------------- */
  {
    ...base,
    id: 'eclipse-street',
    name: 'Eclipse Street',
    category: 'Sneakers',
    tags: ['Sneakers', 'Lifestyle'],
    collection: 'sneakers',
    style: 'sneaker',
    price: 38999,
    tagline: 'Built for the city',
    description:
      'Clean lines, premium materials and a cushioned sole made for all-day wear. Eclipse Street moves from studio to street without missing a beat.',
    details: ['Premium knit with fused overlays', 'Cushioned everyday midsole', 'OrthoLite® insole', 'Tonal branding'],
    colors: [
      cw('Eclipse Black', 'Black', C.ink, C.white, C.ink, C.graphite),
      cw('Triple White', 'White', C.white, C.white, C.white, C.bone),
      cw('Navy Gum', 'Blue', C.navy, C.sand, C.white, C.white, { outsole: C.gum }),
    ],
    soldOut: [40],
    rating: 4.8,
    reviews: 1530,
    isNew: false,
    isFeatured: true,
    releaseDate: '2026-04-20',
  },
  {
    ...base,
    id: 'orbit-low',
    name: 'Orbit Low',
    category: 'Sneakers',
    tags: ['Sneakers', 'Lifestyle'],
    collection: 'sneakers',
    style: 'sneaker-low',
    price: 27999,
    tagline: 'Slim everyday essential',
    description: 'A slim, low-profile sneaker that goes with everything. Lightweight, comfortable and ready for daily rotation.',
    details: ['Low-profile cupsole', 'Soft textile lining', 'Removable insole', 'Tonal stitching'],
    colors: [
      cw('Sand Dune', 'Beige', C.sand, C.white, C.white, C.bone),
      cw('Volt Pop', 'White', C.white, C.white, C.white, C.volt),
      cw('Moss', 'Green', C.sage, C.bone, C.white, C.green),
    ],
    soldOut: [41],
    rating: 4.6,
    reviews: 318,
    isNew: true,
    isFeatured: false,
    releaseDate: '2026-09-10',
  },
  {
    ...base,
    id: 'lumen-89',
    name: 'Lumen 89',
    category: 'Sneakers',
    tags: ['Sneakers', 'Lifestyle'],
    collection: 'sneakers',
    style: 'sneaker-mid',
    price: 35999,
    tagline: 'Retro mid-top icon',
    description: 'Inspired by late-80s courts and rebuilt for today, Lumen 89 pairs a raised mid-top collar with modern comfort.',
    details: ['Raised mid-top collar', 'Retro-inspired midsole', 'Reflective accents', 'Padded ankle lining'],
    colors: [
      cw('Ember', 'White', C.bone, C.white, C.white, C.ember),
      cw('Night Shift', 'Black', C.charcoal, C.graphite, C.white, C.ice),
    ],
    soldOut: [],
    rating: 4.7,
    reviews: 744,
    isNew: false,
    isFeatured: false,
    releaseDate: '2026-03-15',
  },
  {
    ...base,
    id: 'drift-classic',
    name: 'Drift Classic',
    category: 'Sneakers',
    tags: ['Sneakers', 'Lifestyle'],
    collection: 'sneakers',
    style: 'sneaker-low',
    price: 29999,
    tagline: 'Minimal by design',
    description: 'Stripped back to the essentials. Drift Classic is the clean sneaker that anchors every outfit.',
    details: ['Minimal premium upper', 'Stitched cupsole', 'Cushioned footbed', 'Recycled rubber outsole'],
    colors: [
      cw('Chalk Gum', 'White', C.white, C.sand, C.white, C.sand, { outsole: C.gum }),
      cw('Graphite', 'Grey', C.graphite, C.white, C.white, C.graphite),
    ],
    soldOut: [],
    rating: 4.5,
    reviews: 1102,
    isNew: false,
    isFeatured: false,
    releaseDate: '2025-08-21',
  },
  {
    ...base,
    id: 'apex-court',
    name: 'Apex Court',
    category: 'Sneakers',
    tags: ['Sneakers', 'Lifestyle'],
    collection: 'sneakers',
    style: 'sneaker-mid',
    price: 32999,
    tagline: 'Court style, street comfort',
    description: 'A court-inspired mid-top with a supportive collar and grippy outsole — made for weekends, not just the hardwood.',
    details: ['Supportive mid-top collar', 'Herringbone-inspired outsole', 'Cushioned footbed', 'Contrast heel tab'],
    colors: [
      cw('Blackout', 'Black', C.ink, C.ink, C.ink, C.red),
      cw('Royal', 'Blue', C.volt, C.white, C.white, C.white),
    ],
    soldOut: [45],
    rating: 4.8,
    reviews: 238,
    isNew: true,
    isFeatured: false,
    releaseDate: '2026-09-25',
  },

  /* ---------------------------------------------------------------- */
  /* COMFORT                                                           */
  /* ---------------------------------------------------------------- */
  {
    ...base,
    id: 'cloud-haven',
    name: 'Cloud Haven',
    category: 'Comfort',
    tags: ['Comfort', 'Walking'],
    collection: 'comfort',
    style: 'comfort-cloud',
    price: 41999,
    tagline: 'Walk on clouds all day',
    description:
      'Our thickest, softest foam on a wide, stable platform. Cloud Haven is made for long shifts, long walks and long days on your feet.',
    details: ['45mm CloudStep™ platform', 'Extra-wide stable base', 'Memory-foam sockliner', 'Slip-resistant outsole'],
    colors: [
      cw('Oat Milk', 'Beige', C.oat, C.cream, C.cream, C.sand),
      cw('Slate', 'Grey', C.graphite, C.bone, C.bone, C.ink),
      cw('Sky', 'Blue', C.sky, C.white, C.white, C.navy),
    ],
    soldOut: [],
    rating: 4.9,
    reviews: 1876,
    isNew: true,
    isFeatured: true,
    releaseDate: '2026-09-22',
  },
  {
    ...base,
    id: 'haven-walk',
    name: 'Haven Walk',
    category: 'Comfort',
    tags: ['Comfort', 'Walking'],
    collection: 'comfort',
    style: 'comfort',
    price: 32999,
    tagline: 'Everyday cushioned walker',
    description: 'A supportive, cushioned walking shoe with a wide toe box and a natural-feel gum outsole.',
    details: ['Wide toe box', 'Cushioned platform midsole', 'Arch-support insole', 'Natural gum outsole'],
    colors: [
      cw('Bone Gum', 'White', C.bone, C.sand, C.white, C.gum, { outsole: C.gum }),
      cw('Charcoal', 'Black', C.charcoal, C.graphite, C.graphite, C.bone),
    ],
    soldOut: [39],
    rating: 4.7,
    reviews: 964,
    isNew: false,
    isFeatured: false,
    releaseDate: '2026-03-08',
  },
  {
    ...base,
    id: 'rest-day',
    name: 'Rest Day',
    category: 'Comfort',
    tags: ['Comfort', 'Recovery'],
    collection: 'comfort',
    style: 'comfort-cloud',
    price: 27999,
    tagline: 'Recovery comfort',
    description: 'Ultra-soft recovery shoe for the days between workouts. Slip in, lace loose and let your feet reset.',
    details: ['Recovery-grade soft foam', 'Stretch-knit upper', 'Easy pull-on heel loop', 'Rocker sole'],
    colors: [
      cw('Sage', 'Green', C.sage, C.cream, C.cream, C.olive),
      cw('Blush', 'Pink', C.blush, C.white, C.white, C.mocha),
    ],
    soldOut: [],
    rating: 4.8,
    reviews: 532,
    isNew: false,
    isFeatured: false,
    releaseDate: '2026-06-14',
  },
  {
    ...base,
    id: 'terra-comfort',
    name: 'Terra Comfort',
    category: 'Comfort',
    tags: ['Comfort', 'Walking'],
    collection: 'comfort',
    style: 'comfort',
    price: 35999,
    tagline: 'Earth-toned all-day comfort',
    description: 'Wide, grounded and cushioned, in earthy colourways that pair with everything from trails to town.',
    details: ['Wide platform base', 'Water-repellent knit', 'Cushioned heel cup', 'Grippy lugged outsole'],
    colors: [
      cw('Olive', 'Green', C.olive, C.sand, C.cream, C.mocha, { outsole: C.mocha }),
      cw('Mocha', 'Brown', C.mocha, C.cream, C.cream, C.ink),
    ],
    soldOut: [44],
    rating: 4.6,
    reviews: 287,
    isNew: false,
    isFeatured: false,
    releaseDate: '2026-01-30',
  },
  {
    ...base,
    id: 'drift-lounge',
    name: 'Drift Lounge',
    category: 'Comfort',
    tags: ['Comfort', 'Recovery'],
    collection: 'comfort',
    style: 'comfort-cloud',
    price: 29999,
    tagline: 'Weekend lounge shoe',
    description: 'Pillowy, light and ready for slow mornings and long weekends. Drift Lounge is comfort you can wear anywhere.',
    details: ['Pillow-soft cloud sole', 'Brushed knit lining', 'Lightweight build', 'Machine-washable insole'],
    colors: [
      cw('Cream', 'White', C.cream, C.white, C.white, C.oat),
      cw('Deep Navy', 'Blue', C.navy, C.cream, C.cream, C.sky),
    ],
    soldOut: [],
    rating: 4.7,
    reviews: 411,
    isNew: true,
    isFeatured: false,
    releaseDate: '2026-09-28',
  },
]

export const COLOR_FAMILIES = [
  { name: 'Black', hex: '#121316' },
  { name: 'White', hex: '#fafaf8' },
  { name: 'Grey', hex: '#7c7f87' },
  { name: 'Blue', hex: '#2f6bff' },
  { name: 'Red', hex: '#e5322d' },
  { name: 'Green', hex: '#22a565' },
  { name: 'Orange', hex: '#ff6a1a' },
  { name: 'Beige', hex: '#d8c8ad' },
  { name: 'Pink', hex: '#e7b3b6' },
  { name: 'Brown', hex: '#7b5b46' },
]

export const getProduct = (id) => products.find((p) => p.id === id)
export const featuredProducts = products.filter((p) => p.isFeatured)
export const newArrivals = products.filter((p) => p.isNew)
export const MAX_PRICE = Math.max(...products.map((p) => p.price))
export const MIN_PRICE = Math.min(...products.map((p) => p.price))

export function getRelated(product, count = 4) {
  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category) || b.rating - a.rating)
    .slice(0, count)
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return products.filter((p) =>
    [p.name, p.category, p.tagline, ...p.tags, ...p.colors.map((c) => c.name), ...p.colors.map((c) => c.family)]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}
