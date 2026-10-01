// Single source of truth for all site content. Edit here, not in components.

export const profile = {
  name: "Vineet Rohit Shah",
  shortName: "Vineet Shah",
  initials: "VS",
  role: "Computer Science Engineer · AI & Full-stack",
  university: "Ramdeobaba University",
  city: "Nagpur",
  country: "India",
  coords: "21.14°N 79.08°E",
  timezone: "Asia/Kolkata",
  email: "vineetshah701@gmail.com",
  github: "https://github.com/vinuah-dev",
  githubUser: "vinuah-dev",
  linkedin: "https://www.linkedin.com/in/vineet-shah-70263721a/",
  // Instagram handles can't contain "-": confirm the exact handle and update both fields.
  instagram: "https://www.instagram.com/vinuah.dev/",
  instagramHandle: "vinuah.dev",
  availability: "Open to internships & collaborations",
} as const;

/** The three "Let's talk" channels, used by the nav menu, palette, Jarvis and contact. */
export const socials = [
  { id: "email", label: "Gmail", value: profile.email, href: `mailto:${profile.email}` },
  { id: "linkedin", label: "LinkedIn", value: "Vineet Shah", href: profile.linkedin },
  { id: "instagram", label: "Instagram", value: `@${profile.instagramHandle}`, href: profile.instagram },
] as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export type Shot = { src: string; alt: string; caption: string; w: number; h: number };

export type Project = {
  index: string;
  slug: string;
  name: string;
  kind: string;
  summary: string;
  highlight: { label: string; value: string };
  features: string[];
  tags: string[];
  badge?: string;
  github?: string;
  live?: string;
  status?: string;
  /** Real screenshots. Projects without any fall back to a code-built visual. */
  shots?: Shot[];
  video?: { src: string; poster: string };
};

