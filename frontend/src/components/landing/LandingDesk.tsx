import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  /** True when the desk should be zoomed all the way into the monitor. */
  zoomed: boolean;
  /** When true the desk is fully hidden (we're in the desktop OS). */
  hidden: boolean;
  /** Fired when the scale animation finishes in either direction. */
  onAnimationDone: () => void;
};

/**
 * Visual landing scene. The desk image is rendered full-bleed; when
 * `zoomed` becomes true the stage scales 1 → 11 with its origin at the
 * monitor centre, simulating a dive through the screen. When `hidden`
 * becomes true the component is removed from the visual tree so the
 * desktop OS underneath is interactive.
 *
 *   /public/Desktop-Landing.jpg  (1403 x 817 — desk + baked-in wallpaper)
 *
 * Gesture handling lives in the parent (App.tsx).
 */
const IMG_W = 1403;
const IMG_H = 817;

const SCREEN_RECT = {
  left: "32%",
  top: "22%",
  width: "37%",
  height: "42%",
};

export default function LandingDesk({ zoomed, hidden, onAnimationDone }: Props) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div
      className="fixed inset-0 z-20 overflow-hidden bg-black select-none"
      style={{
        display: hidden ? "none" : "block",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Zoomable stage — origin = centre of the monitor screen */}
        <motion.div
          className="relative will-change-transform"
          style={{
            width: `min(100vw, calc(100vh * ${IMG_W} / ${IMG_H}))`,
            aspectRatio: `${IMG_W} / ${IMG_H}`,
            transformOrigin: `calc(${SCREEN_RECT.left} + ${SCREEN_RECT.width} / 2) calc(${SCREEN_RECT.top} + ${SCREEN_RECT.height} / 2)`,
          }}
          animate={{
            scale: zoomed ? 11 : 1,
            filter: zoomed ? "brightness(1.4)" : "brightness(1)",
          }}
          transition={{
            duration: 1.3,
            ease: zoomed ? [0.7, 0, 0.84, 0] : [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={onAnimationDone}
        >
          {/* Combined desk + monitor artwork (single image) */}
          {imgOk ? (
            <img
              src="/Desktop-Landing.jpg"
              alt="Cozy desk landing"
              draggable={false}
              onError={() => setImgOk(false)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />
          ) : (
            <MissingImage
              label="Desktop-Landing.jpg"
              hint="Save the desk illustration to frontend/public/Desktop-Landing.jpg"
            />
          )}

          {/* Monitor flourishes on top of the baked-in wallpaper */}
          <motion.div
            className="absolute pointer-events-none overflow-hidden"
            style={{
              left: SCREEN_RECT.left,
              top: SCREEN_RECT.top,
              width: SCREEN_RECT.width,
              height: SCREEN_RECT.height,
              boxShadow:
                "0 0 40px rgba(255,102,196,0.35), inset 0 0 30px rgba(255,102,196,0.12)",
            }}
            animate={{ opacity: zoomed ? 1 : 0.6 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="absolute inset-0 mix-blend-overlay opacity-25"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, transparent 38%, rgba(255,255,255,0.10) 50%, transparent 62%)",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Fade-to-dark veil during the late part of the zoom */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: zoomed ? 1 : 0 }}
        transition={{
          duration: 0.55,
          delay: zoomed ? 0.78 : 0,
          ease: "easeIn",
        }}
      />

      {/* Scroll hint */}
      <motion.div
        animate={{ opacity: zoomed ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-2 font-mono text-white/75"
      >
        <span className="text-[10px] uppercase tracking-[0.45em]">
          scroll to dive in
        </span>
        <motion.span
          animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="text-lg"
        >
          ↓
        </motion.span>
      </motion.div>
    </div>
  );
}

function MissingImage({ label, hint }: { label: string; hint: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white/60"
      style={{ background: "linear-gradient(135deg, #1a1230 0%, #0b0816 100%)" }}
    >
      <div className="text-xs uppercase tracking-[0.4em] mb-2 text-pink-300">
        Missing asset
      </div>
      <div className="font-mono text-sm mb-1">{label}</div>
      <div className="text-xs max-w-xs">{hint}</div>
    </div>
  );
}
