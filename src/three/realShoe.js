import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { SHOE_LENGTH } from './buildShoe'

/**
 * Photoscanned sneaker (public/models/shoe.glb — "Materials Variants Shoe" by Shopify, CC BY 4.0).
 *
 * The scan has a single textured material. A small shader patch splits its base-colour texture into
 * four zones by colour and recolours each one while keeping the real knit, stitching and foam detail:
 *   bright knit → main · bright foam → sole · dark grey (laces + lining) → lace ·
 *   dark saturated side stripes + near-black heel tab → accent
 */

export const REAL_SHOE_URL = '/models/shoe.glb'

// Set to true if a replacement model points its toe towards -X.
const FLIP_TOE = false

let templatePromise = null

function normalize(scene) {
  scene.updateMatrixWorld(true)
  let mesh = null
  scene.traverse((o) => {
    if (o.isMesh && !mesh) mesh = o
  })
  if (!mesh) throw new Error('No mesh in model')
  const geometry = mesh.geometry.clone()
  geometry.applyMatrix4(mesh.matrixWorld)
  geometry.computeBoundingBox()
  const size = geometry.boundingBox.getSize(new THREE.Vector3())
  if (size.z > size.x) geometry.rotateY(Math.PI / 2)
  if (FLIP_TOE) geometry.rotateY(Math.PI)
  geometry.computeBoundingBox()
  const s = SHOE_LENGTH / Math.max(size.x, size.z)
  geometry.scale(s, s, s)
  geometry.computeBoundingBox()
  const box = geometry.boundingBox
  const center = box.getCenter(new THREE.Vector3())
  geometry.translate(-center.x, -box.min.y, -center.z)
  geometry.computeBoundingSphere()
  return { geometry, material: mesh.material }
}

/** Validates the GLB header first so a missing/corrupt file never reaches the loader. */
async function modelIsValid(url) {
  try {
    const r = await fetch(url, { headers: { Range: 'bytes=0-3' } })
    const type = r.headers.get('content-type') ?? ''
    if (!r.ok || type.includes('text/html')) return false
    const head = new Uint8Array(await r.arrayBuffer()).slice(0, 4)
    return String.fromCharCode(...head) === 'glTF'
  } catch {
    return false
  }
}

/** Resolves to the normalised template, or null when the model is unavailable. */
export function loadRealShoe(url = REAL_SHOE_URL) {
  if (!templatePromise) {
    templatePromise = modelIsValid(url)
      .then((ok) => (ok ? new GLTFLoader().loadAsync(url) : null))
      .then((gltf) => (gltf ? normalize(gltf.scene) : null))
      .catch((err) => {
        if (import.meta.env.DEV) console.warn('[STRIDEVOLT] 3D model unavailable, using procedural shoe:', err?.message)
        return null
      })
  }
  return templatePromise
}

const RECOLOR_GLSL = /* glsl */ `
#ifdef USE_MAP
{
  vec3 c = diffuseColor.rgb;
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float sat = mx > 0.0005 ? (mx - mn) / mx : 0.0;
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float wSat = smoothstep(0.32, 0.5, sat);
  float bright = smoothstep(0.03, 0.06, lum);
  float wMain = wSat * bright;              // knit upper
  float wStripe = wSat * (1.0 - bright);    // dark saturated side stripes
  float rest = 1.0 - wSat;
  float wSole = rest * smoothstep(0.1, 0.3, lum);
  float wTab = rest * (1.0 - smoothstep(0.1, 0.3, lum)) * (1.0 - smoothstep(0.007, 0.013, lum));
  float wLace = max(0.0, rest - wSole - wTab); // laces + lining
  vec3 recolored =
      uMain * clamp(lum / 0.16, 0.0, 1.45) * wMain +
      uAccent * clamp(lum / 0.022, 0.0, 1.35) * wStripe +
      uSole * clamp(lum / 0.8, 0.0, 1.15) * wSole +
      uAccent * clamp(lum / 0.0065, 0.0, 1.35) * wTab +
      uLace * clamp(lum / 0.024, 0.0, 1.5) * wLace;
  diffuseColor.rgb = recolored;
}
#endif
`