export const projects: Project[] = [
  {
    index: "01",
    slug: "safex",
    name: "SAFEX AI",
    kind: "Computer Vision · Fire safety",
    summary:
      "Turns existing CCTV into a live evacuation system. YOLOv8 spots fire, smoke and people, a hazard grid scores every zone, and A* routes each person to the safest exit.",
    highlight: { label: "Key feature", value: "Hazard-aware A* routing that re-plans the moment fire spreads" },
    features: ["Fire, smoke & occupancy detection", "Live hazard schematic per floor", "Browser camera → FastAPI over WebSockets"],
    tags: ["YOLOv8", "OpenCV", "A*", "FastAPI", "WebSockets"],
    badge: "Medha Medithon 2026 · Top 5",
    github: "https://github.com/vinuah-dev/fire-vdo",
    shots: [
      { src: "/work/safex-dashboard.webp", alt: "SAFEX AI hospital dashboard during a fire alarm", caption: "Command dashboard · alarm state", w: 1800, h: 980 },
      { src: "/work/safex-route.webp", alt: "SAFEX AI live hazard schematic with evacuation route", caption: "Live hazard schematic + evac route", w: 1280, h: 1102 },
      { src: "/work/safex-detection.webp", alt: "Fire detection model flagging a critical fire", caption: "Detection model · critical risk", w: 706, h: 425 },
    ],
  },
  {
    index: "02",
    slug: "jarvis",
    name: "Jarvis",
    kind: "Voice AI · Automation",
    summary:
      "A voice-first desktop assistant with a full HUD. It listens, understands intent and acts: it launches apps, drives the browser, sends WhatsApp messages and routes each request to the right AI.",
    highlight: { label: "Key feature", value: "Multi-AI routing with neural, scanning and security modes" },
    features: ["Speech recognition & wake word", "Desktop, browser & WhatsApp automation", "Code & image generation"],
    tags: ["Python", "Speech Recognition", "LLM APIs", "Automation"],
    badge: "Winner · ANVESHAN 2026",
    github: "https://github.com/vinuah-dev/jarvis-ai",
    video: { src: "/work/jarvis-hud.mp4", poster: "/work/jarvis-hud-cyan.webp" },
    shots: [
      { src: "/work/jarvis-hud-cyan.webp", alt: "Jarvis HUD in neural mode", caption: "Neural mode", w: 848, h: 440 },
      { src: "/work/jarvis-hud-green.webp", alt: "Jarvis HUD in scanning mode", caption: "Scanning mode", w: 848, h: 440 },
      { src: "/work/jarvis-hud-red.webp", alt: "Jarvis HUD in security mode", caption: "Security mode", w: 848, h: 440 },
    ],
  },
  {
    index: "03",
    slug: "sentinel",
    name: "SENTINEL-X",
    kind: "Surveillance · Smart India Hackathon",
    summary:
      "Border-surveillance intelligence that runs on existing IP cameras. It detects, tracks and names behaviours, reads number plates, and scores every alert 0–100 with a reason for each point.",
    highlight: { label: "Key feature", value: "Explainable risk scoring, backed by 1,067 automated tests" },
    features: ["Detection, tracking & re-ID after occlusion", "Loitering, border-facing & night-movement behaviours", "ANPR with cross-camera plate checks"],
    tags: ["Python", "YOLOv8", "OpenCV", "FastAPI", "PaddleOCR"],
    badge: "SIH 2026 · PS 26187",
    github: "https://github.com/vinuah-dev/SIH-TECH-GARUDA",
    shots: [
      { src: "/work/sentinel-dashboard.webp", alt: "SENTINEL-X command centre with live alerts", caption: "Command centre · synthetic test feed", w: 1800, h: 1050 },
      { src: "/work/sentinel-alerts.webp", alt: "SENTINEL-X alerts with risk scores", caption: "Alerts, behaviours & risk scores", w: 1800, h: 800 },
    ],
  },
  {
    index: "04",
    slug: "cipher",
    name: "CIPHER",
    kind: "Security · Local-first AI",
    summary:
      "A local-first AI security operations centre. It ingests logs, correlates events and triages threats on-device, so no telemetry ever leaves the machine.",
    highlight: { label: "Key idea", value: "LLM-assisted triage that runs fully offline" },
    features: ["Log ingestion & correlation", "On-device threat triage", "Analyst-style incident summaries"],
    tags: ["Python", "Local LLMs", "Security", "SOC"],
    status: "In development",
  },
  {
    index: "05",
    slug: "revolution",
    name: "Revolution Gym",
    kind: "Product · Membership platform",
    summary:
      "A full gym platform for Nagpur: a 14-page site plus a member portal and admin panel covering memberships, billing, vitals, referrals and points.",
    highlight: { label: "Key feature", value: "Role-based member & admin portals on one auth system" },
    features: ["Member management & billing", "Referrals, points & shop", "Health & vitals tracking"],
    tags: ["JavaScript", "Firebase Auth", "Firestore", "HTML/CSS"],
    github: "https://github.com/vinuah-dev/Revolution-Gym",
    live: "https://revolution-gym-swart.vercel.app",
    shots: [
      { src: "/work/gym-home.webp", alt: "Revolution Gym homepage", caption: "Homepage", w: 1800, h: 1125 },
      { src: "/work/gym-programs.webp", alt: "Revolution Gym programs page", caption: "Programs", w: 1800, h: 1125 },
      { src: "/work/gym-membership.webp", alt: "Revolution Gym membership page", caption: "Membership", w: 1800, h: 1125 },
    ],
  },
];

export type Milestone = {
  mark: string;
  title: string;
  note: string;
  meta: string;
  image?: { src: string; alt: string };
  link?: string;
};

export const achievements: Milestone[] = [
  {
    mark: "Winner",
    title: "ANVESHAN Innovation Competition",
    note: "First place with Jarvis at the project model competition.",
    meta: "NIT Nagpur · Apr 2026",
    image: { src: "/milestones/anveshan-winner.webp", alt: "Vineet holding the ANVESHAN 1st Winner board and trophy" },
  },
  {
    mark: "Top 8",
    title: "EFOS SkillUp India Hackathon 2026",
    note: "24-hour national-level innovation challenge.",
    meta: "National level · 2026",
    image: { src: "/milestones/efos-certificate.webp", alt: "EFOS SkillUp India Hackathon 2026 certificate of achievement" },
  },
  {
    mark: "Top 5",
    title: "Medha Medithon 2026",
    note: "SAFEX AI: computer-vision fire evacuation for hospitals.",
    meta: "2026",
  },
  {
    mark: "SIH",
    title: "Smart India Hackathon",
    note: "Team Tech Garuda built SENTINEL-X for border surveillance.",
    meta: "PS 26187 · MHA / SSB",
    link: "https://github.com/vinuah-dev/SIH-TECH-GARUDA",
  },
  {
    mark: "Intern",
    title: "Software Development Intern",
    note: "Building production software at Shaibya Solution.",
    meta: "Shaibya Solution",
  },
  {
    mark: "Lead",
    title: "CSE Committee: Sports Co-Head",
    note: "Running department sports events and teams.",
    meta: "Ramdeobaba University",
  },
];

