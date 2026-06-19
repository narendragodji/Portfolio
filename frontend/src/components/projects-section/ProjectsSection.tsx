import { motion } from "framer-motion";

const projects = [
  {
    title: "AlertIQ — Pricing Intelligence Platform",
    desc: "Full-stack platform analyzing retailer and marketplace pricing across products, merchants, and regions. Integrated Azure SQL and external pricing APIs for real-time data ingestion and competitive benchmarking across global markets.",
    tags: ["React", "TypeScript", "FastAPI", "Python", "Azure SQL"],
    gradient: "from-violet-500/40 via-fuchsia-500/30 to-cyan-500/40",
  },
  {
    title: "RAG Sales Chatbot",
    desc: "Retrieval-Augmented Generation chatbot on sales data — lets business stakeholders query pricing trends, merchant performance, and regional benchmarks in natural language, eliminating ad-hoc analyst requests.",
    tags: ["LLMs", "RAG", "Azure OpenAI", "Python", "FastAPI"],
    gradient: "from-cyan-500/40 via-blue-500/30 to-indigo-500/40",
  },
  {
    title: "Device Sentiment Dashboard",
    desc: "End-to-end sentiment analysis pipeline spanning Microsoft devices and 7 OEM partners across DM7 and global markets — transforming raw customer reviews into actionable product insights at scale.",
    tags: ["NLP", "Selenium", "Pandas", "Power BI", "Python"],
    gradient: "from-pink-500/40 via-rose-500/30 to-orange-500/40",
  },
  {
    title: "Aspect-Based Sentiment Engine",
    desc: "NLP component that tags large-scale review data across dimensions like performance, battery life, and design — powering structured insights that informed product and market decisions across a multi-OEM ecosystem.",
    tags: ["NLP", "Python", "NumPy", "Matplotlib"],
    gradient: "from-emerald-500/40 via-teal-500/30 to-cyan-500/40",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-pink-400">
              04 — Selected work
            </span>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold">
              Recent <span className="gradient-text">projects</span>
            </h2>
          </div>
          <p className="text-white/60 max-w-md">
            Real systems shipped at Mu Sigma — pricing intelligence, RAG
            chatbots, and NLP pipelines built for non-technical stakeholders.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl overflow-hidden glass cursor-pointer"
            >
              <div
                className={`aspect-[16/10] bg-gradient-to-br ${p.gradient} relative overflow-hidden`}
              >
                <motion.div
                  className="absolute inset-0 grid-bg opacity-40"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-7xl font-bold text-white/10 select-none">
                    0{i + 1}
                  </span>
                </motion.div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/70 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white">→</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
