import { motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4"
      >
        <div className="glass rounded-2xl flex items-center justify-between px-5 py-3 max-w-6xl mx-auto">
          <a href="#home" className="text-lg font-bold tracking-tight">
            <span className="gradient-text">akash.ai</span>
          </a>

          <ul className="hidden md:flex items-center gap-8 text-sm text-white/70">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="hover:text-white transition-colors duration-200"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90 transition"
          >
            Let's talk →
          </a>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
          >
            <div className="w-5 h-0.5 bg-white mb-1.5"></div>
            <div className="w-5 h-0.5 bg-white mb-1.5"></div>
            <div className="w-5 h-0.5 bg-white"></div>
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass rounded-2xl mt-2 p-4 max-w-6xl mx-auto"
          >
            <ul className="flex flex-col gap-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-white/80 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.nav>

      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-500 z-[60]"
      />
    </>
  );
}
