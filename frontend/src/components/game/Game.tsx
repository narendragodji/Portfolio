import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Stars } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { controlsMap } from "./config";
import Player from "./Player";
import World from "./World";
import HUD from "./HUD";
import StartScreen from "./StartScreen";
import SectionPanel from "./SectionPanel";
import type { SectionId } from "../../data/profile";

type Props = {
  /** When true, skip the StartScreen and begin the world immediately. */
  autoStart?: boolean;
  /** When true, fill the parent (no fixed positioning, no body scroll lock,
   *  no internal SectionPanel — parent handles section UI). */
  embedded?: boolean;
  /** Externally pause player movement (e.g. when an OS window has focus). */
  paused?: boolean;
  /** Called when the player presses E at a totem. Only used when embedded. */
  onSectionOpen?: (id: SectionId) => void;
};

export default function Game({
  autoStart = false,
  embedded = false,
  paused: externalPaused = false,
  onSectionOpen,
}: Props) {
  const [started, setStarted] = useState(autoStart);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [nearest, setNearest] = useState<SectionId | null>(null);

  // Lock body scroll only when running standalone (fullscreen).
  useEffect(() => {
    if (embedded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [embedded]);

  // Press Enter/Space on the in-game StartScreen
  useEffect(() => {
    if (autoStart) return;
    const onKey = (e: KeyboardEvent) => {
      if (!started && (e.key === "Enter" || e.key === " ")) {
        setStarted(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, autoStart]);

  const internalPaused = !embedded && activeSection !== null;
  const paused = externalPaused || internalPaused;

  const handleActivate = (id: SectionId) => {
    if (embedded && onSectionOpen) {
      onSectionOpen(id);
    } else {
      setActiveSection(id);
    }
  };

  const containerClass = embedded
    ? "absolute inset-0 w-full h-full overflow-hidden bg-[#04040a]"
    : "fixed inset-0 w-screen h-screen overflow-hidden bg-[#04040a]";

  return (
    <div className={containerClass}>
      <KeyboardControls map={controlsMap}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 9.5, 11], fov: 55, near: 0.1, far: 200 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#04040a"]} />
          <Stars
            radius={80}
            depth={60}
            count={3500}
            factor={4}
            saturation={0}
            fade
            speed={0.6}
          />
          <World nearest={nearest} />
          <Player
            started={started}
            paused={paused}
            onNearestChange={setNearest}
            onActivate={handleActivate}
          />
        </Canvas>
      </KeyboardControls>

      <HUD nearest={nearest} started={started} />

      {!embedded && (
        <SectionPanel
          section={activeSection}
          onClose={() => setActiveSection(null)}
        />
      )}

      <AnimatePresence>
        {!autoStart && !started && (
          <StartScreen onStart={() => setStarted(true)} />
        )}
      </AnimatePresence>
    </div>
  );
}
