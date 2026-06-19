import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { HUB_CENTER, SECTION_ROOMS, isWalkable, type Controls } from "./config";
import type { SectionId } from "../../data/profile";

type Props = {
  started: boolean;
  paused: boolean;
  onNearestChange: (id: SectionId | null) => void;
  onActivate: (id: SectionId) => void;
};

export default function Player({
  started,
  paused,
  onNearestChange,
  onActivate,
}: Props) {
  const group = useRef<THREE.Group>(null!);
  const camera = useThree((s) => s.camera);
  const [sub, get] = useKeyboardControls<Controls>();

  const facing = useRef(Math.PI); // start facing -Z (into screen)
  const nearestRef = useRef<SectionId | null>(null);
  const pausedRef = useRef(paused);
  const startedRef = useRef(started);
  pausedRef.current = paused;
  startedRef.current = started;

  // Edge-detect interact key
  useEffect(() => {
    const unsub = sub(
      (s) => s.interact,
      (pressed) => {
        if (!pressed) return;
        if (pausedRef.current || !startedRef.current) return;
        if (nearestRef.current) onActivate(nearestRef.current);
      },
    );
    return unsub;
  }, [sub, onActivate]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const pos = g.position;

    let dx = 0;
    let dz = 0;
    if (!pausedRef.current && startedRef.current) {
      const { forward, backward, left, right, sprint } = get();
      if (forward) dz -= 1;
      if (backward) dz += 1;
      if (left) dx -= 1;
      if (right) dx += 1;
      const len = Math.hypot(dx, dz);
      if (len > 0) {
        dx /= len;
        dz /= len;
      }
      const speed = sprint ? 9 : 5.5;
      dx *= speed * dt;
      dz *= speed * dt;
    }

    // Axis-wise wall sliding
    if (dx !== 0 && isWalkable(pos.x + dx, pos.z)) pos.x += dx;
    if (dz !== 0 && isWalkable(pos.x, pos.z + dz)) pos.z += dz;

    // Facing rotation toward movement
    if (dx !== 0 || dz !== 0) {
      const target = Math.atan2(dx, dz);
      let diff = target - facing.current;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      facing.current += diff * Math.min(1, dt * 12);
      g.rotation.y = facing.current;
    }

    // Chase camera (locked angle, soft follow)
    const camOffset = new THREE.Vector3(0, 9.5, 11);
    const targetPos = new THREE.Vector3().copy(pos).add(camOffset);
    camera.position.lerp(targetPos, Math.min(1, dt * 5));
    camera.lookAt(pos.x, 1.2, pos.z);

    // Proximity detection for nearest totem
    let best: SectionId | null = null;
    let bestDist = 4.5;
    for (const r of SECTION_ROOMS) {
      const ddx = pos.x - r.totem[0];
      const ddz = pos.z - r.totem[2];
      const d = Math.hypot(ddx, ddz);
      if (d < bestDist) {
        bestDist = d;
        best = r.section;
      }
    }
    if (best !== nearestRef.current) {
      nearestRef.current = best;
      onNearestChange(best);
    }
  });

  return (
    <group ref={group} position={HUB_CENTER}>
      {/* Body */}
      <mesh castShadow position={[0, 1.0, 0]}>
        <capsuleGeometry args={[0.42, 1.0, 8, 16]} />
        <meshStandardMaterial
          color="#3b1f6b"
          emissive="#a78bfa"
          emissiveIntensity={0.7}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial
          color="#1f1233"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* Facing cone */}
      <mesh position={[0, 1.3, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.4, 8]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      {/* Ground halo */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.15, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.55} />
      </mesh>
      <pointLight
        position={[0, 2.4, 0]}
        intensity={1.8}
        distance={7}
        color="#a78bfa"
      />
    </group>
  );
}
