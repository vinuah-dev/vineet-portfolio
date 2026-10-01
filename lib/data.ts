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
  availability: "Open to internships & collaborations",
} as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export type ProjectVisual = "cipher" | "fire" | "jarvis" | "gauraksha" | "gym";

export type Project = {
  index: string;
  name: string;
  kind: string;
  summary: string;
  highlight: { label: string; value: string };
  features: string[];
  tags: string[];
  github?: string;
  live?: string;
  status?: string;
  visual: ProjectVisual;
};

export const projects: Project[] = [
  {
    index: "01",
    name: "CIPHER",
    kind: "Security · Local-first AI",
    summary:
      "A local-first AI security operations centre. Ingests logs, correlates events and triages threats on-device. No telemetry leaves the machine.",
    highlight: { label: "Key idea", value: "LLM-assisted triage that runs fully offline" },
    features: ["Log ingestion & correlation", "On-device threat triage", "Analyst-style incident summaries"],
    tags: ["Python", "Local LLMs", "Security", "SOC"],
    status: "In development",
    visual: "cipher",
  },
  {
    index: "02",
    name: "AI Fire Evacuation",
    kind: "Computer Vision · Safety",
    summary:
      "Turns existing CCTV feeds into a live safety layer. Detects fire and smoke, reads crowd density and routes people to the nearest safe exit.",
    highlight: { label: "Key feature", value: "Hazard-aware A* routing that avoids fire and congestion" },
    features: ["YOLOv8 fire & smoke detection", "Crowd density analysis", "Real-time evacuation routing"],
    tags: ["YOLOv8", "OpenCV", "A*", "Flask", "Python"],
    github: "https://github.com/vinuah-dev/fire-risk-detection-ai",
    visual: "fire",
  },
  {
    index: "03",
    name: "Jarvis",
    kind: "Voice AI · Automation",
    summary:
      "A voice-first desktop assistant. It listens, understands intent and acts: it opens apps, controls the browser, sends WhatsApp messages and picks the right AI for each task.",
    highlight: { label: "Key feature", value: "Multi-AI routing: each request goes to the best model for it" },
    features: ["Speech recognition & voice commands", "Desktop + WhatsApp automation", "Code & image generation"],
    tags: ["Python", "Speech Recognition", "LLM APIs", "Automation"],
    github: "https://github.com/vinuah-dev/jarvis-ai",
    visual: "jarvis",
  },
  {
    index: "04",
    name: "Gauraksha Care",
    kind: "Platform · NGO",
    summary:
      "An operations platform for cattle-welfare NGOs. Registry, health records and vaccination schedules in one calm dashboard.",
    highlight: { label: "Key feature", value: "Vaccination tracking with due-date visibility per animal" },
    features: ["Cow registry & health records", "Vaccination tracking", "Management dashboard"],
    tags: ["JavaScript", "Full-stack", "Dashboard"],
    github: "https://github.com/vinuah-dev/gauraksha-care-platform",
    visual: "gauraksha",
  },
  {
    index: "05",
    name: "Revolution Gym",
    kind: "Product · Membership",
    summary:
      "A modern gym platform covering members, referrals, an in-app shop, a points economy and health tracking, all on a Supabase backend.",
    highlight: { label: "Key feature", value: "Referral + points loop that rewards members for engagement" },
    features: ["Member management", "Referrals, points & shop", "Health tracking"],
    tags: ["Supabase", "PostgreSQL", "Auth", "Web"],
    github: "https://github.com/vinuah-dev/Revolution-Gym",
    visual: "gym",
  },
];

export const achievements = [
  {
    mark: "Winner",
    title: "ANVESHAN Innovation Competition",
    note: "First place for an applied AI build.",
  },
  {
    mark: "Top 10",
    title: "EFOS SkillUp India Hackathon",
    note: "Placed among the top 10 teams.",
  },
  {
    mark: "SIH",
    title: "Smart India Hackathon",
    note: "Team Tech Garuda: national-level problem statement.",
    link: "https://github.com/vinuah-dev/SIH-TECH-GARUDA",
  },
  {
    mark: "Build",
    title: "CodeRush 2.0",
    note: "Shipped a TypeScript product in a hackathon sprint.",
    link: "https://github.com/vinuah-dev/CodeRush2.0_Vardaan",
  },
];

// Keep descriptions short. Edit roles/orgs to match your exact history.
export const timeline = [
  {
    period: "Now",
    title: "B.Tech, Computer Science Engineering",
    org: "Ramdeobaba University, Nagpur",
    body: "Coursework in systems, algorithms and ML. Most of the learning happens in the build log.",
    type: "Education",
  },
  {
    period: "Internship",
    title: "Software Development Intern",
    org: "Industry internship",
    body: "Shipped production features end-to-end and learned how real teams review, test and deploy.",
    type: "Experience",
  },
  {
    period: "Hackathons",
    title: "Hackathons & technical competitions",
    org: "SIH · EFOS SkillUp · ANVESHAN · CodeRush",
    body: "Repeatedly taking ideas from zero to working demo in 24–48 hours.",
    type: "Competitions",
  },
  {
    period: "Projects",
    title: "Computer vision & AI systems",
    org: "Fire evacuation · Jarvis · CIPHER",
    body: "Applied CV and LLM systems built around real constraints such as latency, privacy and safety.",
    type: "Engineering",
  },
  {
    period: "Leadership",
    title: "Technical committee & team lead",
    org: "University & hackathon teams",
    body: "Leading small teams: scoping problems, splitting work and owning the final demo.",
    type: "Leadership",
  },
];

export const stack = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C++"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind", "Three.js", "HTML", "CSS"] },
  { group: "Backend", items: ["Node.js", "Express", "REST APIs", "Flask"] },
  { group: "AI / ML", items: ["TensorFlow", "OpenCV", "YOLOv8", "TFLite", "HuggingFace"] },
  { group: "Database", items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Firebase"] },
  { group: "Cloud / DevOps", items: ["AWS", "Google Cloud", "Docker", "GitHub Actions", "Cloudflare"] },
];

// Repositories shown in the activity section (enriched with live data when available).
export const selectedRepos = [
  { name: "fire-risk-detection-ai", blurb: "Real-time fire & smoke risk detection with computer vision." },
  { name: "jarvis-ai", blurb: "Voice assistant for desktop automation & AI task execution." },
  { name: "SIH-TECH-GARUDA", blurb: "Smart India Hackathon build by Team Tech Garuda." },
  { name: "gauraksha-care-platform", blurb: "Cattle management platform for NGOs." },
  { name: "Revolution-Gym", blurb: "Gym membership, referrals & points platform." },
  { name: "Fire", blurb: "Evacuation routing and hazard analysis experiments." },
];
