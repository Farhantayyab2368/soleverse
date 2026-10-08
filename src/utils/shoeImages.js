// Lazy bridge to the Three.js photo studio so three.js stays out of the initial bundle.
let studioModule = null
let modulePromise = null

// Renders wait until the intro loader has finished, keeping its animation smooth.
let markReady
const appReady = new Promise((resolve) => (markReady = resolve))
export const markAppReady = () => markReady()
// safety net: never block product imagery on the intro animation for long
if (typeof window !== 'undefined') setTimeout(() => markReady(), 6000)

const loadModule = () => {
  if (!modulePromise) {
    modulePromise = import('../three/shoeRenderer').then((m) => (studioModule = m))
  }
  return modulePromise
}

export const loadShoeImage = (opts) => Promise.all([loadModule(), appReady]).then(([m]) => m.renderShoeImage(opts))
export const getCachedShoeImageSafe = (opts) => (studioModule ? studioModule.getCachedShoeImage(opts) : null)
export const preloadStudio = () => loadModule()
// start downloading the 3D model as soon as the intro finishes
appReady.then(() => import('../three/realShoe').then((m) => m.loadRealShoe()))
