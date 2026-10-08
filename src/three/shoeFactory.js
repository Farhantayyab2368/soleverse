import * as THREE from 'three'
import { createShoe, outsoleFor } from './buildShoe'
import { createRealShoe } from './realShoe'

// procedural fallback silhouette for each shoe type
const FALLBACK_STYLE = {
  jogger: 'runner',
  'jogger-max': 'runner',
  sneaker: 'street',
  'sneaker-low': 'street',
  'sneaker-mid': 'court',
  comfort: 'trainer',
  'comfort-cloud': 'trainer',
}

/** Creates one shoe: the photoscanned model (reshaped per type) when loaded, otherwise the procedural one. */
export function makeShoe(template, style, colors) {
  return template ? createRealShoe(template, colors, style) : createShoe(FALLBACK_STYLE[style] ?? style, colors)
}

export const colorTargets = (colors) => ({
  main: new THREE.Color(colors.main),
  sole: new THREE.Color(colors.sole),
  outsole: new THREE.Color(colors.outsole ?? outsoleFor(colors.sole)),
  lace: new THREE.Color(colors.lace),
  accent: new THREE.Color(colors.accent),
})

/**
 * Pair layout (shoe-space units, toe → +X, viewer on +Z).
 * The right shoe sits in front showing its outer side; the mirrored left shoe sits behind, slightly turned.
 */
export const PAIR_LAYOUT = {
  right: { position: [0.32, 0, 0.62], rotationY: 0 },
  left: { position: [-0.42, 0, -0.62], rotationY: 0.2 },
}

/** Plain-three.js pair (used by the off-screen photo studio). */
export function createPair(template, style, colors) {
  const right = makeShoe(template, style, colors)
  const left = makeShoe(template, style, colors)
  left.group.scale.z = -1
  right.group.position.set(...PAIR_LAYOUT.right.position)
  right.group.rotation.y = PAIR_LAYOUT.right.rotationY
  left.group.position.set(...PAIR_LAYOUT.left.position)
  left.group.rotation.y = PAIR_LAYOUT.left.rotationY
  const group = new THREE.Group()
  group.add(right.group, left.group)
  return {
    group,
    setColors: (c) => {
      right.setColors(c)
      left.setColors(c)
    },
    dispose: () => {
      right.dispose()
      left.dispose()
    },
  }
}
