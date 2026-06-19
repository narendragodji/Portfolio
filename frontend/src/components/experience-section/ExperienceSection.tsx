import { motion } from "framer-motion";

const experiences = [
  {
    role: "Trainee Decision Scientist II",
    company: "Mu Sigma Inc.",
    period: "Jan 2026 — Present",
    location: "Bangalore, India · On-site",
    bullets: [
      "Built a full-stack analytics platform (React + FastAPI) to track MacBook pricing trends and competitive benchmarking across global markets.",
      "Engineered a RAG-based chatbot on sales data so business stakeholders can query pricing and merchant performance in natural language.",
      "Integrated Azure SQL and external pricing APIs for real-time data ingestion.",
    ],
    tags: ["React", "FastAPI", "RAG", "Azure OpenAI", "TypeScript"],
  },
  {
    role: "Trainee Decision Scientist",
    company: "Mu Sigma Inc.",
    period: "Aug 2024 — Jan 2026",
    location: "Bangalore, India · On-site",
    bullets: [
      "Built an end-to-end sentiment analysis pipeline across Microsoft devices and 7 OEMs covering DM7 + global markets.",
      "Automated review data scraping using Selenium and processed large-scale datasets with Python (Pandas, NumPy).",
      "Applied NLP techniques to deliver aspect-based sentiment tagging across performance, battery, and design.",
    ],
    tags: ["NLP", "Selenium", "Pandas", "Power BI", "Python"],
  },
];

const education = [
  {
    school: "Chandigarh University",
    degree: "Bachelor of Engineering — Computer Science",
    period: "Aug 2020 — Jul 2024",
    grade: "CGPA 7.64",
  },
];

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400">
            02 — Experience
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold">
            Where I've <span className="gradient-text">built things</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/40 to-pink-500/50" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className={`relative grid md:grid-cols-2 gap-6 md:gap-12 items-start ${
                  i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                {/* Node */}
                <span className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-3 w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 ring-4 ring-[#06060a]" />

                <div
                  className={`pl-12 md:pl-0 ${
                    i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="text-sm text-cyan-300 font-mono">
                    {exp.period}
                  </div>
                  <h3 className="mt-1 text-2xl font-bold">{exp.role}</h3>
                  <div className="text-white/60">{exp.company}</div>
                  <div className="text-xs text-white/40 mt-1">
                    {exp.location}
                  </div>
                </div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className={`glass rounded-2xl p-6 ml-12 md:ml-0 ${
                    i % 2 === 0 ? "md:ml-0" : "md:mr-0"
                  }`}
                >
                  <ul className="space-y-2 text-white/70 text-sm leading-relaxed list-disc list-outside pl-4">
                    {exp.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 text-white/70 border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
            Education
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {education.map((e) => (
              <div key={e.school} className="glass rounded-2xl p-5">
                <div className="font-semibold">{e.school}</div>
                <div className="text-sm text-white/60">{e.degree}</div>
                <div className="text-xs text-white/40 mt-1 font-mono">
                  {e.period} · {e.grade}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
