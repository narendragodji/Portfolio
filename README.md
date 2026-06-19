# Portfolio — Akash Singh

A desktop-OS inspired personal portfolio for **Akash Singh**, Decision Scientist working at the intersection of **NLP, LLMs, and RAG**. Built as an interactive "desktop" experience with a custom in-browser terminal, draggable windows, and animated section apps.

> Open to **Business Analyst** and **Generative AI Engineer** roles.

---

## ✨ Features

- 🖥️ **Desktop-style landing** — animated boot into a faux OS environment
- 🪟 **Window manager** — open, focus, and arrange section apps (About, Experience, Projects, Contact)
- ⌨️ **Built-in Terminal** — type commands (`about`, `experience`, `projects`, `contact`, `help`, `clear`) to navigate the portfolio
- 🎨 **Tailwind CSS v4** + **React Icons** for styling and iconography
- 🎞️ **Framer Motion** + **GSAP** animations, **tsParticles** background, **Lenis** smooth scroll
- ⚡ **Astro 6 + React 19** islands architecture for fast static delivery
- 📦 Centralized **profile data** in a single `profile.ts` — edit one file to update everything

---

## 🛠️ Tech Stack

| Layer        | Tools                                                                 |
| ------------ | --------------------------------------------------------------------- |
| Framework    | [Astro 6](https://astro.build), [React 19](https://react.dev)         |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com), `global.css`              |
| Animation    | Framer Motion, GSAP, Lottie, react-type-animation, split-type         |
| Effects      | `@tsparticles/react`, Lenis (smooth scroll)                           |
| Icons        | React Icons                                                           |
| Language     | TypeScript                                                            |

---

## 📁 Project Structure

```text
Portfolio/
└── frontend/
    ├── astro.config.mjs
    ├── tsconfig.json
    ├── package.json
    ├── public/
    │   └── Desktop-Landing.jpg
    └── src/
        ├── components/
        │   ├── App.tsx                  # Root app shell + window state
        │   ├── desktop/
        │   │   ├── Desktop.tsx          # Desktop surface & taskbar
        │   │   ├── Window.tsx           # Draggable window primitive
        │   │   ├── Terminal.tsx         # In-browser command terminal
        │   │   └── SectionApps.tsx      # About / Experience / Projects / Contact
        │   └── landing/
        │       └── LandingDesk.tsx      # Boot / landing animation
        ├── data/
        │   └── profile.ts               # Single source of truth for portfolio content
        ├── layouts/
        │   └── landingpagelayout.astro
        ├── pages/
        │   └── index.astro              # Entry route
        └── styles/
            └── global.css
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 22.12.0`
- **npm** (or pnpm / yarn)

### Install & run

```sh
cd frontend
npm install
npm run dev
```

The dev server starts at **http://localhost:4321**.

### Available scripts

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start the local dev server                    |
| `npm run build`    | Build the production site to `frontend/dist/` |
| `npm run preview`  | Preview the production build locally          |
| `npm run astro`    | Run Astro CLI commands (`add`, `check`, etc.) |

---

## ✏️ Customizing Content

All portfolio content lives in `frontend/src/data/profile.ts`. Update fields like `name`, `title`, `about`, `experience`, `projects`, `skills`, `education`, and `socials` — every section app and terminal command reads from this single source.

```ts
export const profile = {
  name: "Your Name",
  title: "Your Role",
  // ...
} as const;
```

---

## 🧩 Terminal Commands

Inside the in-app terminal, try:

| Command       | Action                              |
| ------------- | ----------------------------------- |
| `help`        | List all available commands         |
| `about`       | Open the About section              |
| `experience`  | Show work experience                |
| `projects`    | List featured projects              |
| `contact`     | Show contact / social links         |
| `clear`       | Clear the terminal screen           |

---

## 🏗️ Build & Deploy

```sh
cd frontend
npm run build
```

The static output is generated in `frontend/dist/` and can be deployed to any static host — **Vercel**, **Netlify**, **Cloudflare Pages**, **GitHub Pages**, etc.

---

## 👤 About

**Akash Singh** — Decision Scientist @ Mu Sigma  
Applied AI · NLP · LLMs · RAG · Full-stack analytics

- 💼 [LinkedIn](https://www.linkedin.com/in/akash-singh-0362191bb/)
- 🐙 GitHub — (link in `profile.ts`)
- 📍 Bangalore, India

---

## 📄 License

This repository is personal. Code may be reused for learning purposes; please don't repurpose the personal content (bio, experience, projects) as your own.
