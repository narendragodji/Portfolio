import { motion } from "framer-motion";
import { useState } from "react";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/akash-singh-0362191bb/" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Email", href: "mailto:akash.singh@example.com" },
  { label: "Bangalore, India", href: "https://maps.google.com/?q=Bangalore" },
];

export default function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      className="relative py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-400">
            05 — Contact
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
            Let's build something
            <br />
            <span className="gradient-text">useful</span>.
          </h2>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 mb-10 relative"
        >
          <span className="absolute -top-4 left-6 text-6xl gradient-text font-serif leading-none">
            “
          </span>
          <blockquote className="text-white/80 text-lg leading-relaxed italic">
            Working alongside Akash has been genuinely impressive. He has a
            rare combination of strong coding fundamentals and the ability to
            communicate complex ideas clearly, often taking ownership end to
            end with minimal hand holding.
          </blockquote>
          <figcaption className="mt-4 text-sm text-white/50">
            — Yathin A, Data &amp; Decision Science Professional, Mu Sigma
          </figcaption>
        </motion.figure>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="glass rounded-3xl p-8 grid gap-4 glow"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              type="text"
              placeholder="Your name"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-400 outline-none transition"
            />
            <input
              required
              type="email"
              placeholder="Email address"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-400 outline-none transition"
            />
          </div>
          <textarea
            required
            rows={5}
            placeholder="Tell me about your project..."
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-400 outline-none transition resize-none"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 font-semibold"
          >
            {sent ? "Message sent ✓" : "Send message →"}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -3 }}
              className="px-5 py-2 rounded-full glass text-sm text-white/80 hover:text-white"
            >
              {s.label}
            </motion.a>
          ))}
        </motion.div>

        <p className="mt-16 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Akash Singh — Bangalore, India · Built
          with React, Three.js &amp; Framer Motion.
        </p>
      </div>
    </section>
  );
}
