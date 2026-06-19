import { useEffect, useRef, useState } from "react";
import type { SectionId } from "../../data/profile";

type Line =
  | { kind: "prompt"; text: string; speed?: number }
  | { kind: "output"; text: string; delay?: number }
  | { kind: "wait"; ms: number }
  | { kind: "open"; section: SectionId };

type Props = {
  /** Called once the terminal finishes its scripted boot sequence. */
  onLaunch: () => void;
  /** Called when the script wants the desktop to open a section window. */
  onOpenSection?: (id: SectionId) => void;
};

/**
 * Fake terminal that auto-types a boot sequence and then "launches" the
 * portfolio app. The whole thing runs on a timeline so it feels like a
 * stage-managed reveal rather than a real shell.
 */
const PROMPT = "akash@portfolio:~$ ";

const SCRIPT: Line[] = [
  { kind: "output", text: "Welcome to akashOS [v2.6.1]  —  type 'help' for commands.", delay: 200 },
  { kind: "output", text: "Last login: " + new Date().toUTCString() },
  { kind: "wait", ms: 350 },
  { kind: "prompt", text: "cd portfolio", speed: 55 },
  { kind: "output", text: "" },
  { kind: "prompt", text: "ls", speed: 55 },
  {
    kind: "output",
    text: "about.txt  experience.log  projects/  contact.mail",
  },
  { kind: "wait", ms: 350 },

  /* --- open each section window one by one --- */
  { kind: "prompt", text: "open about.txt", speed: 50 },
  { kind: "output", text: "→ launching About.txt …" },
  { kind: "open", section: "about" },
  { kind: "wait", ms: 650 },

  { kind: "prompt", text: "open experience.log", speed: 50 },
  { kind: "output", text: "→ launching Resume.log …" },
  { kind: "open", section: "experience" },
  { kind: "wait", ms: 650 },

  { kind: "prompt", text: "open projects/", speed: 50 },
  { kind: "output", text: "→ launching Projects …" },
  { kind: "open", section: "projects" },
  { kind: "wait", ms: 650 },

  { kind: "prompt", text: "open contact.mail", speed: 50 },
  { kind: "output", text: "→ launching Mail …" },
  { kind: "open", section: "contact" },
  { kind: "wait", ms: 450 },

  { kind: "output", text: "" },
  { kind: "output", text: "All windows ready. Type 'help' or click around." },
];

export default function Terminal({ onLaunch, onOpenSection }: Props) {
  const [history, setHistory] = useState<Array<{ kind: string; text: string }>>([]);
  const [typing, setTyping] = useState<string>("");
  const [cursorOn, setCursorOn] = useState(true);
  const [done, setDone] = useState(false);
  const launchedRef = useRef(false);

  // Keep latest callbacks in refs so the script effect doesn't restart when
  // the parent re-creates them after launching.
  const onLaunchRef = useRef(onLaunch);
  onLaunchRef.current = onLaunch;
  const onOpenSectionRef = useRef(onOpenSection);
  onOpenSectionRef.current = onOpenSection;

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  // Drive the scripted timeline (runs exactly once on mount)
  useEffect(() => {
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timers.push(id);
      });

    const run = async () => {
      for (const line of SCRIPT) {
        if (cancelled) return;
        if (line.kind === "wait") {
          await sleep(line.ms);
        } else if (line.kind === "open") {
          onOpenSectionRef.current?.(line.section);
        } else if (line.kind === "output") {
          await sleep(line.delay ?? 90);
          if (cancelled) return;
          setHistory((h) => [...h, { kind: "output", text: line.text }]);
        } else {
          // prompt — type out char by char
          const speed = line.speed ?? 50;
          for (let i = 1; i <= line.text.length; i++) {
            if (cancelled) return;
            setTyping(line.text.slice(0, i));
            await sleep(speed + Math.random() * 30);
          }
          if (cancelled) return;
          setHistory((h) => [
            ...h,
            { kind: "prompt", text: PROMPT + line.text },
          ]);
          setTyping("");
          await sleep(250);
        }
      }
      if (cancelled) return;
      setDone(true);
      // brief pause then fire the launch callback
      await sleep(450);
      if (cancelled || launchedRef.current) return;
      launchedRef.current = true;
      onLaunchRef.current();
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className="w-full h-full overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-emerald-200/95"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(8,6,18,0.96) 100%)",
      }}
    >
      {history.map((line, i) => (
        <div
          key={i}
          className={
            line.kind === "prompt" ? "text-pink-200" : "text-emerald-200/85"
          }
        >
          {line.kind === "prompt" ? (
            <Prompt line={line.text} />
          ) : (
            <span className="whitespace-pre">{line.text || "\u00A0"}</span>
          )}
        </div>
      ))}

      {!done && (
        <div className="text-pink-200">
          <span className="text-emerald-300">{PROMPT}</span>
          <span className="whitespace-pre">{typing}</span>
          <span
            className={`inline-block w-[8px] h-[14px] align-middle ml-[1px] ${
              cursorOn ? "bg-pink-300" : "bg-transparent"
            }`}
          />
        </div>
      )}
    </div>
  );
}

function Prompt({ line }: { line: string }) {
  // Highlight the leading "user@host:~$" portion separately from the typed command.
  const idx = line.indexOf("$ ");
  if (idx === -1) return <span>{line}</span>;
  const head = line.slice(0, idx + 1);
  const tail = line.slice(idx + 1);
  return (
    <>
      <span className="text-emerald-300">{head}</span>
      <span className="text-pink-100">{tail}</span>
    </>
  );
}
