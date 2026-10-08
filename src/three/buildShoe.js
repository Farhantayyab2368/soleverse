import * as THREE from 'three'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js'

/**
 * Procedural SOLEVERSE sneaker.
 * Plain Three.js so it can be used both inside React Three Fiber (<primitive />)
 * and by the off-screen product-photo renderer.
 *
 * Coordinate system: toe points +X, lateral side faces +Z, ground at y = 0.
 */

export const SHOE_LENGTH = 3.4
const HALF = SHOE_LENGTH / 2
const N = 2.6 // super-ellipse exponent for the upper cross-section

export const SHOE_STYLES = {
  // soleHeight = mid-foot stack, taper = heel-to-toe stack difference (fraction)
  runner: { soleHeight: 0.3, taper: 0.55, toeSpring: 0.32, heelTop: 1.12, width: 0.5, toeHeight: 0.42, stripe: 'swoop', outsole: 0.06 },
  court: { soleHeight: 0.3, taper: 0.2, toeSpring: 0.16, heelTop: 1.55, width: 0.56, toeHeight: 0.5, stripe: 'panel', outsole: 0.07 },
  street: { soleHeight: 0.26, taper: 0.08, toeSpring: 0.14, heelTop: 0.98, width: 0.55, toeHeight: 0.5, stripe: 'swoop', outsole: 0.06 },
  trainer: { soleHeight: 0.28, taper: 0.25, toeSpring: 0.18, heelTop: 1.1, width: 0.54, toeHeight: 0.46, stripe: 'double', outsole: 0.07 },
}

/** Smooth piecewise interpolation through [u, value] key points. */
function keyCurve(points) {
  return (u) => {
    if (u <= points[0][0]) return points[0][1]
    for (let i = 1; i < points.length; i++) {
      const [u1, v1] = points[i]
      const [u0, v0] = points[i - 1]
      if (u <= u1) {
        const t = (u - u0) / (u1 - u0)
        const s = t * t * (3 - 2 * t)
        return v0 + (v1 - v0) * s
      }
    }
    return points[points.length - 1][1]
  }
}

const sinCap = (t, p) => Math.pow(Math.sin(Math.min(1, Math.max(0, t)) * Math.PI * 0.5), p)

function makeProfile(styleKey) {
  const s = SHOE_STYLES[styleKey] ?? SHOE_STYLES.runner
  const W = s.width
  const ht = s.heelTop
  const th = s.toeHeight

  const width = keyCurve([[0, W * 0.8], [0.25, W * 0.86], [0.48, W * 0.8], [0.7, W], [0.86, W * 0.94], [1, W * 0.6]])
  const top = keyCurve([
    [0, ht * 0.9], [0.1, ht], [0.3, ht * 0.97], [0.42, Math.max(ht * 0.78, 0.86)],
    [0.62, th + 0.3], [0.8, th + 0.08], [0.93, th * 0.82], [1, th * 0.5],
  ])
  const capHeel = (u) => sinCap(u / 0.07, 0.55)
  const capToe = (u) => sinCap((1 - u) / 0.16, 0.6)

  const tOf = (x) => (x + HALF) / SHOE_LENGTH
  // midsole stack height at x (thicker heel, thinner forefoot)
  const thick = (x) => s.soleHeight * (1 + s.taper * (0.5 - tOf(x)))
  const spring = (x) => s.toeSpring * Math.pow(Math.max(0, (tOf(x) - 0.62) / 0.38), 2.2)
  const soleTop = (x) => s.outsole + thick(x) + spring(x)
  const xOf = (u) => -HALF + 0.07 + u * (SHOE_LENGTH - 0.14)

  // collar opening (ellipse in (u, angle) space)
  const collar = { uc: 0.2, hu: 0.135, ha: 0.62, depth: 0.32 }

  /** Point on the upper surface. ang: 0 = lateral mid, PI/2 = top, PI = medial mid. */
  const surface = (u, ang, target = new THREE.Vector3(), withDip = true) => {
    const x = xOf(u)
    const w = width(u) * capHeel(u) * capToe(u)
    const h = top(u) * (0.22 + 0.78 * capToe(u))
    const c = Math.cos(ang)
    const sn = Math.sin(ang)
    const z = w * Math.sign(c) * Math.pow(Math.abs(c), 2 / N)
    let y = h / 2 + (h / 2) * Math.sign(sn) * Math.pow(Math.abs(sn), 2 / N)
    if (withDip && sn > 0) {
      const da = Math.atan2(sn, c) - Math.PI / 2
      const m = 1 - ((u - collar.uc) / collar.hu) ** 2 - (da / collar.ha) ** 2
      if (m > 0) y -= collar.depth * Math.sqrt(m)
    }
    return target.set(x, y + soleTop(x) - 0.06, z)
  }

  const isLining = (u, ang) => {
    const sn = Math.sin(ang)
    if (sn <= 0) return false
    const da = Math.atan2(sn, Math.cos(ang)) - Math.PI / 2
    return 1 - ((u - collar.uc) / collar.hu) ** 2 - (da / collar.ha) ** 2 > 0.015
  }

  return { s, width, top, xOf, soleTop, thick, spring, surface, isLining, collar, tOf }
}

