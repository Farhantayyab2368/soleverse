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
        if (import.meta.env.DEV) console.warn('[SOLEVERSE] 3D model unavailable, using procedural shoe:', err?.message)
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
  material.customProgramCacheKey = () => 'soleverse-recolor'
  return { material, uniforms }
}

/** Same interface as the procedural shoe: { group, setColors, lerpColors, dispose }. */
export function createRealShoe(template, colors) {
  const { material, uniforms } = makeMaterial(template.material, colors)
  const mesh = new THREE.Mesh(template.geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.name = 'shoe'
  const group = new THREE.Group()
  group.name = 'SoleverseRealShoe'
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
