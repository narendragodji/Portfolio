import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ROOMS, ROOM_LAYOUT, SECTION_ROOMS } from "./config";
import Totem from "./Totem";
import type { SectionId } from "../../data/profile";

const WALL_HEIGHT = 4.5;
const WALL_THICKNESS = 0.3;
const DOOR_HALF = ROOM_LAYOUT.CORRIDOR_HALF_WIDTH + 0.2;

type DoorSides = { N?: boolean; S?: boolean; E?: boolean; W?: boolean };

function splitByDoor(
  start: number,
  end: number,
  hasDoor: boolean,
): [number, number][] {
  if (!hasDoor) return [[start, end]];
  const mid = (start + end) / 2;
  return [
    [start, mid - DOOR_HALF],
    [mid + DOOR_HALF, end],
  ].filter(([s, e]) => e - s > 0.1) as [number, number][];
}

function RoomShell({
  minX,
  maxX,
  minZ,
  maxZ,
  doors,
  accent,
}: {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  doors: DoorSides;
  accent: string;
}) {
  const segments = useMemo(() => {
    const segs: {
      x: number;
      z: number;
      w: number;
      d: number;
    }[] = [];
    for (const [s, e] of splitByDoor(minX, maxX, !!doors.N))
      segs.push({ x: (s + e) / 2, z: maxZ, w: e - s, d: WALL_THICKNESS });
    for (const [s, e] of splitByDoor(minX, maxX, !!doors.S))
      segs.push({ x: (s + e) / 2, z: minZ, w: e - s, d: WALL_THICKNESS });
    for (const [s, e] of splitByDoor(minZ, maxZ, !!doors.E))
      segs.push({ x: maxX, z: (s + e) / 2, w: WALL_THICKNESS, d: e - s });
    for (const [s, e] of splitByDoor(minZ, maxZ, !!doors.W))
      segs.push({ x: minX, z: (s + e) / 2, w: WALL_THICKNESS, d: e - s });
    return segs;
  }, [minX, maxX, minZ, maxZ, doors.N, doors.S, doors.E, doors.W]);

  return (
    <group>
      {segments.map((s, i) => (
        <group key={i}>
          <mesh
            position={[s.x, WALL_HEIGHT / 2, s.z]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[s.w, WALL_HEIGHT, s.d]} />
            <meshStandardMaterial
              color="#0a0a14"
              metalness={0.5}
              roughness={0.55}
            />
          </mesh>
          {/* top neon trim */}
          <mesh position={[s.x, WALL_HEIGHT + 0.04, s.z]}>
            <boxGeometry args={[s.w + 0.02, 0.08, s.d + 0.02]} />
            <meshBasicMaterial color={accent} />
          </mesh>
          {/* base neon trim */}
          <mesh position={[s.x, 0.04, s.z]}>
            <boxGeometry args={[s.w + 0.02, 0.06, s.d + 0.02]} />
            <meshBasicMaterial color={accent} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Floor({
  minX,
  maxX,
  minZ,
  maxZ,
  accent,
  decoEdges = true,
}: {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  accent: string;
  decoEdges?: boolean;
}) {
  const w = maxX - minX;
  const d = maxZ - minZ;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  return (
    <group>
      <mesh
        position={[cx, 0, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          color="#0d0d18"
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      {decoEdges && (
        <>
          {/* faint inner glow strip */}
          <mesh position={[cx, 0.015, cz]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[Math.min(w, d) / 2 - 0.6, Math.min(w, d) / 2 - 0.4, 64]}
            />
            <meshBasicMaterial color={accent} transparent opacity={0.45} />
          </mesh>
        </>
      )}
    </group>
  );
}

/* -------------------- Room decorations -------------------- */

function HubDecor() {
  const ring = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ring.current) ring.current.rotation.z = s.clock.elapsedTime * 0.15;
  });
  return (
    <group>
      {/* center pedestal */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.3, 64]} />
        <meshStandardMaterial color="#161626" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh
        ref={ring}
        position={[0, 0.32, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.8, 2.05, 64]} />
        <meshBasicMaterial color="#a78bfa" />
      </mesh>
      {/* floating title */}
      <Html
        position={[0, 4.6, 0]}
        center
        distanceFactor={9}
        wrapperClass="pointer-events-none"
      >
        <div className="text-center select-none">
          <div
            className="text-3xl font-black tracking-[0.45em]"
            style={{
              color: "#fff",
              textShadow:
                "0 0 12px #a78bfa, 0 0 28px #7c3aed, 0 0 60px #4c1d95",
            }}
          >
            AKASH
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.5em] mt-1"
            style={{ color: "#a78bfa" }}
          >
            Decision Scientist
          </div>
        </div>
      </Html>
      {/* corner lamps */}
      {[
        [-7, -7],
        [7, -7],
        [-7, 7],
        [7, 7],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 3.5, 8]} />
            <meshStandardMaterial color="#1a1a2a" />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#a78bfa" />
          </mesh>
          <pointLight
            position={[0, 3.5, 0]}
            intensity={1.4}
            distance={9}
            color="#a78bfa"
          />
        </group>
      ))}
    </group>
  );
}

