import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { profile, type SectionId } from "../../data/profile";

type Props = {
  section: SectionId | null;
  onClose: () => void;
};

const ACCENT: Record<SectionId, string> = {
  about: "#c084fc",
  experience: "#fbbf24",
  projects: "#22d3ee",
  contact: "#f472b6",
};

const TITLE: Record<SectionId, string> = {
  about: "Codex Chamber",
  experience: "Forge of Trials",
  projects: "Project Gallery",
  contact: "Portal Sanctum",
};

export default function SectionPanel({ section, onClose }: Props) {
  useEffect(() => {
    if (!section) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, onClose]);

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          key={section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-10 relative"
            style={{ boxShadow: `0 0 80px ${ACCENT[section]}55` }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{
                background: `linear-gradient(90deg, transparent, ${ACCENT[section]}, transparent)`,
              }}
            />

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div
                  className="text-xs uppercase tracking-[0.4em] mb-2"
                  style={{ color: ACCENT[section] }}
                >
                  {TITLE[section]}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold">
                  {section === "about" && "About"}
                  {section === "experience" && "Experience & Education"}
                  {section === "projects" && "Selected Projects"}
                  {section === "contact" && "Get in Touch"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {section === "about" && <AboutBody />}
            {section === "experience" && <ExperienceBody />}
            {section === "projects" && <ProjectsBody />}
            {section === "contact" && <ContactBody />}

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-white/40 flex items-center justify-between">
              <span>Press ESC or click outside to return to the world</span>
              <span className="font-mono">akash.exe</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------- Bodies ------------- */

function AboutBody() {
  return (
    <div className="space-y-6">
      <p className="text-xl gradient-text font-semibold">
        {profile.about.lead}
      </p>
      {profile.about.paragraphs.map((p, i) => (
        <p key={i} className="text-white/70 leading-relaxed">
          {p}
        </p>
      ))}

      <div>
        <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 mb-3">
          Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profile.about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-xl p-4"
            >
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-white/50 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 mb-3">
          Skills
        </h3>
        <div className="space-y-3">
          {profile.skills.map((s, i) => (
            <div key={s.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{s.name}</span>
                <span className="text-white/40 font-mono">{s.level}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.level}%` }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.9 }}
                  className="h-full bg-gradient-to-r from-violet-400 to-cyan-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceBody() {
  return (
    <div className="space-y-6">
      <div className="relative pl-6 border-l border-white/10 space-y-8">
        {profile.experience.map((e, i) => (
          <motion.div
            key={e.role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="relative"
          >
            <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-[#06060a]" />
            <div className="text-xs text-amber-300 font-mono">{e.period}</div>
            <div className="text-xl font-bold mt-1">{e.role}</div>
            <div className="text-white/60">{e.company}</div>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70 list-disc pl-5">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {e.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 text-white/70 border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 mb-3 mt-6">
          Education
        </h3>
        <div className="space-y-3">
          {profile.education.map((e) => (
            <div key={e.school} className="glass rounded-xl p-4">
              <div className="font-semibold">{e.school}</div>
              <div className="text-sm text-white/60">{e.degree}</div>
              <div className="text-xs text-white/40 mt-1 font-mono">
                {e.period} · {e.grade}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsBody() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {profile.projects.map((p, i) => (
        <motion.article
          key={p.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          whileHover={{ y: -4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-300 font-mono mb-2">
            Project {String(i + 1).padStart(2, "0")}
          </div>
          <h3 className="text-lg font-bold">{p.title}</h3>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">{p.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/70 border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function ContactBody() {
  return (
    <div className="space-y-6">
      <p className="text-white/70 text-lg">
        I'm <span className="text-white">open to Business Analyst &amp; Generative AI Engineer roles</span>.
        Based in <span className="text-white">{profile.location}</span> — drop a line.
      </p>

      <div className="glass rounded-2xl p-5 relative">
        <span className="absolute -top-3 left-5 text-5xl gradient-text font-serif leading-none">
          “
        </span>
        <blockquote className="italic text-white/80 pt-2">
          {profile.testimonial.quote}
        </blockquote>
        <div className="mt-3 text-sm text-white/50">
          — {profile.testimonial.author}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {profile.socials.map((s) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3 }}
            className="glass rounded-xl p-4 flex items-center justify-between hover:bg-white/10"
          >
            <span className="font-medium">{s.label}</span>
            <span className="text-white/40">↗</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