/* ------------------------------------------------------------------ */
/* Shared textures                                                     */
/* ------------------------------------------------------------------ */

let knitTexture = null
function getKnitTexture() {
  if (knitTexture || typeof document === 'undefined') return knitTexture
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)
  const step = 16
  for (let row = 0; row <= size / step; row++) {
    for (let col = 0; col <= size / step; col++) {
      const cx = col * step + (row % 2 ? step / 2 : 0)
      const cy = row * step
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, step * 0.55)
      g.addColorStop(0, '#2a2a2a')
      g.addColorStop(0.6, '#5a5a5a')
      g.addColorStop(1, '#a0a0a0')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(cx, cy, step * 0.42, step * 0.34, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  knitTexture = new THREE.CanvasTexture(canvas)
  knitTexture.wrapS = knitTexture.wrapT = THREE.RepeatWrapping
  knitTexture.repeat.set(30, 9)
  knitTexture.anisotropy = 4
  return knitTexture
}

/* ------------------------------------------------------------------ */
/* Geometry builders                                                   */
/* ------------------------------------------------------------------ */

function buildUpper(p) {
  const geo = new ParametricGeometry((u, v, target) => p.surface(u, v * Math.PI * 2, target), 150, 64)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i)
    const ang = uv.getY(i) * Math.PI * 2
    const k = p.isLining(u, ang) ? 0.05 : 1
    colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = k
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geo
}

function footprintShape(p, inset = 0) {
  const shape = new THREE.Shape()
  const steps = 90
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const u = i / steps
    const ws = (p.width(u) + 0.07 - inset) * sinCap(u / 0.09, 0.5) * sinCap((1 - u) / 0.13, 0.5)
    pts.push([-HALF + inset + u * (SHOE_LENGTH - inset * 2), ws])
  }
  pts.forEach(([x, z], i) => (i === 0 ? shape.moveTo(x, z) : shape.lineTo(x, z)))
  for (let i = pts.length - 1; i >= 0; i--) shape.lineTo(pts[i][0], -pts[i][1])
  return shape
}

function buildSoleLayer(p, { inset, height, bottom, stack, bevel }) {
  const geo = new THREE.ExtrudeGeometry(footprintShape(p, inset), {
    depth: Math.max(0.01, height - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.9,
    bevelSegments: 5,
    curveSegments: 4,
  })
  geo.rotateX(Math.PI / 2)
  geo.computeBoundingBox()
  const { min, max } = geo.boundingBox
  geo.translate(0, bottom - min.y, 0)
  const h = max.y - min.y
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const frac = (pos.getY(i) - bottom) / h
    const y = stack ? bottom + frac * h * (p.thick(x) / p.s.soleHeight) : pos.getY(i)
    pos.setY(i, y + p.spring(x))
  }
  geo.computeBoundingBox()
  return geo
}

