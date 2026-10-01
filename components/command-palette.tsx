"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Bot, Copy, CornerDownLeft, Flame, Hash, Mail, Search } from "lucide-react";
import { navItems, profile, projects, socials } from "@/lib/data";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./icons";

type Cmd = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const openUrl = (url: string) => window.open(url, url.startsWith("mailto") ? "_self" : "_blank", "noopener");

function buildCommands(notify: (msg: string) => void): Cmd[] {
  const iconFor = { email: Mail, linkedin: LinkedinIcon, instagram: InstagramIcon } as const;
  return [
    ...navItems.map((n) => ({ id: `nav-${n.id}`, group: "Navigate", label: n.label, hint: "Section", icon: Hash, run: () => scrollTo(n.id) })),
    { id: "nav-activity", group: "Navigate", label: "GitHub activity", hint: "Section", icon: Hash, run: () => scrollTo("activity") },
    { id: "nav-lab", group: "Navigate", label: "Lab: try the projects", hint: "Section", icon: Hash, run: () => scrollTo("lab") },
    ...projects.map((p) => ({
      id: `p-${p.slug}`,
      group: "Projects",
      label: p.name,
      hint: p.kind,
      keywords: p.tags.join(" "),
      icon: ArrowRight,
      run: () => document.getElementById(`project-${p.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
    })),
    { id: "a-jarvis", group: "Actions", label: "Talk to Jarvis", hint: "Voice assistant", keywords: "ai voice assistant chat", icon: Bot, run: () => window.dispatchEvent(new Event("jarvis:open")) },
    { id: "a-sim", group: "Actions", label: "Run the evacuation simulator", hint: "SAFEX AI demo", keywords: "fire a* path game", icon: Flame, run: () => scrollTo("lab") },
    {
      id: "a-copy",
      group: "Actions",
      label: "Copy email address",
      hint: profile.email,
      icon: Copy,
      run: () => navigator.clipboard?.writeText(profile.email).then(() => notify("Email copied")),
    },
    ...socials.map((s) => ({ id: `s-${s.id}`, group: "Connect", label: s.label, hint: s.value, icon: iconFor[s.id], run: () => openUrl(s.href) })),
    { id: "s-github", group: "Connect", label: "GitHub", hint: `@${profile.githubUser}`, icon: GithubIcon, run: () => openUrl(profile.github) },
  ];
}

function score(cmd: Cmd, q: string) {
  if (!q) return 1;
  const hay = `${cmd.label} ${cmd.hint ?? ""} ${cmd.keywords ?? ""} ${cmd.group}`.toLowerCase();
  const needle = q.toLowerCase().trim();
  if (hay.includes(needle)) return 2 + (cmd.label.toLowerCase().startsWith(needle) ? 1 : 0);
  // subsequence match ("gh" → GitHub)
  let j = 0;
  for (const ch of hay) if (ch === needle[j]) j++;
  return j === needle.length ? 0.5 : 0;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const commands = useMemo(
    () =>
      buildCommands((m) => {
        setToast(m);
        setTimeout(() => setToast(null), 1600);
      }),
    [],
  );
  const results = useMemo(
    () =>
      commands
        .map((c) => ({ c, s: score(c, q) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => r.c),
    [commands, q],
  );

  const show = () => {
    restoreFocus.current = document.activeElement as HTMLElement;
    setQ("");
    setSel(0);
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    restoreFocus.current?.focus?.();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) hide();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  });

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  const run = (c?: Cmd) => {
    if (!c) return;
    setOpen(false);
    // Let the dialog close before scrolling/opening things.
    setTimeout(() => c.run(), 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[sel]);
    } else if (e.key === "Escape") {
      hide();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-start justify-center bg-bg/60 px-4 pt-[14vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={hide}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden border border-line-strong bg-bg-elev/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search className="size-4 text-fg-dim" />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setSel(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search sections, projects, actions…"
                  aria-label="Search commands"
                  aria-controls="palette-list"
                  aria-activedescendant={results[sel] ? `cmd-${results[sel].id}` : undefined}
                  className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-fg-dim"
                />
                <kbd className="micro border border-line px-1.5 py-0.5 text-fg-dim">Esc</kbd>
              </div>
              <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-1.5">
                {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-fg-dim">Nothing matches “{q}”.</li>}
                {results.map((c, i) => {
                  const header = !q && (i === 0 || results[i - 1].group !== c.group);
                  const Icon = c.icon;
                  return (
                    <li key={c.id} role="presentation">
                      {header && <p className="micro px-3 pb-1 pt-3 text-fg-dim">{c.group}</p>}
                      <button
                        id={`cmd-${c.id}`}
                        role="option"
                        aria-selected={i === sel}
                        type="button"
                        onMouseMove={() => setSel(i)}
                        onClick={() => run(c)}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${i === sel ? "bg-white/[0.06]" : ""}`}
                      >
                        <Icon className={`size-4 ${i === sel ? "text-accent" : "text-fg-dim"}`} />
                        <span className="flex-1 truncate text-sm">{c.label}</span>
                        {c.hint && <span className="truncate font-mono text-[11px] text-fg-dim">{c.hint}</span>}
                        {i === sel && <CornerDownLeft className="size-3.5 text-fg-dim" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="micro flex items-center justify-between border-t border-line px-4 py-2.5 text-fg-dim">
                <span>↑↓ to move · ↵ to run</span>
                <span>⌘K / Ctrl K</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 border border-line-strong bg-bg-elev px-4 py-2 text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
