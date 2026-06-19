import { useEffect, useRef, useState } from "react";

type Line =
  | { kind: "prompt"; text: string; speed?: number }
  | { kind: "output"; text: string; delay?: number }
  | { kind: "wait"; ms: number };

type Props = {
  /** Called once the terminal finishes its scripted boot sequence. */
  onLaunch: () => void;
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
    text: "about.txt  experience.log  projects/  contact.mail  akash.exe",
  },
  { kind: "wait", ms: 300 },
  { kind: "prompt", text: "npm install", speed: 35 },
  { kind: "output", text: "" },
  { kind: "output", text: "added 1337 packages, audited 2048 packages in 2s" },
  { kind: "output", text: "found 0 vulnerabilities  ✨" },
  { kind: "wait", ms: 250 },
  { kind: "prompt", text: "npm run dev", speed: 45 },
  { kind: "output", text: "" },
  { kind: "output", text: "> portfolio@2.6.0 dev" },
  { kind: "output", text: "> vite --open" },
  { kind: "wait", ms: 200 },
  { kind: "output", text: "" },
  { kind: "output", text: "  VITE v7.0.0  ready in 312 ms" },
  { kind: "output", text: "" },
  { kind: "output", text: "  ➜  Local:   http://localhost:5173/" },
  { kind: "output", text: "  ➜  Network: use --host to expose" },
  { kind: "wait", ms: 250 },
  { kind: "prompt", text: "./akash.exe --launch", speed: 40 },
  { kind: "output", text: "" },
  { kind: "output", text: "[boot] loading scene: HUB_WORLD" },
  { kind: "output", text: "[boot] mounting WASD controls..." },
  { kind: "output", text: "[boot] rendering 3D portfolio room ✓" },
  { kind: "wait", ms: 350 },
  { kind: "output", text: "→ launching akash.exe ..." },
];

export default function Terminal({ onLaunch }: Props) {
  const [history, setHistory] = useState<Array<{ kind: string; text: string }>>([]);
  const [typing, setTyping] = useState<string>("");
  const [cursorOn, setCursorOn] = useState(true);
  const [done, setDone] = useState(false);
  const launchedRef = useRef(false);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  // Drive the scripted timeline
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
      // brief pause then "launch"
      await sleep(450);
      if (cancelled || launchedRef.current) return;
      launchedRef.current = true;
      onLaunch();
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onLaunch]);

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
