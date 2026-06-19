import type { KeyboardControlsEntry } from "@react-three/drei";
import type { SectionId } from "../../data/profile";

export type Controls =
  | "forward"
  | "backward"
  | "left"
  | "right"
  | "interact"
  | "sprint";

export const controlsMap: KeyboardControlsEntry<Controls>[] = [
  { name: "forward", keys: ["ArrowUp", "w", "W"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "left", keys: ["ArrowLeft", "a", "A"] },
  { name: "right", keys: ["ArrowRight", "d", "D"] },
  { name: "interact", keys: ["e", "E", " "] },
  { name: "sprint", keys: ["Shift"] },
];

export type RoomConfig = {
  id: "hub" | SectionId;
  section?: SectionId;
  label: string;
  // axis-aligned rectangle on the floor (XZ plane)
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  // totem position (only set for section rooms)
  totem?: [number, number, number];
  // accent color for trim/lights
  accent: string;
  accentSoft: string;
};

const HUB_HALF = 9;
const ROOM_HALF = 9;
const CORRIDOR_HALF_WIDTH = 2.5;
const CORRIDOR_LEN = 7; // distance between hub edge and room edge
const ROOM_OFFSET = HUB_HALF + CORRIDOR_LEN + ROOM_HALF; // center distance from origin

/**
 * Layout (top-down, +Z = north):
 *
 *                 [ABOUT]   (+Z)
 *                    |
 *   [CONTACT] --- [HUB] --- [EXPERIENCE]
 *                    |
 *                 [PROJECTS] (-Z)
 */
export const HUB_CENTER: [number, number, number] = [0, 0, 0];

export const ROOMS: RoomConfig[] = [
  {
    id: "hub",
    label: "Origin",
    minX: -HUB_HALF,
    maxX: HUB_HALF,
    minZ: -HUB_HALF,
    maxZ: HUB_HALF,
    accent: "#a78bfa",
    accentSoft: "#7c3aed",
  },
  // Corridors (no totem, no walls — just floor regions)
  {
    id: "hub",
    label: "Corridor N",
    minX: -CORRIDOR_HALF_WIDTH,
    maxX: CORRIDOR_HALF_WIDTH,
    minZ: HUB_HALF,
    maxZ: HUB_HALF + CORRIDOR_LEN,
    accent: "#a78bfa",
    accentSoft: "#7c3aed",
  },
  {
    id: "hub",
    label: "Corridor S",
    minX: -CORRIDOR_HALF_WIDTH,
    maxX: CORRIDOR_HALF_WIDTH,
    minZ: -(HUB_HALF + CORRIDOR_LEN),
    maxZ: -HUB_HALF,
    accent: "#a78bfa",
    accentSoft: "#7c3aed",
  },
  {
    id: "hub",
    label: "Corridor E",
    minX: HUB_HALF,
    maxX: HUB_HALF + CORRIDOR_LEN,
    minZ: -CORRIDOR_HALF_WIDTH,
    maxZ: CORRIDOR_HALF_WIDTH,
    accent: "#a78bfa",
    accentSoft: "#7c3aed",
  },
  {
    id: "hub",
    label: "Corridor W",
    minX: -(HUB_HALF + CORRIDOR_LEN),
    maxX: -HUB_HALF,
    minZ: -CORRIDOR_HALF_WIDTH,
    maxZ: CORRIDOR_HALF_WIDTH,
    accent: "#a78bfa",
    accentSoft: "#7c3aed",
  },
  // Themed rooms
  {
    id: "about",
    section: "about",
    label: "Codex Chamber",
    minX: -ROOM_HALF,
    maxX: ROOM_HALF,
    minZ: ROOM_OFFSET - ROOM_HALF,
    maxZ: ROOM_OFFSET + ROOM_HALF,
    totem: [0, 0, ROOM_OFFSET],
    accent: "#c084fc",
    accentSoft: "#7c3aed",
  },
  {
    id: "experience",
    section: "experience",
    label: "Forge of Trials",
    minX: ROOM_OFFSET - ROOM_HALF,
    maxX: ROOM_OFFSET + ROOM_HALF,
    minZ: -ROOM_HALF,
    maxZ: ROOM_HALF,
    totem: [ROOM_OFFSET, 0, 0],
    accent: "#fbbf24",
    accentSoft: "#b45309",
  },
  {
    id: "projects",
    section: "projects",
    label: "Project Gallery",
    minX: -ROOM_HALF,
    maxX: ROOM_HALF,
    minZ: -(ROOM_OFFSET + ROOM_HALF),
    maxZ: -(ROOM_OFFSET - ROOM_HALF),
    totem: [0, 0, -ROOM_OFFSET],
    accent: "#22d3ee",
    accentSoft: "#0e7490",
  },
  {
    id: "contact",
    section: "contact",
    label: "Portal Sanctum",
    minX: -(ROOM_OFFSET + ROOM_HALF),
    maxX: -(ROOM_OFFSET - ROOM_HALF),
    minZ: -ROOM_HALF,
    maxZ: ROOM_HALF,
    totem: [-ROOM_OFFSET, 0, 0],
    accent: "#f472b6",
    accentSoft: "#be185d",
  },
];

export const SECTION_ROOMS = ROOMS.filter((r) => r.section) as (RoomConfig & {
  section: SectionId;
  totem: [number, number, number];
})[];

export const ROOM_LAYOUT = {
  HUB_HALF,
  ROOM_HALF,
  CORRIDOR_HALF_WIDTH,
  CORRIDOR_LEN,
  ROOM_OFFSET,
};

/** Is (x, z) inside any walkable rectangle? */
export function isWalkable(x: number, z: number, pad = 0.4): boolean {
  for (const r of ROOMS) {
    if (
      x > r.minX + pad &&
      x < r.maxX - pad &&
      z > r.minZ + pad &&
      z < r.maxZ - pad
    ) {
      return true;
    }
  }
  return false;
}