/** Thin ribbon that hugs the upper surface between two angle curves. */
function buildRibbon(p, { u0, u1, angA, angB, offset = 0.014, steps = 60 }) {
  const positions = []
  const indices = []
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const n = new THREE.Vector3()
  const du = new THREE.Vector3()
  const dv = new THREE.Vector3()
  const tmp = new THREE.Vector3()
  const normalAt = (u, ang, out) => {
    p.surface(u, ang, tmp, false)
    p.surface(Math.min(1, u + 0.002), ang, du, false).sub(tmp)
    p.surface(u, ang + 0.002, dv, false).sub(tmp)
    return out.crossVectors(du, dv).normalize()
  }
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = u0 + (u1 - u0) * t
    const aa = angA(t)
    const bb = angB(t)
    p.surface(u, aa, a, false).add(normalAt(u, aa, n).multiplyScalar(offset))
    p.surface(u, bb, b, false).add(normalAt(u, bb, n).multiplyScalar(offset))
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    if (i < steps) {
      const k = i * 2
      indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

function buildTubeOnSurface(p, pointsFn, { steps = 40, radius = 0.03, offset = 0.03, closed = false, radial = 8 } = {}) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const [u, ang] = pointsFn(i / steps)
    const pt = p.surface(u, ang, new THREE.Vector3(), false)
    pt.y += offset
    pts.push(pt)
  }
  const curve = new THREE.CatmullRomCurve3(pts, closed, 'centripetal')
  return new THREE.TubeGeometry(curve, steps * 2, radius, radial, closed)
}

function mergeGeometries(geos) {
  // Minimal merge for non-indexed/indexed mix: convert all to non-indexed
  const parts = geos.map((g) => (g.index ? g.toNonIndexed() : g))
  let total = 0
  parts.forEach((g) => (total += g.attributes.position.count))
  const pos = new Float32Array(total * 3)
  const nor = new Float32Array(total * 3)
  let off = 0
  parts.forEach((g) => {
    pos.set(g.attributes.position.array, off * 3)
    nor.set(g.attributes.normal.array, off * 3)
    off += g.attributes.position.count
  })
  const merged = new THREE.BufferGeometry()
  merged.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  merged.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  geos.forEach((g) => g.dispose())
  parts.forEach((g) => g.dispose())
  return merged
}

const geometryCache = new Map()

