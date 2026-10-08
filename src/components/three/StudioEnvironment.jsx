import { Environment, Lightformer } from '@react-three/drei'

/** Studio lighting rig with a procedural environment map (no external HDR download). */
export default function StudioEnvironment({ dark = false, rimColor = '#5b8cff' }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.25 : 0.45} />
      <directionalLight position={[4, 7, 5]} intensity={dark ? 2.2 : 1.8} />
      <directionalLight position={[-6, 3, -4]} intensity={dark ? 2.4 : 0.8} color={dark ? rimColor : '#ffffff'} />
      <directionalLight position={[-4, 2, 6]} intensity={0.5} color="#dfe7ff" />
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          <Lightformer form="ring" color={rimColor} intensity={dark ? 6 : 1.5} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
    </>
  )
}
