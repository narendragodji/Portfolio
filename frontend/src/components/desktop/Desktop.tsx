import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Game from "../game/Game";
import type { SectionId } from "../../data/profile";
import Window from "./Window";
import Terminal from "./Terminal";
import { SectionApp, WINDOW_META } from "./SectionApps";

/* ----------------------------- Window state ------------------------------ */

type WindowId = "terminal" | "game" | SectionId;

type WindowState = {
  id: WindowId;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

/* Default geometries — rough percentages of the desktop region, but resolved
 * to pixels when the window first opens (Window stores pixel positions). */
const TERMINAL_INITIAL = { x: 80, y: 80, w: 640, h: 360 };
const GAME_INITIAL = { x: 130, y: 70, w: 980, h: 600 };
const SECTION_INITIAL: Record<SectionId, { x: number; y: number; w: number; h: number }> = {
  about: { x: 200, y: 130, w: 720, h: 520 },
  experience: { x: 240, y: 160, w: 720, h: 520 },
  projects: { x: 280, y: 180, w: 760, h: 540 },
  contact: { x: 320, y: 210, w: 700, h: 480 },
};

const TITLES: Record<WindowId, string> = {
  terminal: "akash@portfolio: ~ — bash",
  game: "akash.exe — Portfolio Hub",
  about: WINDOW_META.about.title,
  experience: WINDOW_META.experience.title,
  projects: WINDOW_META.projects.title,
  contact: WINDOW_META.contact.title,
};

const ACCENTS: Record<WindowId, string> = {
  terminal: "#34d399",
  game: "#ff66c4",
  about: WINDOW_META.about.accent,
  experience: WINDOW_META.experience.accent,
  projects: WINDOW_META.projects.accent,
  contact: WINDOW_META.contact.accent,
};

const ICONS: Record<WindowId, string> = {
  terminal: "▷_",
  game: "🎮",
  about: WINDOW_META.about.icon,
  experience: WINDOW_META.experience.icon,
  projects: WINDOW_META.projects.icon,
  contact: WINDOW_META.contact.icon,
};

/* ------------------------------ Component -------------------------------- */

export default function Desktop() {
  // Terminal starts open immediately; everything else opens on demand.
  const [windows, setWindows] = useState<WindowState[]>([
    { id: "terminal", z: 1, minimized: false, maximized: false },
  ]);
  const [zCounter, setZCounter] = useState(1);
  const [now, setNow] = useState(() => new Date());

  // Clock for the taskbar
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const openWindow = (id: WindowId) => {
    setWindows((ws) => {
      const exists = ws.find((w) => w.id === id);
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      if (exists) {
        return ws.map((w) =>
          w.id === id ? { ...w, z: nextZ, minimized: false } : w
        );
      }
      return [...ws, { id, z: nextZ, minimized: false, maximized: false }];
    });
  };

  const focusWindow = (id: WindowId) => {
    setWindows((ws) => {
      const w = ws.find((x) => x.id === id);
      if (!w || w.z === zCounter) return ws;
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      return ws.map((x) => (x.id === id ? { ...x, z: nextZ } : x));
    });
  };

  const closeWindow = (id: WindowId) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  };

  const toggleMin = (id: WindowId) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  };

  const toggleMax = (id: WindowId) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    );
  };

  const isOpen = (id: WindowId) => windows.some((w) => w.id === id);

  // When terminal finishes the boot script, "launch" the game window.
  const handleLaunchGame = () => {
    openWindow("game");
  };

  // Game (embedded) requests opening a section
  const handleSectionOpen = (id: SectionId) => {
    openWindow(id);
  };

  // Game window is the focused/foreground window? Pause the player otherwise
  // so WASD doesn't move the avatar when a section window is on top.
  const topWindow = windows
    .filter((w) => !w.minimized)
    .sort((a, b) => b.z - a.z)[0];
  const gamePaused = topWindow?.id !== "game";

  const clockText = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-10 overflow-hidden select-none">
      {/* Wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, #2a0f3f 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, #0f2a3f 0%, transparent 55%), linear-gradient(135deg, #06060a, #0d0716 60%, #06060a)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Brand mark — bottom-right, like a faint OS watermark */}
      <div className="absolute bottom-12 right-5 text-right pointer-events-none">
        <div className="text-white/40 font-mono text-[11px] tracking-[0.4em] uppercase">
          akashOS
        </div>
        <div className="text-white/25 font-mono text-[10px]">
          v2.6 — build {now.getFullYear()}
        </div>
      </div>

      {/* Desktop icons */}
      <DesktopIcons
        onOpen={openWindow}
        isOpen={isOpen}
      />

      {/* Window region: avoids the taskbar */}
      <div className="absolute inset-0 bottom-9">
        <AnimatePresence>
          {windows.map((w) => (
            <Window
              key={w.id}
              id={w.id}
              title={TITLES[w.id]}
              icon={ICONS[w.id]}
              accent={ACCENTS[w.id]}
              initial={initialFor(w.id)}
              z={w.z}
              visible={!w.minimized}
              maximized={w.maximized}
              onFocus={() => focusWindow(w.id)}
              onClose={() => closeWindow(w.id)}
              onMinimize={() => toggleMin(w.id)}
              onToggleMaximize={() => toggleMax(w.id)}
              bodyClassName={w.id === "terminal" ? "bg-black" : ""}
            >
              {w.id === "terminal" && <Terminal onLaunch={handleLaunchGame} />}
              {w.id === "game" && (
                <Game
                  autoStart
                  embedded
                  paused={gamePaused}
                  onSectionOpen={handleSectionOpen}
                />
              )}
              {w.id !== "terminal" && w.id !== "game" && (
                <SectionApp id={w.id as SectionId} />
              )}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Taskbar */}
      <div
        className="absolute left-0 right-0 bottom-0 h-9 flex items-center gap-2 px-2 z-50"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,32,0.85), rgba(8,6,18,0.95))",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          className="px-3 h-7 rounded font-mono text-[11px] tracking-[0.25em] text-pink-200 hover:bg-pink-400/10 transition"
          style={{ border: "1px solid rgba(255,102,196,0.35)" }}
        >
          ◆ AKASH
        </button>

        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                if (w.minimized) toggleMin(w.id);
                else focusWindow(w.id);
              }}
              className={`px-2.5 h-7 rounded flex items-center gap-1.5 font-mono text-[11px] transition ${
                topWindow?.id === w.id && !w.minimized
                  ? "bg-white/10 text-white"
                  : "bg-white/[0.03] text-white/70 hover:bg-white/[0.07]"
              }`}
              style={{
                borderBottom: `2px solid ${
                  topWindow?.id === w.id && !w.minimized
                    ? ACCENTS[w.id]
                    : "transparent"
                }`,
              }}
            >
              <span style={{ color: ACCENTS[w.id] }}>{ICONS[w.id]}</span>
              <span className="truncate max-w-[140px]">
                {shortTitle(TITLES[w.id])}
              </span>
            </button>
          ))}
        </div>

        <div className="text-white/70 text-[11px] font-mono pr-2">
          {clockText}
        </div>
      </div>
    </div>
  );
}

