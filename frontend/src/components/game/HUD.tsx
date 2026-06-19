import { motion } from "framer-motion";
import type { SectionId } from "../../data/profile";
import { SECTION_ROOMS, ROOM_LAYOUT } from "./config";

type Props = {
  nearest: SectionId | null;
  started: boolean;
  playerRef?: { current: { x: number; z: number } | null };
};

const SECTION_LABELS: Record<SectionId, string> = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  contact: "Contact",
};

export default function HUD({ nearest, started }: Props) {
  if (!started) return null;

  // Minimap dimensions
  const range = ROOM_LAYOUT.ROOM_OFFSET + ROOM_LAYOUT.ROOM_HALF + 4;
  const mapSize = 180;
  const toMap = (v: number) => (v / range) * (mapSize / 2) + mapSize / 2;

  return (
    <>
      {/* Top-left brand */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-5 left-5 z-30 select-none pointer-events-none"
      >
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-white/50">
          akash.exe — v2.6
        </div>
        <div className="font-bold text-lg">
          <span className="text-violet-300">PORTFOLIO</span>
          <span className="text-white/40"> // </span>
          <span className="text-cyan-300">HUB WORLD</span>
        </div>
      </motion.div>

      {/* Top-right controls hint */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-5 right-5 z-30 glass rounded-xl px-4 py-3 text-xs font-mono pointer-events-none"
      >
        <div className="flex items-center gap-3">
          <KeyCap>W</KeyCap>
          <KeyCap>A</KeyCap>
          <KeyCap>S</KeyCap>
          <KeyCap>D</KeyCap>
          <span className="text-white/50 ml-1">move</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <KeyCap wide>SHIFT</KeyCap>
          <span className="text-white/50">sprint</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <KeyCap>E</KeyCap>
          <span className="text-white/50">interact</span>
        </div>
      </motion.div>

      {/* Bottom-left minimap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-5 left-5 z-30 glass rounded-2xl p-3 pointer-events-none"
      >
        <div className="text-[10px] uppercase tracking-[0.4em] text-white/50 mb-2 px-1">
          Map
        </div>
        <div
          className="relative bg-black/40 rounded-lg border border-white/10"
          style={{ width: mapSize, height: mapSize }}
        >
          {/* Room blips */}
          {SECTION_ROOMS.map((r) => {
            const cx = (r.minX + r.maxX) / 2;
            const cz = (r.minZ + r.maxZ) / 2;
            const w = ((r.maxX - r.minX) / range) * (mapSize / 2);
            const h = ((r.maxZ - r.minZ) / range) * (mapSize / 2);
            return (
              <div
                key={r.section}
                className="absolute rounded-sm"
                style={{
                  left: toMap(cx) - w / 2,
                  top: mapSize - toMap(cz) - h / 2,
                  width: w,
                  height: h,
                  background: r.accent + "33",
                  border: `1px solid ${r.accent}`,
                }}
                title={SECTION_LABELS[r.section!]}
              />
            );
          })}
          {/* Hub */}
          <div
            className="absolute rounded-sm border border-white/40 bg-white/5"
            style={{
              left: toMap(-ROOM_LAYOUT.HUB_HALF),
              top: mapSize - toMap(ROOM_LAYOUT.HUB_HALF),
              width:
                ((ROOM_LAYOUT.HUB_HALF * 2) / range) * (mapSize / 2),
              height:
                ((ROOM_LAYOUT.HUB_HALF * 2) / range) * (mapSize / 2),
            }}
          />
          {/* Player marker (always center for now — visual cue) */}
          <PlayerDot mapSize={mapSize} range={range} />
        </div>
      </motion.div>

      {/* Bottom prompt */}
      {nearest && (
        <motion.div
          key={nearest}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 glass rounded-full px-6 py-3 flex items-center gap-3 pointer-events-none"
        >
          <KeyCap>E</KeyCap>
          <span className="text-sm">
            Enter <span className="font-bold gradient-text">{SECTION_LABELS[nearest]}</span>
          </span>
        </motion.div>
      )}
    </>
  );
}

function KeyCap({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md bg-white/10 border border-white/20 text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.4)] ${
        wide ? "px-2 min-w-[3rem]" : "min-w-[1.6rem]"
      } h-7 text-xs font-bold`}
    >
      {children}
    </span>
  );
}

/** Live player dot pulled from a global ref written by Player. */
function PlayerDot({ mapSize, range }: { mapSize: number; range: number }) {
  // Driven by CSS animation only; actual live tracking happens via an effect
  // in the Game component below using a small DOM update loop.
  return (
    <div
      id="player-dot"
      className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]"
      style={{
        left: mapSize / 2 - 4,
        top: mapSize / 2 - 4,
        transition: "left 90ms linear, top 90ms linear",
      }}
    />
  );
}
