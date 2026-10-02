"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";
import { achievements, profile, projects } from "@/lib/data";

/**
 * "Portfolio mode" Jarvis: a tiny rule-based intent router that runs entirely in
 * the browser. Visitors can type or speak; it answers and drives the page.
 */

type Msg = { from: "you" | "jarvis" | "router"; text: string };
type Reply = { intent: string; text: string; action?: () => void };

const go = (id: string, block: ScrollLogicalPosition = "start") =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block });
const open = (url: string) => window.open(url, url.startsWith("mailto") ? "_self" : "_blank", "noopener");
const project = (slug: string) => projects.find((p) => p.slug === slug)!;

const SUGGESTIONS = ["Who is Vineet?", "Show me his projects", "Biggest win?", "Run the fire sim", "How do I contact him?"];

function route(raw: string): Reply {
  const q = raw.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("instagram", "insta")) return { intent: "open.instagram", text: `Opening Instagram, @${profile.instagramHandle}.`, action: () => open(profile.instagram) };
  if (has("linkedin")) return { intent: "open.linkedin", text: "Opening LinkedIn.", action: () => open(profile.linkedin) };
  if (has("github", "repo", "code")) return { intent: "open.github", text: "Opening GitHub. Public builds live there.", action: () => open(profile.github) };
  if (has("mail", "gmail")) return { intent: "open.email", text: `Composing an email to ${profile.email}.`, action: () => open(`mailto:${profile.email}`) };

  if (has("sim", "simulat", "play", "demo", "try"))
    return { intent: "lab.evac", text: "Loading the SAFE-X evacuation simulator. Click the floor plan to start fires and watch A* re-route everyone.", action: () => go("lab") };
  if (has("safex", "fire", "evacuat", "medithon"))
    return { intent: "project.safex", text: `${project("safex").summary} It placed Top 5 at Medha Medithon 2026.`, action: () => go("project-safex", "center") };
  if (has("sentinel", "sih", "border", "surveil", "garuda"))
    return { intent: "project.sentinel", text: project("sentinel").summary, action: () => go("project-sentinel", "center") };
  if (has("cipher", "soc", "cyber", "security"))
    return { intent: "project.cipher", text: project("cipher").summary, action: () => go("project-cipher", "center") };
  if (has("gym", "revolution"))
    return { intent: "project.revolution", text: project("revolution").summary, action: () => go("project-revolution", "center") };
  if (has("jarvis", "yourself", "who are you", "what are you"))
    return {
      intent: "project.jarvis",
      text: "I'm a small web cousin of the real one. Vineet's Jarvis won ANVESHAN 2026, and its latest build, NIVA NEXUS, writes and tests its own new skills on demand.",
      action: () => go("project-jarvis", "center"),
    };

  if (has("project", "work", "built", "build", "portfolio"))
    return { intent: "work.list", text: `Five featured builds: ${projects.map((p) => p.name).join(", ")}. Taking you there.`, action: () => go("work") };
  if (has("win", "award", "achiev", "hackathon", "prize", "competition", "anveshan", "efos"))
    return {
      intent: "milestones",
      text: `Highlights: ${achievements.slice(0, 3).map((a) => `${a.mark}, ${a.title}`).join("; ")}. Plus Smart India Hackathon with Team Tech Garuda.`,
      action: () => go("experience"),
    };
  if (has("intern", "experience", "job", "shaibya", "committee", "sports", "lead"))
    return { intent: "experience", text: "He interned as a Software Development Intern at Shaibya Solution, and he's Sports Co-Head of the CSE Committee at Ramdeobaba University.", action: () => go("experience") };
  if (has("skill", "stack", "tech", "language", "know"))
    return { intent: "stack", text: "Python and TypeScript first; React and Next.js on the front; FastAPI and Node behind; YOLOv8 and OpenCV for vision.", action: () => go("stack") };
  if (has("contact", "hire", "reach", "talk", "email", "connect", "dm"))
    return { intent: "contact", text: `Three ways: Gmail at ${profile.email}, LinkedIn, or Instagram @${profile.instagramHandle}.`, action: () => go("contact") };
  if (has("who", "about", "vineet", "student", "college", "university"))
    return {
      intent: "about",
      text: "Vineet Rohit Shah is a Computer Science Engineering student at Ramdeobaba University, Nagpur. He builds AI systems and full-stack products, and has a hackathon trophy to show for it.",
      action: () => go("about"),
    };
  if (has("time", "clock"))
    return {
      intent: "time",
      text: `It's ${new Intl.DateTimeFormat("en-GB", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit" }).format(new Date())} in Nagpur.`,
    };
  if (has("hello", "hi", "hey", "namaste", "yo"))
    return { intent: "greet", text: "Hello. Ask me about Vineet's projects, wins or how to reach him. You can also just say “run the fire sim”." };
  if (has("help", "can you", "command"))
    return { intent: "help", text: "Try: who is Vineet, show projects, tell me about SENTINEL-X, biggest win, run the fire sim, open LinkedIn." };

  return { intent: "fallback", text: "I'm running offline in portfolio mode, so my vocabulary is small. Try “show projects”, “biggest win” or “contact”." };
}

