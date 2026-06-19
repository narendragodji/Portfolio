import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type WindowSize = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Props = {
  id: string;
  title: string;
  icon?: ReactNode;
  /** Initial geometry (px). */
  initial: WindowSize;
  /** z-index for stacking. */
  z: number;
  /** Called when the user focuses the window (mousedown anywhere on it). */
  onFocus: () => void;
  /** Called when the close (×) button is pressed. */
  onClose: () => void;
  /** Optional minimize handler. If omitted, the minimize button is hidden. */
  onMinimize?: () => void;
  /** Accent colour for the title-bar dot/glow. */
  accent?: string;
  /** When false the window is rendered but visually hidden (minimized). */
  visible?: boolean;
  /** When true the window fills the entire desktop region. */
  maximized?: boolean;
  /** Toggle maximized state. If omitted, maximize button is hidden. */
  onToggleMaximize?: () => void;
  /** Window body. */
  children: ReactNode;
  /** Extra className for the body. */
  bodyClassName?: string;
};

/**
 * Stylised OS-style window: title bar with traffic-light buttons, draggable
 * by its title bar, click-to-focus to bring to front.
 */
export default function Window({
  id,
  title,
  icon,
  initial,
  z,
  onFocus,
  onClose,
  onMinimize,
  accent = "#ff66c4",
  visible = true,
  maximized = false,
  onToggleMaximize,
  children,
  bodyClassName = "",
}: Props) {
  const [pos, setPos] = useState({ x: initial.x, y: initial.y });
  const sizeRef = useRef({ w: initial.w, h: initial.h });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  // Drag handlers (mouse + touch)
  useEffect(() => {
    const onMove = (clientX: number, clientY: number) => {
      const d = dragRef.current;
      if (!d) return;
      setPos({ x: clientX - d.dx, y: clientY - d.dy });
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const stop = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  const startDrag = (clientX: number, clientY: number) => {
    if (maximized) return;
    dragRef.current = { dx: clientX - pos.x, dy: clientY - pos.y };
  };

  const geometry = maximized
    ? { left: 0, top: 0, width: "100%", height: "100%" }
    : { left: pos.x, top: pos.y, width: sizeRef.current.w, height: sizeRef.current.h };

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 0.92, y: 14 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.7,
        y: visible ? 0 : 80,
      }}
      exit={{ opacity: 0, scale: 0.9, y: 14, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/10"
      style={{
        ...geometry,
        zIndex: z,
        background: "rgba(8, 8, 16, 0.92)",
        backdropFilter: "blur(14px)",
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${accent}22`,
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing select-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
        onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) startDrag(t.clientX, t.clientY);
        }}
        onDoubleClick={onToggleMaximize}
      >
        <div className="flex items-center gap-2 text-white/90 text-xs font-mono truncate">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
          />
          {icon && <span className="text-[13px] leading-none">{icon}</span>}
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onMinimize && (
            <TrafficButton
              color="#facc15"
              label="–"
              ariaLabel="Minimize window"
              onClick={onMinimize}
            />
          )}
          {onToggleMaximize && (
            <TrafficButton
              color="#22c55e"
              label={maximized ? "❐" : "▢"}
              ariaLabel="Maximize window"
              onClick={onToggleMaximize}
            />
          )}
          <TrafficButton
            color="#ef4444"
            label="×"
            ariaLabel="Close window"
            onClick={onClose}
          />
        </div>
      </div>

      {/* Body */}
      <div
        className={`relative flex-1 overflow-hidden ${bodyClassName}`}
        data-scrollable="true"
      >
        {children}
      </div>
    </motion.div>
  );
}

function TrafficButton({
  color,
  label,
  ariaLabel,
  onClick,
}: {
  color: string;
  label: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-black/70 font-bold hover:brightness-110 active:scale-95 transition"
      style={{ background: color, boxShadow: `0 0 6px ${color}66` }}
    >
      <span className="leading-none translate-y-[-1px]">{label}</span>
    </button>
  );
}
