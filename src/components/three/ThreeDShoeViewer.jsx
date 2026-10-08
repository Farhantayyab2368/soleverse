import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Pause, Play, RotateCcw, ZoomIn, ZoomOut, Move3d } from 'lucide-react'
import ShoeModel, { ShoePair } from './ShoeModel'
import StudioEnvironment from './StudioEnvironment'
import useInView from '../../hooks/useInView'
import { cn } from '../../utils/format'

const DEFAULT_POS = new THREE.Vector3(5.4, 3.0, 7.6)
const SINGLE_POS = new THREE.Vector3(4.6, 2.2, 6.2)
const DEFAULT_TARGET = new THREE.Vector3(0, 0.45, 0)
const MIN_DIST = 3.5
const MAX_DIST = 15

/** Smooth camera moves (zoom buttons / reset) layered on top of OrbitControls. */
const CameraRig = forwardRef(function CameraRig({ controlsRef, startPos }, ref) {
  const { camera } = useThree()
  const anim = useRef(null)

  useImperativeHandle(ref, () => ({
    zoom(factor) {
      const controls = controlsRef.current
      if (!controls) return
      const dir = camera.position.clone().sub(controls.target)
      const dist = THREE.MathUtils.clamp(dir.length() * factor, MIN_DIST, MAX_DIST)
      anim.current = { pos: controls.target.clone().add(dir.setLength(dist)), target: controls.target.clone() }
    },
    reset() {
      anim.current = { pos: startPos.clone(), target: DEFAULT_TARGET.clone() }
    },
    cancel() {
      anim.current = null
    },
  }))

  useFrame((_, dt) => {
    const controls = controlsRef.current
    if (!anim.current || !controls) return
    const k = 1 - Math.exp(-dt * 6)
    camera.position.lerp(anim.current.pos, k)
    controls.target.lerp(anim.current.target, k)
    controls.update()
    if (camera.position.distanceTo(anim.current.pos) < 0.01) anim.current = null
  })
  return null
})

/** Subtle tilt toward the cursor when the user is not dragging. */
function PointerTilt({ children, enabled }) {
  const group = useRef()
  useFrame((state, dt) => {
    if (!group.current) return
    const k = 1 - Math.exp(-dt * 3)
    const tx = enabled ? state.pointer.y * -0.08 : 0
    const tz = enabled ? state.pointer.x * 0.06 : 0
    group.current.rotation.x += (tx - group.current.rotation.x) * k
    group.current.rotation.z += (tz - group.current.rotation.z) * k
  })
  return <group ref={group}>{children}</group>
}

function ControlButton({ label, onClick, children, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      data-cursor="hover"
      className={cn(
        'grid h-10 w-10 place-items-center rounded-full transition-colors duration-200',
        active ? 'bg-ink text-white' : 'text-ink hover:bg-ink/10',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Reusable interactive 3D sneaker viewer.
 * Drag to rotate, scroll/pinch to zoom, auto-rotates when idle.
 */
export default function ThreeDShoeViewer({
  style = 'sneaker',
  colors,
  className,
  showControls = true,
  showHint = true,
  autoRotate: autoRotateInitial = true,
  dark = false,
  cameraPosition,
  pair = true,
}) {
  const controlsRef = useRef()
  const rigRef = useRef()
  const idleTimer = useRef()
  const [autoRotate, setAutoRotate] = useState(autoRotateInitial)
  const [idle, setIdle] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [interacted, setInteracted] = useState(false)
  // wheel-zoom only after the user engages the viewer, so page scrolling never gets trapped
  const [wheelZoom, setWheelZoom] = useState(false)
  const [wrapRef, inView] = useInView({ rootMargin: '100px' })
  const startPos = useRef(cameraPosition ? new THREE.Vector3(...cameraPosition) : (pair ? DEFAULT_POS : SINGLE_POS).clone()).current

  useEffect(() => () => clearTimeout(idleTimer.current), [])

  const onStart = useCallback(() => {
    clearTimeout(idleTimer.current)
    rigRef.current?.cancel()
    setIdle(false)
    setDragging(true)
    setInteracted(true)
  }, [])
  const onEnd = useCallback(() => {
    setDragging(false)
    idleTimer.current = setTimeout(() => setIdle(true), 2500)
  }, [])

  return (
    <div
      ref={wrapRef}
      className={cn('relative h-full w-full touch-pan-y select-none', dragging ? 'cursor-grabbing' : 'cursor-grab', className)}
      data-cursor="drag"
      data-lenis-prevent={wheelZoom || undefined}
      role="img"
      aria-label="Interactive 3D sneaker. Drag to rotate, use the toolbar to zoom."
      onPointerDown={() => setWheelZoom(true)}
      onPointerLeave={() => setWheelZoom(false)}
    >
      <Canvas
        camera={{ position: startPos.toArray(), fov: 32 }}
        dpr={[1, 1.75]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, powerPreference: 'high-performance' }}
      >
        <StudioEnvironment dark={dark} />
        <PointerTilt enabled={!dragging}>
          {pair ? (
            <ShoePair style={style} colors={colors} position={[0, -0.15, 0]} />
          ) : (
            <ShoeModel style={style} colors={colors} position={[0, -0.15, 0]} />
          )}
        </PointerTilt>
        <ContactShadows position={[0, -0.16, 0]} opacity={dark ? 0.7 : 0.45} scale={12} blur={2.6} far={2.5} resolution={512} color="#0a0a0c" />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={DEFAULT_TARGET.toArray()}
          enablePan={false}
          enableZoom={wheelZoom}
          enableDamping
          dampingFactor={0.08}
          minDistance={MIN_DIST}
          maxDistance={MAX_DIST}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={autoRotate && idle}
          autoRotateSpeed={1.4}
          zoomSpeed={0.6}
          onStart={onStart}
          onEnd={onEnd}
        />
        <CameraRig ref={rigRef} controlsRef={controlsRef} startPos={startPos} />
      </Canvas>

      {showHint && (
        <div
          className={cn(
            'pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-opacity duration-500',
            dark ? 'glass-dark text-white/80' : 'glass text-ink/70',
            interacted ? 'opacity-0' : 'opacity-100',
          )}
        >
          <Move3d className="h-3.5 w-3.5" /> Drag to rotate · Click + scroll to zoom
        </div>
      )}

      {showControls && (
        <div
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full glass p-1 shadow-soft"
          role="toolbar"
          aria-label="3D viewer controls"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <ControlButton label={autoRotate ? 'Pause rotation' : 'Auto-rotate'} onClick={() => setAutoRotate((v) => !v)} active={autoRotate}>
            {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </ControlButton>
          <ControlButton label="Zoom in" onClick={() => rigRef.current?.zoom(0.78)}>
            <ZoomIn className="h-4 w-4" />
          </ControlButton>
          <ControlButton label="Zoom out" onClick={() => rigRef.current?.zoom(1.28)}>
            <ZoomOut className="h-4 w-4" />
          </ControlButton>
          <ControlButton label="Reset view" onClick={() => rigRef.current?.reset()}>
            <RotateCcw className="h-4 w-4" />
          </ControlButton>
        </div>
      )}
    </div>
  )
}
