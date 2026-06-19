import { motion } from "framer-motion";

const stats = [
  { value: "2+", label: "Years @ Mu Sigma" },
  { value: "7+", label: "OEMs analyzed" },
  { value: "100s", label: "Reports automated" },
  { value: "RAG", label: "Chatbots shipped" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-6 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-violet-400">
            01 — About
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
            Applied AI at the
            <br />
            intersection of <span className="gradient-text">data &amp; language</span>.
          </h2>
          <p className="mt-6 text-white/60 text-lg leading-relaxed">
            Decision Scientist at Mu Sigma, working where data engineering, NLP,
            and LLM-powered automation meet. I build end-to-end systems — from
            scraping and sentiment pipelines to RAG-based chatbots and
            full-stack analytics dashboards — that translate messy data into
            clear business decisions.
          </p>
          <p className="mt-4 text-white/50 leading-relaxed">
            Over the past ~2 years I've shipped projects that automate hundreds
            of manual reporting hours, surface competitive pricing intelligence
            for global markets, and bring natural-language interfaces to sales
            analytics.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass rounded-2xl p-5"
              >
                <div className="text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-white/50 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: -25 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="perspective"
        >
          <motion.div
            whileHover={{ rotateY: 8, rotateX: -6 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="glass rounded-3xl p-8 glow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-white/40 ml-auto font-mono">
                akash.py
              </span>
            </div>
            <pre className="text-sm font-mono leading-relaxed text-white/80 whitespace-pre-wrap">
{`akash = {
    "role":     "Decision Scientist",
    "company":  "Mu Sigma Inc.",
    "location": "Bangalore, India",
    "stack":    ["Python", "FastAPI", "React",
                 "LLMs", "RAG", "Pandas"],
    "focus":    ["NLP", "Generative AI",
                 "Applied ML"],
    "open_to":  "BA & GenAI Engineer roles",
}`}
            </pre>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