function makeMaterial(base, colors) {
  const material = base.clone()
  material.metalness = 0.05
  material.roughness = 1
  material.envMapIntensity = 0.9
  const uniforms = {
    uMain: { value: new THREE.Color(colors.main) },
    uSole: { value: new THREE.Color(colors.sole) },
    uAccent: { value: new THREE.Color(colors.accent) },
    uLace: { value: new THREE.Color(colors.lace) },
  }
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uMain;\nuniform vec3 uSole;\nuniform vec3 uAccent;\nuniform vec3 uLace;')
      .replace('#include <map_fragment>', `#include <map_fragment>\n${RECOLOR_GLSL}`)
  }
  material.customProgramCacheKey = () => 'stridevolt-recolor'
  return { material, uniforms }
}

/* ------------------------------------------------------------------ */
/* Shoe types: the scan is reshaped per silhouette                     */
/* ------------------------------------------------------------------ */

// Height (shoe space) where the scanned midsole meets the upper.
const SOLE_TOP = 0.36

/**
 * Silhouette presets.
 *  sole   – midsole stack multiplier · heel – extra stack at the heel (rocker / drop)
 *  spring – toe-spring lift · width / length – footprint scale · collar – heel collar lift
 */
export const SHAPES = {
  sneaker: { sole: 1, heel: 1, spring: 0, width: 1, length: 1, collar: 0 },
  'sneaker-low': { sole: 0.82, heel: 1, spring: 0, width: 1.02, length: 1.01, collar: -0.1 },
  'sneaker-mid': { sole: 1.05, heel: 1.05, spring: 0, width: 1.02, length: 1, collar: 0.62 },
  jogger: { sole: 1.25, heel: 1.4, spring: 0.12, width: 0.96, length: 1.03, collar: 0 },
  'jogger-max': { sole: 1.6, heel: 1.55, spring: 0.2, width: 0.98, length: 1.04, collar: 0.04 },
  comfort: { sole: 1.75, heel: 1.12, spring: 0.06, width: 1.09, length: 1.01, collar: -0.04 },
  'comfort-cloud': { sole: 2.25, heel: 1.08, spring: 0.1, width: 1.14, length: 1.02, collar: 0 },
}

export const shapeKey = (style) => (SHAPES[style] ? style : 'sneaker')

// smooth minimum, so the stretch fades out softly at the midsole/upper seam
const softMin = (a, b, r = 0.05) => -r * Math.log(Math.exp(-a / r) + Math.exp(-b / r))

const shapedCache = new WeakMap()

function shapedGeometry(template, style) {
  const key = shapeKey(style)
  let perTemplate = shapedCache.get(template)
  if (!perTemplate) shapedCache.set(template, (perTemplate = new Map()))
  if (perTemplate.has(key)) return perTemplate.get(key)

  const s = SHAPES[key]
  const geo = template.geometry.clone()
  const pos = geo.attributes.position
  const half = SHOE_LENGTH / 2
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const t = (x + half) / SHOE_LENGTH // 0 heel → 1 toe
    const k = s.sole * (1 + (s.heel - 1) * (1 - t))
    let ny = y + (k - 1) * Math.max(0, softMin(y, SOLE_TOP))
    // heel collar raise/lower (mid-tops and low-cut lifestyle shoes)
    if (s.collar) ny += s.collar * Math.pow(Math.max(0, (y - 0.75) / 1.0), 1.5) * Math.max(0, 1 - t / 0.7)
    // toe spring / rocker
    ny += s.spring * Math.pow(Math.max(0, (t - 0.62) / 0.38), 2)
    pos.setXYZ(i, x * s.length, ny, pos.getZ(i) * s.width)
  }
  geo.computeBoundingBox()
  geo.translate(0, -geo.boundingBox.min.y, 0)
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  perTemplate.set(key, geo)
  return geo
}

/** Same interface as the procedural shoe: { group, setColors, lerpColors, dispose }. */
export function createRealShoe(template, colors, style = 'sneaker') {
  const { material, uniforms } = makeMaterial(template.material, colors)
  const mesh = new THREE.Mesh(shapedGeometry(template, style), material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.name = 'shoe'
  const group = new THREE.Group()
  group.name = 'StridevoltRealShoe'
  group.add(mesh)

  const keys = { main: 'uMain', sole: 'uSole', accent: 'uAccent', lace: 'uLace' }
  return {
    group,
    setColors(next) {
      for (const k in keys) uniforms[keys[k]].value.set(next[k])
    },
    lerpColors(targets, k) {
      for (const key in keys) uniforms[keys[key]].value.lerp(targets[key], k)
    },
    dispose: () => material.dispose(),
  }
}
