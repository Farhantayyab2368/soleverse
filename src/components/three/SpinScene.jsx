import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import ShoeModel from './ShoeModel'
import StudioEnvironment from './StudioEnvironment'
import useInView from '../../hooks/useInView'

/** Shoe whose turntable angle is driven by scroll progress (a framer-motion MotionValue 0→1). */
function ScrollShoe({ progress, colors }) {
  const group = useRef()
  const { size, viewport } = useThree()
  const mobile = size.width < 768
  const scale = mobile ? Math.min(0.62, viewport.width / 5.4) : Math.min(0.95, viewport.width / 8)

  useFrame((state, dt) => {
    if (!group.current) return
    const p = progress.get()
    const k = 1 - Math.exp(-dt * 5)
    const targetY = -0.35 + p * Math.PI * 2
    const targetX = 0.18 + Math.sin(p * Math.PI * 2) * 0.12
    group.current.rotation.y += (targetY - group.current.rotation.y) * k
    group.current.rotation.x += (targetX - group.current.rotation.x) * k
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06
  })

  return (
    <group position={mobile ? [0, viewport.height * 0.14, 0] : [viewport.width * 0.16, -0.1, 0]} scale={scale}>
      <group ref={group}>
        <ShoeModel style="jogger" colors={colors} position={[0, -0.75, 0]} />
      </group>
      <ContactShadows position={[0, -1.2, 0]} opacity={0.75} scale={8} blur={2.8} far={3} resolution={512} color="#000" />
    </group>
  )
}

export default function SpinScene({ progress, colors }) {
  const [ref, inView] = useInView({ rootMargin: '100px' })
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.6, 7.2], fov: 32 }}
        dpr={[1, 1.75]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <StudioEnvironment dark />
        <ScrollShoe progress={progress} colors={colors} />
      </Canvas>
    </div>
  )
}
