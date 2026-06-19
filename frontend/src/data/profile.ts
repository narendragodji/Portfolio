export type SectionId = "about" | "experience" | "projects" | "contact";

export const profile = {
  name: "Akash Singh",
  title: "Decision Scientist — NLP · LLMs · RAG",
  tagline: "Open to Business Analyst & Generative AI Engineer roles",
  location: "Bangalore, India",
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/akash-singh-0362191bb/",
    },
    { label: "GitHub", href: "https://github.com" },
    { label: "Email", href: "mailto:akash.singh@example.com" },
  ],
  about: {
    lead: "Applied AI at the intersection of data & language.",
    paragraphs: [
      "Decision Scientist at Mu Sigma, working where data engineering, NLP and LLM-powered automation meet. I build end-to-end systems — from scraping and sentiment pipelines to RAG-based chatbots and full-stack analytics dashboards — that translate messy data into clear business decisions.",
      "Over the past ~2 years I've shipped projects that automate hundreds of manual reporting hours, surface competitive pricing intelligence for global markets, and bring natural-language interfaces to sales analytics. My stack spans Python, FastAPI, React, LLMs, Pandas, Selenium and Power BI.",
    ],
    stats: [
      { value: "2+", label: "Years @ Mu Sigma" },
      { value: "7+", label: "OEMs analyzed" },
      { value: "100s", label: "Reports automated" },
      { value: "RAG", label: "Chatbots shipped" },
    ],
  },
  experience: [
    {
      role: "Trainee Decision Scientist II",
      company: "Mu Sigma Inc.",
      period: "Jan 2026 — Present",
      bullets: [
        "Built a full-stack analytics platform (React + FastAPI) tracking MacBook pricing trends and competitive benchmarking across global markets.",
        "Engineered a RAG-based chatbot on sales data so stakeholders can query pricing and merchant performance in natural language.",
        "Integrated Azure SQL and external pricing APIs for real-time data ingestion.",
      ],
      tags: ["React", "FastAPI", "RAG", "Azure OpenAI"],
    },
    {
      role: "Trainee Decision Scientist",
      company: "Mu Sigma Inc.",
      period: "Aug 2024 — Jan 2026",
      bullets: [
        "Built an end-to-end sentiment analysis pipeline across Microsoft devices and 7 OEMs covering DM7 + global markets.",
        "Automated review data scraping with Selenium and processed large-scale datasets in Python (Pandas, NumPy).",
        "Applied NLP for aspect-based sentiment tagging across performance, battery and design.",
      ],
      tags: ["NLP", "Selenium", "Pandas", "Power BI"],
    },
  ],
  education: [
    {
      school: "Chandigarh University",
      degree: "B.E. — Computer Science",
      period: "Aug 2020 — Jul 2024",
      grade: "CGPA 7.64",
    },
  ],
  skills: [
    { name: "Python", level: 95 },
    { name: "NLP", level: 90 },
    { name: "LLMs / RAG", level: 88 },
    { name: "Prompt Engineering", level: 90 },
    { name: "Pandas / NumPy", level: 92 },
    { name: "FastAPI", level: 85 },
    { name: "React / TypeScript", level: 82 },
    { name: "Selenium", level: 88 },
    { name: "Azure OpenAI", level: 82 },
    { name: "Power BI", level: 80 },
    { name: "SQL / Azure SQL", level: 80 },
    { name: "Machine Learning", level: 82 },
  ],
  projects: [
    {
      title: "AlertIQ — Pricing Intelligence Platform",
      desc: "Full-stack platform analyzing retailer and marketplace pricing across products, merchants and regions. Integrated Azure SQL and external pricing APIs for real-time data ingestion.",
      tags: ["React", "TypeScript", "FastAPI", "Azure SQL"],
    },
    {
      title: "RAG Sales Chatbot",
      desc: "Retrieval-Augmented Generation chatbot on sales data — lets stakeholders query pricing trends and merchant performance in natural language, eliminating ad-hoc analyst requests.",
      tags: ["LLMs", "RAG", "Azure OpenAI", "Python"],
    },
    {
      title: "Device Sentiment Dashboard",
      desc: "End-to-end sentiment analysis pipeline across Microsoft devices and 7 OEM partners across DM7 and global markets — turning customer reviews into actionable product insights at scale.",
      tags: ["NLP", "Selenium", "Pandas", "Power BI"],
    },
    {
      title: "Aspect-Based Sentiment Engine",
      desc: "NLP component that tags large-scale review data across dimensions like performance, battery and design — powering structured insights for product and market decisions.",
      tags: ["NLP", "Python", "NumPy"],
    },
  ],
  testimonial: {
    quote:
      "Working alongside Akash has been genuinely impressive. He has a rare combination of strong coding fundamentals and the ability to communicate complex ideas clearly, often taking ownership end to end with minimal hand holding.",
    author: "Yathin A — Data & Decision Science Professional, Mu Sigma",
  },
} as const;

export type Profile = typeof profile;
