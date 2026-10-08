import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import ShoeModel from './ShoeModel'
import StudioEnvironment from './StudioEnvironment'
import useInView from '../../hooks/useInView'

const HERO_COLORS = { main: '#ededea', sole: '#fafaf8', lace: '#16171b', accent: '#2f6bff' }

const easeOutBack = (t) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

/**
 * One animated shoe of the hero pair.
 * - entrance: flies in from `from` with an overshoot ("drop-in")
 * - idle: slow showroom sway + cursor parallax
 * - scroll: the pair splits apart and turns as the hero scrolls away
 */
function HeroShoe({ colors, mirror, rest, from, delay, sway, scrollSpread }) {
  const outer = useRef()
  const inner = useRef()
  const start = useRef(null)

  useFrame((state, dt) => {
    if (!outer.current || !inner.current) return
    const t = state.clock.elapsedTime
    // start the entrance only once the model has finished loading
    if (start.current === null) {
      const loaded = inner.current.getObjectByName('SoleverseRealShoe') || inner.current.getObjectByName('SoleverseShoe')
      if (loaded) start.current = t
    }
    const p = start.current === null ? 0 : Math.min(1, Math.max(0, (t - start.current - delay) / 1.5))
    const e = easeOutBack(p)
    const scroll = Math.min(1, window.scrollY / window.innerHeight)

    // entrance + scroll split
    outer.current.position.set(
      from[0] + (rest.position[0] - from[0]) * e + scrollSpread[0] * scroll,
      from[1] + (rest.position[1] - from[1]) * e + scrollSpread[1] * scroll,
      from[2] + (rest.position[2] - from[2]) * e,
    )
    outer.current.rotation.z = (1 - e) * (mirror ? 0.9 : -0.9) + rest.rotation[2]

    // idle sway + cursor
    const k = 1 - Math.exp(-dt * 2.5)
    const targetY = rest.rotation[1] + Math.sin(t * 0.3 + sway) * 0.28 + state.pointer.x * 0.35 + scroll * (mirror ? -1.2 : 1.2)
    const targetX = rest.rotation[0] - state.pointer.y * 0.12
    inner.current.rotation.y += (targetY - inner.current.rotation.y) * k
    inner.current.rotation.x += (targetX - inner.current.rotation.x) * k
  })

  return (
    <group ref={outer} position={from}>
      <Float speed={1.5 + sway * 0.3} rotationIntensity={0.12} floatIntensity={0.55} floatingRange={[-0.08, 0.12]}>
        <group ref={inner}>
          <ShoeModel style="jogger" colors={colors} mirror={mirror} spinner={false} position={[0, -0.6, 0]} />
        </group>
      </Float>
    </group>
  )
}

function HeroPair({ colors }) {
  const { size, viewport } = useThree()
  const mobile = size.width < 768
  // fit the pair to the visible frustum: top band on phones, right half on desktop
  const scale = mobile ? Math.min(0.55, viewport.width / 6.2) : Math.min(0.78, viewport.width / 9.5)
  const position = mobile ? [0, viewport.height * 0.27, 0] : [Math.min(2.0, viewport.width * 0.2), 0, 0]

  return (
    <group position={position} scale={scale}>
      <HeroShoe
        colors={colors}
        rest={{ position: [0.55, 0.55, -0.9], rotation: [0.1, 0.55, 0.12] }}
        from={[1.5, 6, -2]}
        delay={0.25}
        sway={1.7}
        mirror
        scrollSpread={[-1.4, 1.0]}
      />
      <HeroShoe
        colors={colors}
        rest={{ position: [-0.35, -0.35, 0.8], rotation: [0.14, -0.5, -0.06] }}
        from={[-6, -1.5, 1]}
        delay={0}
        sway={0}
        scrollSpread={[1.4, -0.6]}
      />
      <ContactShadows position={[0, -1.45, 0]} opacity={0.7} scale={10} blur={3} far={3.5} resolution={512} color="#000000" />
    </group>
  )
}

/** Gentle camera dolly following the cursor. */
function CameraParallax() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())
  useFrame((state, dt) => {
    const k = 1 - Math.exp(-dt * 2)
    target.current.set(state.pointer.x * 0.35, 0.35 + state.pointer.y * 0.2, 7.5)
    camera.position.lerp(target.current, k)
    camera.lookAt(0, 0.1, 0)
  })
  return null
}

export default function HeroScene({ colors = HERO_COLORS }) {
  const [ref, inView] = useInView({ rootMargin: '0px' })
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.35, 7.5], fov: 32 }}
        dpr={[1, 1.75]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, powerPreference: 'high-performance' }}
        eventSource={typeof document !== 'undefined' ? document.getElementById('root') : undefined}
        eventPrefix="client"
      >
        <StudioEnvironment dark />
        <HeroPair colors={colors} />
        <Sparkles count={70} scale={[12, 6, 6]} size={2.2} speed={0.35} opacity={0.55} color="#7aa2ff" />
        <CameraParallax />
      </Canvas>
    </div>
  )
}
