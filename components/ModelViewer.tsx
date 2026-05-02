'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, Grid } from '@react-three/drei'
import { Suspense, useState } from 'react'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} />
}

function ViewerFallback({ image, message }: { image?: string; message?: string }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center">
      {image ? (
        <img src={image} alt="Model preview" className="w-full h-full object-contain opacity-70" />
      ) : (
        <div className="text-center">
          <p className="text-5xl font-black text-[#1a1a1a] mb-3">3D</p>
          <p className="text-xs text-gray-700 font-bold tracking-widest">{message ?? '3D VIEW UNAVAILABLE'}</p>
        </div>
      )}
    </div>
  )
}

interface Props {
  modelUrl?: string | null
  fallbackImage?: string | null
}

export default function ModelViewer({ modelUrl, fallbackImage }: Props) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !modelUrl) {
    return <ViewerFallback image={fallbackImage ?? undefined} />
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-[#050505] border border-[#1f1f1f] relative group">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 border border-[#84ff00]/20">
        <div className="w-1.5 h-1.5 bg-[#84ff00] rounded-full" />
        <span className="text-[8px] font-black text-[#84ff00] tracking-widest">INTERACTIVE 3D</span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 text-[8px] text-gray-700 font-bold tracking-widest hidden group-hover:block">
        DRAG TO ROTATE · SCROLL TO ZOOM
      </div>

      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onError={() => setHasError(true)}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <Environment preset="night" />

          <Suspense fallback={null}>
            <Model url={modelUrl} />
          </Suspense>

          <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={8} blur={2} far={4} />
          <Grid
            args={[20, 20]}
            position={[0, -1.5, 0]}
            cellColor="#1a1a1a"
            sectionColor="#84ff00"
            sectionSize={3}
            fadeDistance={20}
          />

          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={2}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
