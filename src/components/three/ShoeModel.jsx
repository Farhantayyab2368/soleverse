import { Suspense, use, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DEFAULT_COLORS } from '../../three/buildShoe'
import { loadRealShoe } from '../../three/realShoe'
import { colorTargets, makeShoe, PAIR_LAYOUT } from '../../three/shoeFactory'

/** In-scene loading indicator (pure WebGL — DOM overlays must not be Suspense fallbacks inside a Canvas). */
function Spinner() {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z -= dt * 4
  })
  return (
    <mesh ref={ref} position={[0, 0.7, 0]}>
      <torusGeometry args={[0.32, 0.025, 8, 48, Math.PI * 1.4]} />
      <meshBasicMaterial color="#2f6bff" toneMapped={false} />
    </mesh>
  )
}

function ShoeInstance({ style, colors, mirror }) {
  // loadRealShoe() is cached, so `use` gets the same promise on every render
  const template = use(loadRealShoe())
  const shoe = useMemo(() => makeShoe(template, style, colors), [template, style]) // eslint-disable-line react-hooks/exhaustive-deps
  const targets = useMemo(() => colorTargets(colors), [colors.main, colors.sole, colors.lace, colors.accent, colors.outsole]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => shoe.dispose(), [shoe])

  // smooth colour transitions
  useFrame((_, dt) => shoe.lerpColors(targets, 1 - Math.exp(-dt * 7)))

  return <primitive object={shoe.group} scale={mirror ? [1, 1, -1] : 1} />
}

/**
 * Reusable sneaker for any R3F scene: the photoscanned model (public/models/shoe.glb) when available,
 * otherwise the procedural SOLEVERSE sneaker. `mirror` renders the left foot.
 */
export default function ShoeModel({ style = 'runner', colors = DEFAULT_COLORS, mirror = false, spinner = true, ...props }) {
  return (
    <group {...props}>
      <Suspense fallback={spinner ? <Spinner /> : null}>
        <ShoeInstance style={style} colors={colors} mirror={mirror} />
      </Suspense>
    </group>
  )
}

/** A left + right pair using the shared studio layout. */
export function ShoePair({ style, colors, ...props }) {
  return (
    <group {...props}>
      <ShoeModel style={style} colors={colors} position={PAIR_LAYOUT.right.position} rotation-y={PAIR_LAYOUT.right.rotationY} />
      <ShoeModel style={style} colors={colors} mirror position={PAIR_LAYOUT.left.position} rotation-y={PAIR_LAYOUT.left.rotationY} />
    </group>
  )
}
