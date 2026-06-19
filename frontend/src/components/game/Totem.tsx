import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { SectionId } from "../../data/profile";

const ICONS: Record<SectionId, string> = {
  about: "◆",
  experience: "⚔",
  projects: "▦",
  contact: "◉",
};

const LABELS: Record<SectionId, string> = {
  about: "ABOUT",
  experience: "EXPERIENCE",
  projects: "PROJECTS",
  contact: "CONTACT",
};

type Props = {
  section: SectionId;
  position: [number, number, number];
  accent: string;
  nearest: boolean;
};

export default function Totem({ section, position, accent, nearest }: Props) {
  const crystal = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const pillar = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (crystal.current) {
      crystal.current.position.y = 2.6 + Math.sin(t * 1.5) * 0.18;
      crystal.current.rotation.y = t * 0.6;
      crystal.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.4;
      const s = nearest ? 1.2 + Math.sin(t * 4) * 0.1 : 1;
      ring.current.scale.setScalar(s);
    }
    if (pillar.current) {
      const mat = pillar.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = nearest
        ? 1.2 + Math.sin(t * 6) * 0.3
        : 0.6 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Base ring on floor */}
      <mesh
        ref={ring}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.1, 1.4, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.75} />
      </mesh>

      {/* Pillar */}
      <mesh
        ref={pillar}
        position={[0, 1.0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.5, 0.65, 2.0, 8]} />
        <meshStandardMaterial
          color="#0c0c14"
          emissive={accent}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Floating crystal */}
      <mesh ref={crystal} position={[0, 2.6, 0]} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
          metalness={0.7}
          roughness={0.15}
        />
      </mesh>

      {/* Glow light */}
      <pointLight
        position={[0, 2.6, 0]}
        intensity={nearest ? 3.5 : 2}
        distance={9}
        color={accent}
      />

      {/* HTML label */}
      <Html
        position={[0, 4.2, 0]}
        center
        distanceFactor={10}
        zIndexRange={[0, 0]}
        wrapperClass="pointer-events-none"
      >
        <div className="flex flex-col items-center gap-1 select-none">
          <div
            className="text-2xl font-bold tracking-[0.3em] px-3 py-1 rounded-md"
            style={{
              color: accent,
              textShadow: `0 0 12px ${accent}, 0 0 24px ${accent}`,
            }}
          >
            {ICONS[section]} {LABELS[section]}
          </div>
          {nearest && (
            <div
              className="text-[10px] uppercase tracking-[0.4em] px-2 py-0.5 rounded bg-black/70 border"
              style={{ borderColor: accent, color: "#fff" }}
            >
              [E] Enter
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