// Keep descriptions short.
export const timeline = [
  {
    period: "Now",
    title: "B.Tech, Computer Science Engineering",
    org: "Ramdeobaba University, Nagpur",
    body: "Systems, algorithms and ML. Most of the learning happens in the build log.",
    type: "Education",
  },
  {
    period: "Internship",
    title: "Software Development Intern",
    org: "Shaibya Solution",
    body: "Shipping real features end-to-end inside a working team: reviews, testing and deployment.",
    type: "Experience",
  },
  {
    period: "Leadership",
    title: "Sports Co-Head, CSE Committee",
    org: "Ramdeobaba University",
    body: "Planning and running department sports events, and coordinating the people behind them.",
    type: "Leadership",
  },
  {
    period: "Hackathons",
    title: "Hackathons & competitions",
    org: "ANVESHAN · EFOS SkillUp · Medha Medithon · SIH",
    body: "A winner's trophy, a national Top 8, a Medithon Top 5 and an SIH build, each taken from idea to working demo.",
    type: "Competitions",
  },
  {
    period: "Projects",
    title: "Computer vision & AI systems",
    org: "SAFEX AI · Jarvis · SENTINEL-X · CIPHER",
    body: "Applied CV and LLM systems built around real constraints such as latency, privacy and safety.",
    type: "Engineering",
  },
];

export const stack = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C++"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind", "Three.js", "HTML", "CSS"] },
  { group: "Backend", items: ["Node.js", "Express", "FastAPI", "Flask", "REST APIs", "WebSockets"] },
  { group: "AI / ML", items: ["YOLOv8", "OpenCV", "TensorFlow", "TFLite", "HuggingFace", "PaddleOCR"] },
  { group: "Database", items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Firebase"] },
  { group: "Cloud / DevOps", items: ["AWS", "Google Cloud", "Docker", "GitHub Actions", "Cloudflare"] },
];

/** Which featured projects use a technology (drives the Stack hover/tap interaction). */
export const techUsage: Record<string, string[]> = {
  Python: ["SAFEX AI", "Jarvis", "SENTINEL-X", "CIPHER"],
  JavaScript: ["Revolution Gym", "SAFEX AI"],
  HTML: ["Revolution Gym", "SAFEX AI"],
  CSS: ["Revolution Gym", "SAFEX AI"],
  FastAPI: ["SAFEX AI", "SENTINEL-X"],
  WebSockets: ["SAFEX AI", "SENTINEL-X"],
  YOLOv8: ["SAFEX AI", "SENTINEL-X"],
  OpenCV: ["SAFEX AI", "SENTINEL-X"],
  PaddleOCR: ["SENTINEL-X"],
  Firebase: ["Revolution Gym"],
  "Next.js": ["This site"],
  React: ["This site"],
  TypeScript: ["This site"],
  Tailwind: ["This site"],
};

// Repositories shown in the activity section (enriched with live data when available).
export const selectedRepos = [
  { name: "fire-vdo", blurb: "SAFEX AI: browser-camera fire, smoke & occupancy detection with exit routing." },
  { name: "jarvis-ai", blurb: "Award-winning voice assistant for desktop automation & AI task execution." },
  { name: "SIH-TECH-GARUDA", blurb: "SENTINEL-X: intelligent border surveillance for SIH 2026." },
  { name: "fire-risk-detection-ai", blurb: "Real-time fire & smoke risk classification with computer vision." },
  { name: "Revolution-Gym", blurb: "Gym site, member portal & admin panel." },
  { name: "Fire", blurb: "SAFEX AI core: detection, pathfinding and hospital simulation." },
];