type SR = { start(): void; stop(): void; lang: string; interimResults: boolean; onresult: ((e: { results: { 0: { transcript: string } }[] }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

const noopSubscribe = () => () => {};
function speechCtor() {
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function Jarvis() {
  const [isOpen, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "jarvis", text: "Good to see you. I'm Jarvis, running in portfolio mode. Ask me anything about Vineet, or tap a suggestion." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [thinking, setThinking] = useState(false);
  const canListen = useSyncExternalStore(noopSubscribe, () => !!speechCtor(), () => false);
  const recog = useRef<SR | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("jarvis:open", onOpen);
    // Easter egg: type "jarvis" anywhere on the page.
    let buf = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea")) return;
      buf = (buf + e.key.toLowerCase()).slice(-6);
      if (buf === "jarvis") setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("jarvis:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 250);
    else {
      recog.current?.stop();
      window.speechSynthesis?.cancel();
    }
  }, [isOpen]);

  const say = useCallback(
    (text: string, voice: boolean) => {
      if (!voice || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.04;
      u.pitch = 0.9;
      const v = window.speechSynthesis.getVoices().find((x) => /en-(GB|IN)/.test(x.lang));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    },
    [],
  );

  const ask = useCallback(
    (text: string, viaVoice = false) => {
      const clean = text.trim();
      if (!clean) return;
      const reply = route(clean);
      setMsgs((m) => [...m, { from: "you", text: clean }, { from: "router", text: `intent=${reply.intent} · model=local` }]);
      setInput("");
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setMsgs((m) => [...m, { from: "jarvis", text: reply.text }]);
        say(reply.text, speak || viaVoice);
        if (reply.action) setTimeout(reply.action, 500);
      }, 450);
    },
    [say, speak],
  );

  const toggleMic = () => {
    if (!recog.current) {
      const Ctor = speechCtor();
      if (!Ctor) return;
      recog.current = new Ctor();
      recog.current.lang = "en-IN";
      recog.current.interimResults = false;
    }
    const r = recog.current;
    if (listening) {
      r.stop();
      return;
    }
    r.onresult = (e) => ask(e.results[0][0].transcript, true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    try {
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ delay: 0.2 }}
            onClick={() => setOpen(true)}
            aria-label="Open Jarvis assistant"
            data-cursor="Ask Jarvis"
            className="group fixed bottom-5 right-5 z-[70] flex [html[data-menu=open]_&]:hidden items-center gap-3 rounded-full border border-line-strong bg-bg/80 py-2 pl-2 pr-4 backdrop-blur-xl transition-colors hover:border-accent md:bottom-8 md:right-8"
          >
            <Orb size={32} active={false} />
            <span className="text-[13px] font-medium">
              Ask Jarvis <span className="hidden font-mono text-[11px] text-fg-dim sm:inline">· voice</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Jarvis assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            className="fixed inset-x-3 bottom-3 z-[75] flex max-h-[78svh] flex-col overflow-hidden border border-line-strong bg-bg/90 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-8 sm:right-8 sm:w-[24rem]"
          >
            <header className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-3">
                <Orb size={28} active={listening || thinking} />
                <div>
                  <p className="font-mono text-[12px] tracking-[0.25em]">J.A.R.V.I.S</p>
                  <p className="micro text-[9px] text-fg-dim">{listening ? "Listening…" : thinking ? "Routing…" : "Portfolio mode · offline"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSpeak((s) => !s);
                    window.speechSynthesis?.cancel();
                  }}
                  aria-pressed={speak}
                  aria-label={speak ? "Mute voice replies" : "Speak replies aloud"}
                  className="grid size-8 place-items-center text-fg-dim transition-colors hover:text-fg"
                >
                  {speak ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                </button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close Jarvis" className="grid size-8 place-items-center text-fg-dim transition-colors hover:text-fg">
                  <X className="size-4" />
                </button>
              </div>
            </header>

            <div ref={log} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {msgs.map((m, i) =>
                m.from === "router" ? (
                  <p key={i} className="font-mono text-[10px] text-accent/80">
                    router › {m.text}
                  </p>
                ) : (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[88%] text-[13px] leading-relaxed ${
                      m.from === "you" ? "ml-auto border border-line bg-white/[0.04] px-3 py-2 text-fg" : "text-fg-muted"
                    }`}
                  >
                    {m.from === "jarvis" && <span className="mr-1.5 font-mono text-[11px] text-ok">jarvis ›</span>}
                    {m.text}
                  </motion.p>
                ),
              )}
              {thinking && (
                <div className="flex gap-1" aria-hidden>
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="animate-pulse-dot size-1.5 rounded-full bg-fg-dim" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="shrink-0 border border-line px-2.5 py-1 text-[11px] text-fg-muted transition-colors hover:border-accent hover:text-fg"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-line p-2"
            >
              {canListen && (
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-pressed={listening}
                  aria-label={listening ? "Stop listening" : "Speak to Jarvis"}
                  className={`grid size-10 shrink-0 place-items-center border transition-colors ${
                    listening ? "border-accent bg-accent text-bg" : "border-line text-fg-muted hover:border-fg hover:text-fg"
                  }`}
                >
                  {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={canListen ? "Type, or tap the mic…" : "Ask about projects, wins, contact…"}
                aria-label="Message Jarvis"
                className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-fg-dim"
              />
              <button type="submit" aria-label="Send" className="grid size-10 shrink-0 place-items-center bg-fg text-bg transition-colors hover:bg-accent">
                <Send className="size-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

/** The Jarvis core: concentric rings + glowing centre, pulses when active. */
function Orb({ size, active }: { size: number; active: boolean }) {
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} aria-hidden>
      <span className={`absolute inset-0 rounded-full border border-accent/50 ${active ? "animate-ping" : ""}`} />
      <span className="absolute inset-[18%] rounded-full border border-accent/40" />
      <span className="animate-glow size-[34%] rounded-full bg-accent shadow-[0_0_16px_4px_rgba(255,107,53,0.6)]" />
    </span>
  );
}
