import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import ShoeModel from './ShoeModel'
import StudioEnvironment from './StudioEnvironment'
import useInView from '../../hooks/useInView'

const TECH_COLORS = { main: '#1b1c20', sole: '#f4f4f0', lace: '#2a2c32', accent: '#2f6bff' }

/**
 * Where each label points, as rays fired at the shoe (shoe space: toe → +X, outer side → +Z).
 * Raycasting onto the real surface keeps the dots attached for any model.
 */
const PROBES = {
  mesh: { origin: [0.55, 6, 0.3], dir: [0, -1, 0] },
  foam: { origin: [-0.95, 0.2, 6], dir: [0, 0, -1] },
  cushion: { origin: [0.3, 0.09, 6], dir: [0, 0, -1] },
  grip: { origin: [6, 0.1, 0.15], dir: [-1, 0, 0] },
}

const LABELS = [
  { key: 'mesh', title: 'Breathable Mesh', text: 'Engineered knit zones', offset: [-0.6, 1.25, 0.3] },
  { key: 'foam', title: 'Lightweight Foam', text: '38% lighter AeroFoam™', offset: [-1.3, -0.5, 0.5] },
  { key: 'cushion', title: 'Responsive Cushioning', text: '84% energy return', offset: [0.9, 1.05, 0.4] },
  { key: 'grip', title: 'Grip Sole', text: 'Multi-surface rubber', offset: [0.9, -0.75, 0.4] },
]

function Hotspot({ anchor, offset, title, text, index, compact }) {
  const labelPos = useMemo(() => anchor.clone().add(new THREE.Vector3(...offset)), [anchor, offset])
  return (
    <group>
      <Line points={[anchor, labelPos]} color="#5b8cff" lineWidth={1.2} transparent opacity={0.8} dashed dashSize={0.06} gapSize={0.04} />
      <Html position={anchor} center zIndexRange={[20, 0]}>
        <span className="relative block h-3 w-3">
          <span className="absolute inset-0 rounded-full bg-volt animate-pulse-ring" />
          <span className="absolute inset-0 rounded-full border-2 border-white bg-volt" />
        </span>
      </Html>
      <Html position={labelPos} center zIndexRange={[20, 0]}>
        <div
          className="glass-dark pointer-events-none whitespace-nowrap rounded-2xl border border-white/10 px-3.5 py-2.5 text-white shadow-lift"
          style={{ animation: `fade-in 0.6s ${0.2 + index * 0.12}s both` }}
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-volt-glow">0{index + 1}</p>
          <p className={compact ? 'text-xs font-semibold' : 'text-sm font-semibold'}>{title}</p>
          {!compact && <p className="text-xs text-white/55">{text}</p>}
        </div>
      </Html>
    </group>
  )
}

function TechShoe() {
  const group = useRef()
  const shoeRef = useRef()
  const [anchors, setAnchors] = useState(null)
  const { size } = useThree()
  const compact = size.width < 640

  useFrame((state, dt) => {
    if (!group.current) return
    // once the model is loaded, probe its surface for the label anchors (in shoe-local space)
    if (!anchors && shoeRef.current) {
      const shoe = shoeRef.current
      const meshes = []
      shoe.traverse((o) => o.isMesh && meshes.push(o))
      if (meshes.length) {
        shoe.updateMatrixWorld(true)
        const ray = new THREE.Raycaster()
        const found = {}
        for (const [key, p] of Object.entries(PROBES)) {
          ray.set(shoe.localToWorld(new THREE.Vector3(...p.origin)), new THREE.Vector3(...p.dir).transformDirection(shoe.matrixWorld))
          const hit = ray.intersectObjects(meshes, false)[0]
          found[key] = hit ? shoe.worldToLocal(hit.point.clone()) : new THREE.Vector3(...p.origin).multiply(new THREE.Vector3(...p.dir.map((d) => (d ? 0.1 : 1))))
        }
        setAnchors(found)
      }
    }
    const k = 1 - Math.exp(-dt * 2)
    const target = Math.sin(state.clock.elapsedTime * 0.35) * 0.22 + state.pointer.x * 0.15
    group.current.rotation.y += (target - group.current.rotation.y) * k
  })

  return (
    <group ref={group} position={[0, -0.75, 0]} scale={compact ? 0.72 : 1}>
      <group ref={shoeRef}>
        <ShoeModel colors={TECH_COLORS} />
      </group>
      {anchors && LABELS.map((l, i) => (
        <Hotspot key={l.key} anchor={anchors[l.key]} offset={l.offset} title={l.title} text={l.text} index={i} compact={compact} />
      ))}
      <ContactShadows position={[0, -0.01, 0]} opacity={0.8} scale={8} blur={2.5} far={2} resolution={512} color="#000" />
    </group>
  )
}

export default function TechScene() {
  const [ref, inView] = useInView({ rootMargin: '100px' })
  return (
    <div ref={ref} className="absolute inset-0">
      <style>{'@keyframes fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}'}</style>
      <Canvas
        camera={{ position: [0.4, 1.4, 7.4], fov: 34 }}
        dpr={[1, 1.75]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <StudioEnvironment dark />
        {inView && <TechShoe />}
      </Canvas>
    </div>
  )
}
