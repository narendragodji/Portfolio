import { motion } from "framer-motion";

type Props = { onStart: () => void };

export default function StartScreen({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
    >
      <div className="text-center max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs uppercase tracking-[0.5em] text-violet-300 mb-4"
        >
          A portfolio · playable · 2026
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-black tracking-tight"
        >
          <span className="gradient-text">AKASH SINGH</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 text-white/60 text-lg"
        >
          Decision Scientist · NLP · LLMs · RAG —{" "}
          <span className="text-emerald-300">explore the hub world.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 grid sm:grid-cols-3 gap-3 text-sm"
        >
          <ControlRow keys={["W", "A", "S", "D"]} label="Move" />
          <ControlRow keys={["SHIFT"]} label="Sprint" />
          <ControlRow keys={["E"]} label="Interact" />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="mt-10 px-10 py-4 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 font-bold text-lg glow"
        >
          ▶  Press to begin
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-6 text-xs text-white/40"
        >
          Best experienced on desktop · headphones recommended for ambience
        </motion.div>
      </div>
    </motion.div>
  );
}

function ControlRow({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center justify-center gap-3">
      <div className="flex gap-1">
        {keys.map((k) => (
          <span
            key={k}
            className="inline-flex items-center justify-center min-w-[1.8rem] h-7 px-2 rounded-md bg-white/10 border border-white/20 text-white text-xs font-bold shadow-[inset_0_-2px_0_rgba(0,0,0,0.4)]"
          >
            {k}
          </span>
        ))}
      </div>
      <span className="text-white/60 uppercase tracking-widest text-[11px]">
        {label}
      </span>
    </div>
  );
}
