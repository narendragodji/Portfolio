import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  onZoomDone: () => void;
};

/**
 * Gesture-driven landing scene.
 *
 *   /public/Desktop-Landing.png   (1403 x 817 — desk + baked-in wallpaper)
 *
 * A single scroll-down (wheel tick / trackpad swipe / touch swipe up) plays
 * the zoom-in animation. Scrolling up *during* the animation reverses it
 * back to the resting desk shot. Once the zoom-in animation completes we
 * hand off to the 3D game world.
 *
 * The component is fixed-positioned and intercepts native scroll, so the
 * page itself never scrolls — every gesture is interpreted as a discrete
 * forward/back command.
 *
 * If the visual zoom-origin isn't precisely on the monitor, tune
 * SCREEN_RECT below (values are % of the image's display box).
 */
const IMG_W = 1403;
const IMG_H = 817;

const SCREEN_RECT = {
  left: "32%",
  top: "22%",
  width: "37%",
  height: "42%",
};

/** Minimum wheel-delta to count as a directional intent. */
const WHEEL_THRESHOLD = 12;
/** Minimum touch-swipe distance to count as a directional intent. */
const TOUCH_THRESHOLD = 30;

export default function LandingDesk({ onZoomDone }: Props) {
  const [imgOk, setImgOk] = useState(true);
  const [triggered, setTriggered] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    // Prevent the page underneath from scrolling.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Don't trap input once the hand-off has happened.
      if (firedRef.current) return;
      e.preventDefault();
      if (e.deltaY > WHEEL_THRESHOLD) setTriggered(true);
      else if (e.deltaY < -WHEEL_THRESHOLD) setTriggered(false);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (firedRef.current) return;
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchStartY - y; // positive = swipe up = scroll down
      if (dy > TOUCH_THRESHOLD) setTriggered(true);
      else if (dy < -TOUCH_THRESHOLD) setTriggered(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (firedRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        setTriggered(true);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        setTriggered(false);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-20 overflow-hidden bg-black select-none">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Zoomable stage — origin = center of the monitor */}
        <motion.div
          className="relative will-change-transform"
          style={{
            width: `min(100vw, calc(100vh * ${IMG_W} / ${IMG_H}))`,
            aspectRatio: `${IMG_W} / ${IMG_H}`,
            transformOrigin: `calc(${SCREEN_RECT.left} + ${SCREEN_RECT.width} / 2) calc(${SCREEN_RECT.top} + ${SCREEN_RECT.height} / 2)`,
          }}
          animate={{
            scale: triggered ? 11 : 1,
            filter: triggered ? "brightness(1.4)" : "brightness(1)",
          }}
          transition={{
            duration: 1.3,
            ease: triggered ? [0.7, 0, 0.84, 0] : [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => {
            if (triggered && !firedRef.current) {
              firedRef.current = true;
              onZoomDone();
            }
          }}
        >
          {/* Combined desk + monitor artwork (single image) */}
          {imgOk ? (
            <img
              src="/Desktop-Landing.png"
              alt="Cozy desk landing"
              draggable={false}
              onError={() => setImgOk(false)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />
          ) : (
            <MissingImage
              label="Desktop-Landing.png"
              hint="Save the desk illustration to frontend/public/Desktop-Landing.png"
            />
          )}

          {/* Monitor flourishes (scanlines + glow) on the baked-in wallpaper */}
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
            animate={{ opacity: triggered ? 1 : 0.55 }}
            transition={{ duration: 0.6 }}
          >
            {/* CRT scanlines */}
            <div
              className="absolute inset-0 mix-blend-overlay opacity-25"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
              }}
            />
            {/* Subtle glare sweep */}
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
        animate={{ opacity: triggered ? 1 : 0 }}
        transition={{
          duration: 0.55,
          delay: triggered ? 0.78 : 0,
          ease: "easeIn",
        }}
      />

      {/* Scroll hint */}
      <motion.div
        animate={{ opacity: triggered ? 0 : 1 }}
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
