import { motion, useMotionValue, useTransform } from "framer-motion";
import type { MouseEvent } from "react";

const skills = [
  { name: "Python", level: 95, color: "from-yellow-400 to-amber-500" },
  { name: "NLP", level: 90, color: "from-violet-400 to-purple-500" },
  { name: "LLMs / RAG", level: 88, color: "from-pink-400 to-rose-500" },
  { name: "Prompt Engineering", level: 90, color: "from-fuchsia-400 to-pink-500" },
  { name: "Pandas / NumPy", level: 92, color: "from-blue-400 to-indigo-500" },
  { name: "FastAPI", level: 85, color: "from-emerald-400 to-teal-500" },
  { name: "React / TypeScript", level: 82, color: "from-cyan-400 to-blue-500" },
  { name: "Selenium", level: 88, color: "from-lime-400 to-green-500" },
  { name: "Azure OpenAI", level: 82, color: "from-sky-400 to-cyan-500" },
  { name: "Power BI", level: 80, color: "from-orange-400 to-red-500" },
  { name: "SQL / Azure SQL", level: 80, color: "from-indigo-400 to-purple-500" },
  { name: "Machine Learning", level: 82, color: "from-rose-400 to-fuchsia-500" },
];

function SkillCard({ skill, index }: { skill: (typeof skills)[number]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.6 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="glass rounded-2xl p-6 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{skill.name}</h3>
        <span className="text-sm text-white/40 font-mono">{skill.level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 + 0.3, duration: 1.1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${skill.color}`}
        />
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            03 — Skills
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold">
            Tools of the <span className="gradient-text">trade</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            The stack I lean on day-to-day. Hover the cards — they tilt in 3D.
          </p>
        </motion.div>

        <div className="perspective grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((s, i) => (
            <SkillCard key={s.name} skill={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