function getGeometries(styleKey) {
  if (geometryCache.has(styleKey)) return geometryCache.get(styleKey)
  const p = makeProfile(styleKey)
  const s = p.s
  const HALF_PI = Math.PI / 2

  const upper = buildUpper(p)

  const midsole = buildSoleLayer(p, { inset: 0, height: s.soleHeight, bottom: s.outsole - 0.01, stack: true, bevel: 0.07 })
  const outsole = buildSoleLayer(p, { inset: 0.02, height: s.outsole + 0.02, bottom: 0, stack: false, bevel: 0.025 })

  // Laces: arcs across the instep
  const laceGeos = []
  const laceCount = s.heelTop > 1.3 ? 7 : 6
  const uStart = s.heelTop > 1.3 ? 0.36 : 0.4
  for (let i = 0; i < laceCount; i++) {
    const uc = uStart + i * 0.056
    const dir = i % 2 ? 1 : -1
    laceGeos.push(
      buildTubeOnSurface(
        p,
        (t) => [uc + dir * (t - 0.5) * 0.035, HALF_PI - 0.62 + t * 1.24],
        { steps: 16, radius: 0.026, offset: 0.016, radial: 6 },
      ),
    )
  }
  const laces = mergeGeometries(laceGeos)

  // Accent pieces: eyelet stays, side stripes, heel tab, collar
  const accentGeos = []
  const eyeU0 = uStart - 0.03
  const eyeU1 = uStart + laceCount * 0.056 - 0.01
  for (const side of [1, -1]) {
    const mirror = (ang) => (side === 1 ? ang : Math.PI - ang)
    accentGeos.push(
      buildRibbon(p, {
        u0: eyeU0, u1: eyeU1,
        angA: () => mirror(HALF_PI - 0.58),
        angB: () => mirror(HALF_PI - 0.86),
        steps: 30,
      }),
    )
    if (s.stripe === 'swoop' || s.stripe === 'double') {
      // sweeping speed stripe: low at the heel, rising into the eyelet stay
      const center = (t) => -0.48 + 1.0 * t
      const half = (t) => 0.12 * Math.pow(Math.sin(Math.PI * t), 0.6) + 0.01
      accentGeos.push(
        buildRibbon(p, {
          u0: 0.08, u1: 0.62,
          angA: (t) => mirror(center(t) + half(t)),
          angB: (t) => mirror(center(t) - half(t)),
          steps: 70,
        }),
      )
    }
    if (s.stripe === 'double') {
      accentGeos.push(
        buildRibbon(p, {
          u0: 0.16, u1: 0.62,
          angA: (t) => mirror(1.0 - 0.9 * t),
          angB: (t) => mirror(0.92 - 0.9 * t),
          steps: 40,
        }),
      )
    }
    if (s.stripe === 'panel') {
      accentGeos.push(
        buildRibbon(p, {
          u0: 0.05, u1: 0.42,
          angA: (t) => mirror(1.0 - 0.15 * t),
          angB: (t) => mirror(-0.55 + 0.25 * t),
          steps: 40,
        }),
      )
      accentGeos.push(
        buildRibbon(p, {
          u0: 0.62, u1: 0.9,
          angA: (t) => mirror(0.35 - 0.1 * t),
          angB: (t) => mirror(-0.7),
          steps: 30,
        }),
      )
    }
  }

  // Padded collar rim
  const { uc, hu, ha } = p.collar
  const collarRim = buildTubeOnSurface(
    p,
    (t) => {
      const th = t * Math.PI * 2
      return [uc + hu * Math.cos(th), HALF_PI + ha * Math.sin(th)]
    },
    { steps: 48, radius: 0.055, offset: -0.01, closed: true, radial: 10 },
  )
  accentGeos.push(collarRim)

  // Heel pull tab
  const tab = new THREE.BoxGeometry(0.07, 0.34, 0.2, 1, 1, 1)
  const heelTopPoint = p.surface(0.015, HALF_PI, new THREE.Vector3(), false)
  tab.rotateZ(0.18)
  tab.translate(heelTopPoint.x - 0.06, heelTopPoint.y - 0.05, 0)
  accentGeos.push(tab)

  const accent = mergeGeometries(accentGeos)

  // Smooth mudguard overlay wrapping the lower upper and toe
  const guardGeos = []
  for (const side of [1, -1]) {
    const mirror = (ang) => (side === 1 ? ang : Math.PI - ang)
    const rise = (t) => 0.32 * Math.pow(Math.max(0, (t - 0.68) / 0.32), 1.6)
    guardGeos.push(
      buildRibbon(p, {
        u0: 0.015, u1: 0.995,
        angA: (t) => mirror(-0.5 + rise(t)),
        angB: () => mirror(-1.2),
        offset: 0.008,
        steps: 90,
      }),
    )
  }
  const overlay = mergeGeometries(guardGeos)

  // Tongue
  const tongue = new THREE.CapsuleGeometry(0.2, 0.16, 6, 14)
  tongue.scale(0.32, 0.62, 1.15)
  tongue.rotateZ(0.75)
  const tonguePoint = p.surface(uc + hu + 0.01, HALF_PI, new THREE.Vector3(), false)
  tongue.translate(tonguePoint.x - 0.04, tonguePoint.y - 0.02, 0)

  const geos = { upper, midsole, outsole, laces, accent, tongue, overlay }
  geometryCache.set(styleKey, geos)
  return geos
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export const DEFAULT_COLORS = { main: '#ededea', sole: '#ffffff', lace: '#16171b', accent: '#2f6bff' }

export function outsoleFor(soleHex) {
  const c = new THREE.Color(soleHex)
  const hsl = {}
  c.getHSL(hsl)
  return hsl.l > 0.5 ? '#1c1d21' : '#2e3036'
}

/**
 * Creates a new sneaker group with its own materials (geometry is shared per style).
 * Returns { group, materials, setColors(colors, instant), dispose }.
 */
export function createShoe(styleKey = 'runner', colors = DEFAULT_COLORS) {
  const g = getGeometries(styleKey)
  const knit = getKnitTexture()

  const materials = {
    main: new THREE.MeshPhysicalMaterial({
      color: colors.main,
      roughness: 0.78,
      metalness: 0,
      sheen: 0.18,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color('#ffffff'),
      vertexColors: true,
      bumpMap: knit,
      bumpScale: 0.8,
    }),
    tongue: new THREE.MeshPhysicalMaterial({ color: colors.main, roughness: 0.8, sheen: 0.12, sheenColor: new THREE.Color('#ffffff') }),
    overlay: new THREE.MeshPhysicalMaterial({ color: colors.main, roughness: 0.42, clearcoat: 0.2, side: THREE.DoubleSide }),
    sole: new THREE.MeshPhysicalMaterial({ color: colors.sole, roughness: 0.45, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
    outsole: new THREE.MeshStandardMaterial({ color: colors.outsole ?? outsoleFor(colors.sole), roughness: 0.9 }),
    lace: new THREE.MeshStandardMaterial({ color: colors.lace, roughness: 0.65 }),
    accent: new THREE.MeshPhysicalMaterial({
      color: colors.accent,
      roughness: 0.5,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
      side: THREE.DoubleSide,
    }),
  }

  const group = new THREE.Group()
  group.name = 'SoleverseShoe'
  const add = (geo, mat, name) => {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = name
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
    return mesh
  }
  add(g.upper, materials.main, 'upper')
  add(g.tongue, materials.tongue, 'tongue')
  add(g.overlay, materials.overlay, 'overlay')
  add(g.midsole, materials.sole, 'midsole')
  add(g.outsole, materials.outsole, 'outsole')
  add(g.laces, materials.lace, 'laces')
  add(g.accent, materials.accent, 'accent')

  const setColors = (next) => {
    materials.main.color.set(next.main)
    materials.tongue.color.set(next.main)
    materials.overlay.color.set(next.main)
    materials.sole.color.set(next.sole)
    materials.outsole.color.set(next.outsole ?? outsoleFor(next.sole))
    materials.lace.color.set(next.lace)
    materials.accent.color.set(next.accent)
  }

  const dispose = () => Object.values(materials).forEach((m) => m.dispose())

  /** Eases every material toward target THREE.Colors ({ main, sole, outsole, lace, accent }). */
  const lerpColors = (t, k) => {
    materials.main.color.lerp(t.main, k)
    materials.tongue.color.lerp(t.main, k)
    materials.overlay.color.lerp(t.main, k)
    materials.sole.color.lerp(t.sole, k)
    materials.outsole.color.lerp(t.outsole, k)
    materials.lace.color.lerp(t.lace, k)
    materials.accent.color.lerp(t.accent, k)
  }

  return { group, materials, setColors, lerpColors, dispose }
}

/** Anchor points (in shoe space) used by the technology section labels. */
export function getShoeAnchors(styleKey = 'runner') {
  const p = makeProfile(styleKey)
  const v = (u, ang) => p.surface(u, ang, new THREE.Vector3(), false)
  return {
    foam: new THREE.Vector3(-0.9, p.soleTop(-0.9) - 0.14, 0.62),
    mesh: v(0.62, Math.PI / 2 - 0.35),
    cushion: new THREE.Vector3(0.35, p.soleTop(0.35) - 0.2, 0.62),
    grip: new THREE.Vector3(1.0, p.spring(1.0) + 0.03, 0.5),
  }
}
