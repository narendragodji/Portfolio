import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import LandingDesk from "./landing/LandingDesk";
import Desktop from "./desktop/Desktop";

type Target = "desk" | "desktop";

/** Minimum wheel-delta to count as a directional intent. */
const WHEEL_THRESHOLD = 12;
/** Minimum touch-swipe distance (px) to count as a directional intent. */
const TOUCH_THRESHOLD = 30;

export default function App() {
  const [target, setTarget] = useState<Target>("desk");
  const [animating, setAnimating] = useState(false);

  // "Fully in the OS desktop" = target is desktop AND no animation in flight.
  const inDesktop = target === "desktop" && !animating;
  // Desktop is mounted whenever we're going toward it, in it, or animating
  // back to the desk (so it stays visible underneath while the desk shrinks).
  const mountDesktop = target === "desktop" || animating;

  const targetRef = useRef(target);
  targetRef.current = target;
  const animatingRef = useRef(animating);
  animatingRef.current = animating;

  // Lock the page from scrolling — gestures drive zoom in/out only.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Returns true if the gesture originated inside an element that should
  // keep its own native scroll (e.g. a window's content body).
  const isInsideScrollable = (eventTarget: EventTarget | null) => {
    let el = eventTarget as HTMLElement | null;
    while (el) {
      if (el.dataset && el.dataset.scrollable === "true") return true;
      el = el.parentElement;
    }
    return false;
  };

  const requestForward = () => {
    if (animatingRef.current) return;
    if (targetRef.current === "desk") {
      setAnimating(true);
      setTarget("desktop");
    }
  };

  const requestBackward = () => {
    if (animatingRef.current) return;
    if (targetRef.current === "desktop") {
      setAnimating(true);
      setTarget("desk");
    }
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isInsideScrollable(e.target)) return;
      e.preventDefault();
      if (e.deltaY > WHEEL_THRESHOLD) requestForward();
      else if (e.deltaY < -WHEEL_THRESHOLD) requestBackward();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isInsideScrollable(e.target)) return;
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchStartY - y; // swipe up = positive
      if (dy > TOUCH_THRESHOLD) requestForward();
      else if (dy < -TOUCH_THRESHOLD) requestBackward();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <>
      {/* OS desktop lives underneath. Mounted while transitioning so it's
          visible behind the zoom-out fade. */}
      {mountDesktop && <Desktop />}

      {/* Landing desk stays mounted (just hidden via CSS) so re-entering
          from the desktop can animate the scale back down from 11 → 1. */}
      <LandingDesk
        zoomed={target === "desktop"}
        hidden={inDesktop}
        onAnimationDone={() => setAnimating(false)}
      />

      {/* Quick fade-in flash once the desktop is revealed */}
      <AnimatePresence>
        {inDesktop && (
          <motion.div
            key="flash"
            className="fixed inset-0 z-30 bg-black pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
