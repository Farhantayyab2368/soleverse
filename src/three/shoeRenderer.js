import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { SHOE_LENGTH } from './buildShoe'
import { loadRealShoe } from './realShoe'
import { createPair, makeShoe } from './shoeFactory'

/**
 * Off-screen "product photography" studio.
 * A single shared WebGL renderer turns the 3D sneaker (photoscan, or procedural fallback) into
 * transparent product shots — single shoes and left/right pairs — for every colourway and angle.
 * Results are cached as object URLs.
 */

const WIDTH = 1000
const HEIGHT = 800
// output resolutions: thumbnails, cards, hero imagery
const SIZES = { sm: 0.46, md: 0.74, lg: 1 }

export const VIEWS = {
  pair: { pos: [0.5, 2.7, 7.4], look: [-0.05, 0.5, 0], pair: true },
  pairAngle: { pos: [5.0, 3.0, 5.9], look: [0, 0.5, 0], pair: true },
  lifestyle: { pos: [2.4, 4.6, 8.2], look: [0.2, 0.4, 0], pair: true },
  side: { pos: [0.2, 1.2, 7.3], look: [0, 0.7, 0] },
  angle: { pos: [4.4, 2.4, 5.4], look: [0.05, 0.62, 0] },
  front: { pos: [6.2, 1.7, 1.6], look: [0, 0.66, 0] },
  back: { pos: [-6.0, 2.0, -1.8], look: [0, 0.74, 0] },
  top: { pos: [0, 8.2, 0.001], look: [0, 0, 0], up: [0, 0, -1] },
}

let studio = null
const cache = new Map()
const pending = new Map()
let queue = Promise.resolve()

function createStudio() {
  const canvas = document.createElement('canvas')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1)
  renderer.setSize(WIDTH, HEIGHT, false)
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.55
  pmrem.dispose()

  const key = new THREE.DirectionalLight(0xffffff, 2.1)
  key.position.set(4, 7, 5)
  const fill = new THREE.DirectionalLight(0xdfe7ff, 0.6)
  fill.position.set(-5, 3, 4)
  const rim = new THREE.DirectionalLight(0xffffff, 1.2)
  rim.position.set(-3, 4, -6)
  scene.add(key, fill, rim, new THREE.AmbientLight(0xffffff, 0.25))

  // Soft blob shadow
  const sc = document.createElement('canvas')
  sc.width = sc.height = 256
  const sctx = sc.getContext('2d')
  const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(0,0,0,0.55)')
  grad.addColorStop(0.45, 'rgba(0,0,0,0.25)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  sctx.fillStyle = grad
  sctx.fillRect(0, 0, 256, 256)
  const shadowTex = new THREE.CanvasTexture(sc)
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.85 }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.scale.set(SHOE_LENGTH * 1.25, 1.5, 1)
  shadow.position.y = 0.002
  scene.add(shadow)

  const camera = new THREE.PerspectiveCamera(26, WIDTH / HEIGHT, 0.1, 60)
  const shoes = {}
  return { renderer, scene, camera, shoes, canvas, shadow }
}

function canRender() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const webglSupported = typeof document !== 'undefined' && canRender()

async function renderNow({ style, colors, view, size = 'lg' }) {
  const template = await loadRealShoe()
  if (!studio) studio = createStudio()
  const { renderer, scene, camera, shoes, canvas, shadow } = studio

  const v = VIEWS[view] ?? VIEWS.side
  // the photoscan has one silhouette, so every style shares it; the procedural fallback varies per style
  const subjectKey = `${template ? 'real' : style}|${v.pair ? 'pair' : 'single'}`
  Object.values(shoes).forEach((s) => (s.group.visible = false))
  if (!shoes[subjectKey]) {
    shoes[subjectKey] = v.pair ? createPair(template, style, colors) : makeShoe(template, style, colors)
    scene.add(shoes[subjectKey].group)
  }
  const shoe = shoes[subjectKey]
  shoe.group.visible = true
  shoe.setColors(colors)

  const pull = style === 'court' && !template ? 1.14 : 1
  camera.up.set(...(v.up ?? [0, 1, 0]))
  camera.position.set(v.pos[0] * pull, v.pos[1] * pull + (pull - 1) * 2, v.pos[2] * pull)
  camera.lookAt(...v.look)
  camera.updateProjectionMatrix()
  shadow.visible = view !== 'top'
  shadow.scale.set(SHOE_LENGTH * (v.pair ? 1.45 : 1.25), v.pair ? 3.2 : 1.5, 1)

  const f = SIZES[size] ?? 1
  renderer.setSize(Math.round(WIDTH * f), Math.round(HEIGHT * f), false)
  renderer.render(scene, camera)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('Snapshot failed'))),
      'image/webp',
      0.92,
    )
  })
}

const idle = () =>
  new Promise((r) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(() => r(), { timeout: 120 }) : setTimeout(r, 16)))

/** Returns a promise for an object URL of the rendered product shot. */
export function renderShoeImage({ style = 'runner', colors, view = 'side', size = 'lg' }) {
  const key = `${style}|${colors.main}|${colors.sole}|${colors.lace}|${colors.accent}|${view}|${size}`
  if (cache.has(key)) return Promise.resolve(cache.get(key))
  if (pending.has(key)) return pending.get(key)
  if (!webglSupported) return Promise.reject(new Error('WebGL unavailable'))

  const job = (queue = queue
    .catch(() => {})
    .then(idle)
    .then(() => renderNow({ style, colors, view, size }))
    .then((url) => {
      cache.set(key, url)
      pending.delete(key)
      return url
    })
    .catch((err) => {
      pending.delete(key)
      throw err
    }))
  pending.set(key, job)
  return job
}

export function getCachedShoeImage({ style = 'runner', colors, view = 'side', size = 'lg' }) {
  return cache.get(`${style}|${colors.main}|${colors.sole}|${colors.lace}|${colors.accent}|${view}|${size}`) ?? null
}
