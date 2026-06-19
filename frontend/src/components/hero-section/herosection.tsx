import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import Scene3D from "./Scene3D";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* 3D background canvas */}
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <Scene3D />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-[1]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06060a] pointer-events-none z-[2]" />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open to Business Analyst &amp; Generative AI roles
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            Turning <span className="gradient-text">messy data</span>
            <br />
            into clear <span className="gradient-text">decisions</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 text-base md:text-xl text-white/60 max-w-2xl mx-auto"
          >
            I'm <span className="text-white">Akash Singh</span> — a Decision
            Scientist at <span className="text-white">Mu Sigma</span> building
            NLP pipelines, RAG chatbots, and full-stack analytics platforms that
            put applied AI in the hands of business stakeholders.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-white/60"
          >
            {["NLP", "LLMs", "RAG", "Python", "FastAPI", "React"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full glass border border-white/10"
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 font-medium glow"
            >
              View my work
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-full glass font-medium"
            >
              Get in touch
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs"
        >
          <span className="uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
