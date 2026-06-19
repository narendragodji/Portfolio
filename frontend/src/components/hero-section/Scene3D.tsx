import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Stars,
  Environment,
  TorusKnot,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function FloatingKnot({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <TorusKnot ref={ref} args={[0.5, 0.18, 128, 32]} position={position} scale={scale}>
        <meshStandardMaterial
          color={color}
          metalness={0.85}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </TorusKnot>
    </Float>
  );
}

function DistortedBlob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={ref} args={[1.6, 128, 128]} position={[0, 0, 0]}>
        {/* @ts-expect-error drei types */}
        <MeshDistortMaterial
          color="#7c3aed"
          attach="material"
          distort={0.45}
          speed={2.2}
          roughness={0.1}
          metalness={0.6}
          emissive="#4c1d95"
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
        <pointLight position={[-5, -3, -5]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[5, -3, 5]} intensity={1.2} color="#ec4899" />

        <DistortedBlob />
        <FloatingKnot position={[-2.6, 1.4, -1]} color="#06b6d4" scale={0.7} />
        <FloatingKnot position={[2.7, -1.2, -0.5]} color="#ec4899" scale={0.6} />
        <FloatingKnot position={[2.2, 1.6, -2]} color="#a78bfa" scale={0.45} />

        <Stars
          radius={60}
          depth={50}
          count={2500}
          factor={3}
          saturation={0}
          fade
          speed={1}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