function initialFor(id: WindowId) {
  if (id === "terminal") return TERMINAL_INITIAL;
  if (id === "game") return GAME_INITIAL;
  return SECTION_INITIAL[id as SectionId];
}

function shortTitle(t: string) {
  const i = t.indexOf("—");
  return (i >= 0 ? t.slice(0, i) : t).trim();
}

/* --------------------------- Desktop icons ------------------------------- */

function DesktopIcons({
  onOpen,
  isOpen,
}: {
  onOpen: (id: WindowId) => void;
  isOpen: (id: WindowId) => boolean;
}) {
  const icons: Array<{ id: WindowId; label: string; glyph: string }> = [
    { id: "terminal", label: "Terminal", glyph: "▷_" },
    { id: "game", label: "akash.exe", glyph: "🎮" },
    { id: "about", label: "About.txt", glyph: "📝" },
    { id: "experience", label: "Resume.log", glyph: "📜" },
    { id: "projects", label: "Projects", glyph: "📁" },
    { id: "contact", label: "Mail", glyph: "✉️" },
  ];

  return (
    <div className="absolute top-4 left-4 grid gap-3" style={{ gridTemplateColumns: "repeat(1, 80px)" }}>
      {icons.map((ic) => (
        <button
          key={ic.id}
          onDoubleClick={() => onOpen(ic.id)}
          onClick={(e) => {
            // single-click "selects" by adding a subtle outline; double-click opens
            (e.currentTarget as HTMLElement).blur();
            onOpen(ic.id);
          }}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-md hover:bg-white/[0.06] focus:bg-white/[0.10] transition ${
            isOpen(ic.id) ? "ring-1 ring-pink-400/30" : ""
          }`}
          title={`Open ${ic.label}`}
        >
          <span className="text-2xl leading-none">{ic.glyph}</span>
          <span className="text-[10px] text-white/85 font-mono">
            {ic.label}
          </span>
        </button>
      ))}
    </div>
  );
}