function AboutDecor({ center }: { center: [number, number] }) {
  return (
    <group position={[center[0], 0, center[1]]}>
      {/* floating tome (book) */}
      <mesh position={[0, 2.2, -2.5]} rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.25, 1.0]} />
        <meshStandardMaterial
          color="#3b1f6b"
          emissive="#a78bfa"
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight
        position={[0, 3, -2.5]}
        intensity={1.2}
        distance={6}
        color="#c084fc"
      />
    </group>
  );
}

function ExperienceDecor({ center }: { center: [number, number] }) {
  const pillars = [-4, 0, 4];
  return (
    <group position={[center[0], 0, center[1]]}>
      {pillars.map((z, i) => (
        <group key={i} position={[-3, 0, z]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[0.6, 3, 0.6]} />
            <meshStandardMaterial
              color="#1a1208"
              emissive="#fbbf24"
              emissiveIntensity={0.4}
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      ))}
      <pointLight
        position={[-3, 3, 0]}
        intensity={1.6}
        distance={9}
        color="#fbbf24"
      />
    </group>
  );
}

function ProjectsDecor({ center }: { center: [number, number] }) {
  // floating holographic screens
  const screens = [
    { x: -3.5, z: 0, rotY: 0.4 },
    { x: 0, z: -3, rotY: 0 },
    { x: 3.5, z: 0, rotY: -0.4 },
  ];
  return (
    <group position={[center[0], 0, center[1]]}>
      {screens.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 2.4, s.z]}
          rotation={[0, s.rotY, 0]}
        >
          <planeGeometry args={[2.4, 1.5]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <pointLight
        position={[0, 3, 0]}
        intensity={1.6}
        distance={9}
        color="#22d3ee"
      />
    </group>
  );
}

function ContactDecor({ center }: { center: [number, number] }) {
  const torus = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (torus.current) torus.current.rotation.z = s.clock.elapsedTime * 0.4;
  });
  return (
    <group position={[center[0], 0, center[1]]}>
      <mesh
        ref={torus}
        position={[-3, 2.4, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[1.4, 0.18, 16, 64]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={1.2}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      {/* portal disc */}
      <mesh position={[-3, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[1.25, 64]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.3} />
      </mesh>
      <pointLight
        position={[-3, 2.4, 0]}
        intensity={1.6}
        distance={9}
        color="#f472b6"
      />
    </group>
  );
}

/* -------------------- World -------------------- */

type Props = {
  nearest: SectionId | null;
};

export default function World({ nearest }: Props) {
  // Floors for all rectangles
  const floors = ROOMS.map((r, i) => {
    const isHub = r.id === "hub";
    return (
      <Floor
        key={`f-${i}`}
        minX={r.minX}
        maxX={r.maxX}
        minZ={r.minZ}
        maxZ={r.maxZ}
        accent={r.accent}
        decoEdges={!isHub && r.section !== undefined}
      />
    );
  });

  return (
    <group>
      {/* Atmosphere */}
      <ambientLight intensity={0.25} color="#1a1a2e" />
      <hemisphereLight args={["#3a2a6a", "#040408", 0.3]} />
      <fog attach="fog" args={["#04040a", 18, 60]} />

      {/* Floors */}
      {floors}

      {/* Hub walls (doors on all 4 sides) */}
      <RoomShell
        minX={-ROOM_LAYOUT.HUB_HALF}
        maxX={ROOM_LAYOUT.HUB_HALF}
        minZ={-ROOM_LAYOUT.HUB_HALF}
        maxZ={ROOM_LAYOUT.HUB_HALF}
        doors={{ N: true, S: true, E: true, W: true }}
        accent="#a78bfa"
      />
      <HubDecor />

      {/* Themed rooms */}
      {SECTION_ROOMS.map((r) => {
        const cx = (r.minX + r.maxX) / 2;
        const cz = (r.minZ + r.maxZ) / 2;
        let doors: DoorSides = {};
        if (r.section === "about") doors = { S: true };
        if (r.section === "experience") doors = { W: true };
        if (r.section === "projects") doors = { N: true };
        if (r.section === "contact") doors = { E: true };

        return (
          <group key={r.section}>
            <RoomShell
              minX={r.minX}
              maxX={r.maxX}
              minZ={r.minZ}
              maxZ={r.maxZ}
              doors={doors}
              accent={r.accent}
            />
            {r.section === "about" && <AboutDecor center={[cx, cz]} />}
            {r.section === "experience" && (
              <ExperienceDecor center={[cx, cz]} />
            )}
            {r.section === "projects" && <ProjectsDecor center={[cx, cz]} />}
            {r.section === "contact" && <ContactDecor center={[cx, cz]} />}
            <Totem
              section={r.section}
              position={r.totem}
              accent={r.accent}
              nearest={nearest === r.section}
            />
          </group>
        );
      })}

      {/* Distant ambient lights for each room */}
      {SECTION_ROOMS.map((r, i) => (
        <pointLight
          key={`amb-${i}`}
          position={[(r.minX + r.maxX) / 2, 5, (r.minZ + r.maxZ) / 2]}
          intensity={0.5}
          distance={18}
          color={r.accent}
        />
      ))}
    </group>
  );
}
