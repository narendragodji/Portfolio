import { profile, type SectionId } from "../../data/profile";

const ACCENT: Record<SectionId, string> = {
  about: "#c084fc",
  experience: "#fbbf24",
  projects: "#22d3ee",
  contact: "#f472b6",
};

export const WINDOW_META: Record<
  SectionId,
  { title: string; icon: string; accent: string }
> = {
  about: { title: "about.txt — Notepad", icon: "📝", accent: ACCENT.about },
  experience: { title: "resume.log — Timeline", icon: "📜", accent: ACCENT.experience },
  projects: { title: "C:\\akash\\projects — Explorer", icon: "📁", accent: ACCENT.projects },
  contact: { title: "Mail — New Message", icon: "✉️", accent: ACCENT.contact },
};

export function SectionApp({ id }: { id: SectionId }) {
  switch (id) {
    case "about":
      return <AboutApp />;
    case "experience":
      return <ExperienceApp />;
    case "projects":
      return <ProjectsApp />;
    case "contact":
      return <ContactApp />;
  }
}

/* ----------------------------- About ------------------------------------- */

function AboutApp() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#0d0a1a] text-white/85">
      <div className="px-6 py-5 font-mono text-[13px] leading-relaxed">
        <div className="text-purple-300 mb-1 text-xs uppercase tracking-[0.35em]">
          about.txt
        </div>
        <div className="text-2xl font-bold mb-1 text-white">
          {profile.name}
        </div>
        <div className="text-white/60 mb-4">
          {profile.title} · {profile.location}
        </div>

        <div className="text-lg text-purple-200 mb-3 italic">
          {profile.about.lead}
        </div>

        {profile.about.paragraphs.map((p, i) => (
          <p key={i} className="text-white/75 mb-3 max-w-3xl">
            {p}
          </p>
        ))}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {profile.about.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <div className="text-xl font-bold text-purple-200">{s.value}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/55">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <div className="text-xs uppercase tracking-[0.3em] text-purple-300 mb-3">
            Skills
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-w-3xl">
            {profile.skills.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-[11px] text-white/70 mb-1">
                  <span>{s.name}</span>
                  <span className="text-white/40">{s.level}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.level}%`,
                      background:
                        "linear-gradient(90deg, #a855f7, #ec4899)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Experience ---------------------------------- */

function ExperienceApp() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#0b0a14] text-white/85">
      <div className="px-6 py-5 font-mono text-[13px]">
        <div className="text-amber-300 mb-3 text-xs uppercase tracking-[0.35em]">
          resume.log
        </div>

        <div className="space-y-5">
          {profile.experience.map((job, idx) => (
            <div
              key={idx}
              className="border-l-2 border-amber-400/40 pl-4 relative"
            >
              <div
                className="absolute -left-[7px] top-1 w-3 h-3 rounded-full"
                style={{ background: "#fbbf24", boxShadow: "0 0 10px #fbbf24" }}
              />
              <div className="text-amber-200 text-base font-bold">
                {job.role}
              </div>
              <div className="text-white/65 text-xs mb-2">
                {job.company} · {job.period}
              </div>
              <ul className="list-none text-white/75 text-[12.5px] space-y-1 leading-relaxed">
                {job.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-400/70">▹</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded border border-amber-400/30 text-amber-200/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-2">
            Education
          </div>
          {profile.education.map((e, i) => (
            <div key={i} className="text-white/80">
              <span className="text-amber-200 font-semibold">{e.degree}</span>{" "}
              — {e.school}{" "}
              <span className="text-white/55">
                ({e.period} · {e.grade})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Projects ------------------------------------ */

function ProjectsApp() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#0a1014] text-white/85">
      {/* Faux explorer "address bar" */}
      <div
        className="px-4 py-2 text-[11px] font-mono text-cyan-200/85 border-b border-white/5"
        style={{
          background:
            "linear-gradient(180deg, rgba(34,211,238,0.06), transparent)",
        }}
      >
        <span className="text-white/40">📁  </span>
        C:\akash\projects\
        <span className="text-cyan-300/60"> — 4 items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-4">
        {profile.projects.map((p) => (
          <div
            key={p.title}
            className="rounded-lg p-4 border border-cyan-400/15 bg-cyan-400/[0.03] hover:bg-cyan-400/[0.08] transition cursor-default"
            style={{ boxShadow: "0 0 24px rgba(34,211,238,0.06)" }}
          >
            <div className="flex items-start gap-2 mb-1">
              <span className="text-cyan-300 text-base leading-none">📁</span>
              <div className="text-cyan-100 font-bold text-[14px] leading-snug">
                {p.title}
              </div>
            </div>
            <div className="text-white/70 text-[12px] leading-relaxed mb-3">
              {p.desc}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-2 py-0.5 rounded border border-cyan-400/30 text-cyan-200/85"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Contact ------------------------------------- */

function ContactApp() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#140a14] text-white/85">
      <div className="px-6 py-5 font-mono text-[12.5px]">
        <div className="text-pink-300 mb-1 text-xs uppercase tracking-[0.35em]">
          new message
        </div>
        <div className="text-2xl font-bold text-white mb-4">Get in touch ✉️</div>

        {/* Pseudo mail header */}
        <div
          className="rounded-lg border border-pink-400/20 bg-white/[0.03] p-4 mb-4 space-y-1.5"
          style={{ boxShadow: "0 0 24px rgba(244,114,182,0.07)" }}
        >
          <MailRow label="From" value={`recruiter@yourcompany.com`} />
          <MailRow label="To" value={profile.socials.find((s) => s.label === "Email")?.href.replace("mailto:", "") ?? ""} />
          <MailRow label="Subject" value="Let's build something cool" />
        </div>

        <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-white/80 leading-relaxed text-[13px] mb-5 italic">
          “{profile.testimonial.quote}”
          <div className="text-right mt-2 text-pink-200/80 text-[11px]">
            — {profile.testimonial.author}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-pink-400/30 px-4 py-3 text-center hover:bg-pink-400/10 transition"
              style={{ boxShadow: "0 0 18px rgba(244,114,182,0.12)" }}
            >
              <div className="text-pink-200 text-xs uppercase tracking-[0.3em]">
                {s.label}
              </div>
              <div className="text-white/85 text-[12px] mt-1 truncate">
                {s.href.replace(/^https?:\/\//, "").replace("mailto:", "")}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function MailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-[12px]">
      <span className="text-pink-300/70 w-16 shrink-0 uppercase tracking-[0.2em] text-[10px] pt-[3px]">
        {label}
      </span>
      <span className="text-white/85 truncate">{value}</span>
    </div>
  );
}
