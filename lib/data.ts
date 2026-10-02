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
  instagram: "https://www.instagram.com/vinuah_dev/",
  instagramHandle: "vinuah_dev",
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
  /** Inline loop (muted until the viewer turns sound on) + optional full-length cut for the lightbox. */
  video?: { src: string; poster: string; caption: string; full?: string };
};

export const projects: Project[] = [
  {
    index: "01",
    slug: "safex",
    name: "SAFE-X AI",
    kind: "Computer Vision · Fire safety",
    summary:
      "Turns existing CCTV into a live evacuation system. YOLOv8 spots fire, smoke and people, a hazard grid scores every zone, and A* routes each person to the safest exit.",
    highlight: { label: "Key feature", value: "Hazard-aware A* routing that re-plans the moment fire spreads" },
    features: ["Fire, smoke & occupancy detection", "Live hazard schematic per floor", "Browser camera → FastAPI over WebSockets"],
    tags: ["YOLOv8", "OpenCV", "A*", "FastAPI", "WebSockets"],
    badge: "Medha Medithon 2026 · Top 5",
    github: "https://github.com/vinuah-dev/fire-vdo",
    shots: [
      { src: "/work/safex-dashboard.webp", alt: "SAFE-X AI hospital dashboard during a fire alarm", caption: "Command dashboard · alarm state", w: 1800, h: 980 },
      { src: "/work/safex-route.webp", alt: "SAFE-X AI live hazard schematic with evacuation route", caption: "Live hazard schematic + evac route", w: 1280, h: 1102 },
      { src: "/work/safex-detection.webp", alt: "Fire detection model flagging a critical fire", caption: "Detection model · critical risk", w: 706, h: 425 },
    ],
  },
  {
    index: "02",
    slug: "jarvis",
    name: "Jarvis",
    kind: "Voice AI · Self-learning assistant",
    summary:
      "A voice-first desktop assistant that teaches itself. Ask for something it can't do and it writes the skill, sandbox-tests it, registers it and then does the task, all in one turn. The latest build, NIVA NEXUS, adds a full-screen gesture HUD with a zoomable universe.",
    highlight: { label: "Key feature", value: "Auto-learn-then-do: new skills written, tested and run on demand" },
    features: [
      "40+ skills: apps, browser, WhatsApp, system, research",
      "Self-improvement loop that patches its own code",
      "Multi-model brain: Groq, Gemini or local Ollama",
    ],
    tags: ["Python", "PyQt5", "LLMs", "Speech", "Automation"],
    badge: "Winner · ANVESHAN 2026",
    github: "https://github.com/vinuah-dev/jarvis-ai",
    shots: [
      { src: "/work/niva-dashboard.webp", alt: "NIVA NEXUS dashboard with terminal, core and system vitals", caption: "NIVA NEXUS · dashboard", w: 1800, h: 1013 },
      { src: "/work/niva-core.webp", alt: "NIVA full-screen HUD with the particle core", caption: "Full-screen HUD · core", w: 1800, h: 1013 },
      { src: "/work/niva-galaxy.webp", alt: "NIVA full-screen universe view of the Milky Way", caption: "Full-screen HUD · galaxy", w: 1600, h: 900 },
      { src: "/work/niva-saturn.webp", alt: "NIVA universe view zoomed in on Saturn", caption: "Universe · Saturn", w: 1600, h: 900 },
    ],
    video: { src: "/work/jarvis-hud.mp4", poster: "/work/jarvis-hud-cyan.webp", caption: "Jarvis v1 · demo with sound", full: "/work/jarvis-demo.mp4" },
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
      { src: "/work/sentinel-alert.webp", alt: "SENTINEL-X alert with an explainable 90/100 risk breakdown", caption: "Explainable risk: every point named", w: 1100, h: 1116 },
      { src: "/work/sentinel-zones.webp", alt: "SENTINEL-X zone settings with restricted and watch fences", caption: "Virtual fences per camera", w: 1800, h: 975 },
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
  id: string;
  /** Big word on the card */
  mark: string;
  title: string;
  /** One line under the title on the card */
  line: string;
  /** Header line in the expanded view */
  period: string;
  summary: string[];
  points: { label: string; items: string[] };
  closing?: string;
  images?: { src: string; alt: string; w: number; h: number }[];
  link?: { href: string; label: string };
};

export const achievements: Milestone[] = [
  {
    id: "anveshan",
    mark: "Winner",
    title: "ANVESHAN Innovation Competition",
    line: "1st Place · NIT Nagpur · 2026",
    period: "NIT Nagpur · April 2026",
    summary: [
      "Won 1st place at the ANVESHAN Project Model Competition at NIT Nagpur for an AI-powered innovation project. Presented and demonstrated the Jarvis AI Assistant, showcasing practical applications of artificial intelligence, automation, voice interaction and intelligent system design.",
    ],
    points: { label: "Achievement", items: ["Winner / 1st Place", "Project: Jarvis AI Assistant", "Venue: NIT Nagpur", "Competition: ANVESHAN Innovation Competition"] },
    closing: "This achievement highlights my ability to turn an AI concept into a functional, demonstrable solution and present it effectively in a competitive environment.",
    images: [
      { src: "/milestones/anveshan-winner.webp", alt: "Vineet with the ANVESHAN 1st Winner board and trophy", w: 1200, h: 675 },
      { src: "/milestones/anveshan-stage.webp", alt: "ANVESHAN prize ceremony on stage", w: 1400, h: 933 },
      { src: "/milestones/anveshan-team.webp", alt: "Receiving the ANVESHAN 1st Winner award", w: 1400, h: 933 },
      { src: "/milestones/anveshan-trophy.webp", alt: "ANVESHAN winner trophy", w: 960, h: 1280 },
    ],
    link: { href: "https://github.com/vinuah-dev/jarvis-ai", label: "Jarvis on GitHub" },
  },
  {
    id: "efos",
    mark: "Runner-Up",
    title: "EFOS SkillUp India Hackathon",
    line: "National Level · 24-Hour · 2026",
    period: "National level · 2026",
    summary: [
      "Secured a Runner-Up position in the EFOS SkillUp India Hackathon 2026, a national-level 24-hour innovation challenge focused on AI, Data Science, Cyber Security and Open Innovation.",
      "The competition involved developing and presenting a practical technology solution within a highly time-constrained environment, requiring rapid problem solving, teamwork, implementation and presentation.",
    ],
    points: { label: "Achievement", items: ["Runner-Up position (Top 8)", "National-level competition", "24-hour hackathon", "EFOS SkillUp India Hackathon 2026"] },
    images: [{ src: "/milestones/efos-certificate.webp", alt: "EFOS SkillUp India Hackathon 2026 certificate of achievement", w: 1200, h: 848 }],
  },
  {
    id: "medithon",
    mark: "Top 5",
    title: "Medha Medithon 2026",
    line: "SAFE-X AI · VNIT Nagpur · 2026",
    period: "National healthcare innovation challenge · VNIT Nagpur · 2026",
    summary: [
      "Reached the Top 5 at MEDHA MEDITHON 2026, a national-level healthcare innovation competition conducted at VNIT Nagpur.",
      "Worked on SAFE-X AI, a computer-vision-based fire evacuation solution designed for hospital environments. The system uses AI and computer vision to identify hazards and assist with safer evacuation and routing during emergencies.",
    ],
    points: {
      label: "Achievement",
      items: ["Top 5", "National-level healthcare innovation competition", "Venue: VNIT Nagpur", "Project: SAFE-X AI", "Domain: AI · Computer Vision · Healthcare · Emergency Response"],
    },
    closing: "The competition brought together teams from across India to solve real-world healthcare challenges. Organisers reported 709+ registered teams, 102 solution submissions and 41 teams shortlisted for the pitching stage.",
    images: [
      { src: "/milestones/medithon-stage.webp", alt: "Receiving the Medha Medithon 2026 award on stage", w: 1599, h: 899 },
      { src: "/milestones/medithon-team.webp", alt: "The SAFE-X AI team with certificates at VNIT Nagpur", w: 1599, h: 1200 },
      { src: "/milestones/medithon-certificate.webp", alt: "Vineet holding the Medha Medithon certificate and trophy", w: 715, h: 1600 },
      { src: "/milestones/medithon-trophy.webp", alt: "Medha Medithon 2026 trophy", w: 1000, h: 1333 },
      { src: "/milestones/medithon-vnit.webp", alt: "The trophy in the VNIT Nagpur auditorium", w: 1600, h: 1200 },
    ],
  },
  {
    id: "sih",
    mark: "SIH",
    title: "Smart India Hackathon",
    line: "Tech Garuda · PS 26187",
    period: "Team Tech Garuda · Problem Statement 26187 · 2026",
    summary: [
      "Participated in Smart India Hackathon as part of Team Tech Garuda, working on SENTINEL-X, an AI-powered intelligent border surveillance and security system.",
      "The project was designed around existing CCTV infrastructure and focused on real-time video analytics, human detection and tracking, vehicle detection, restricted-area monitoring, facial detection and automatic number plate recognition.",
    ],
    points: {
      label: "Technology",
      items: ["YOLO-based computer vision", "Real-time CCTV / RTSP streams", "Object detection and tracking", "ANPR", "AI-powered surveillance", "Real-time monitoring"],
    },
    closing: "Smart India Hackathon participant · Team Tech Garuda · Problem Statement 26187 · Project: SENTINEL-X.",
    images: [{ src: "/milestones/tech-garuda.webp", alt: "Team Tech Garuda logo", w: 1000, h: 1000 }],
    link: { href: "https://github.com/vinuah-dev/SIH-TECH-GARUDA", label: "SENTINEL-X on GitHub" },
  },
  {
    id: "intern",
    mark: "Intern",
    title: "Software Development Intern",
    line: "Shaibya Solution · 2026",
    period: "Shaibya Solution, Nagpur · 2026",
    summary: [
      "Software Development Intern at Shaibya Solution, Nagpur.",
      "Worked on production-oriented software development and gained practical experience in building, debugging and improving real-world applications.",
    ],
    points: {
      label: "Experience areas",
      items: ["Full-stack development", "Web application development", "API integration", "Database systems", "Git / version control", "Building production-ready features"],
    },
    closing: "This experience provided exposure to professional development workflows beyond academic projects.",
  },
  {
    id: "cse",
    mark: "Lead",
    title: "CSE Committee — Sports Co-Head",
    line: "Ramdeobaba University · 2026",
    period: "Ramdeobaba University · 2026",
    summary: [
      "Serving as Sports Co-Head of the CSE Committee at Ramdeobaba University, helping organise and coordinate sports activities and events for the Computer Science & Engineering department.",
    ],
    points: {
      label: "Responsibilities",
      items: ["Planning sports events", "Coordinating students and teams", "Managing event execution", "Student engagement", "Supporting department-level activities"],
    },
    closing: "This role demonstrates leadership, coordination, teamwork and the ability to manage responsibilities alongside technical academics.",
    images: [{ src: "/milestones/cse-committee.webp", alt: "Vineet in the CSE Committee blazer with his Sports Co-Head badge", w: 864, h: 1152 }],
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
    body: "A winner's trophy, a national runner-up spot, a Medithon Top 5 and an SIH build, each taken from idea to working demo.",
    type: "Competitions",
  },
  {
    period: "Projects",
    title: "Computer vision & AI systems",
    org: "SAFE-X AI · Jarvis · SENTINEL-X · CIPHER",
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
  Python: ["SAFE-X AI", "Jarvis", "SENTINEL-X", "CIPHER"],
  JavaScript: ["Revolution Gym", "SAFE-X AI"],
  HTML: ["Revolution Gym", "SAFE-X AI"],
  CSS: ["Revolution Gym", "SAFE-X AI"],
  FastAPI: ["SAFE-X AI", "SENTINEL-X"],
  WebSockets: ["SAFE-X AI", "SENTINEL-X"],
  YOLOv8: ["SAFE-X AI", "SENTINEL-X"],
  OpenCV: ["SAFE-X AI", "SENTINEL-X"],
  PaddleOCR: ["SENTINEL-X"],
  Firebase: ["Revolution Gym"],
  "Next.js": ["This site"],
  React: ["This site"],
  TypeScript: ["This site"],
  Tailwind: ["This site"],
};

// Repositories shown in the activity section (enriched with live data when available).
export const selectedRepos = [
  { name: "fire-vdo", blurb: "SAFE-X AI: browser-camera fire, smoke & occupancy detection with exit routing." },
  { name: "jarvis-ai", blurb: "Award-winning voice assistant for desktop automation & AI task execution." },
  { name: "SIH-TECH-GARUDA", blurb: "SENTINEL-X: intelligent border surveillance for SIH 2026." },
  { name: "fire-risk-detection-ai", blurb: "Real-time fire & smoke risk classification with computer vision." },
  { name: "Revolution-Gym", blurb: "Gym site, member portal & admin panel." },
  { name: "Fire", blurb: "SAFE-X AI core: detection, pathfinding and hospital simulation." },
];
