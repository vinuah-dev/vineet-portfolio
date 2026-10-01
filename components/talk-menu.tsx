"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { profile, socials } from "@/lib/data";
import { InstagramIcon, LinkedinIcon } from "./icons";
import { Magnetic } from "./magnetic";

export const socialIcon = { email: Mail, linkedin: LinkedinIcon, instagram: InstagramIcon } as const;

/** "Let's talk" button that opens the three contact channels. */
export function TalkMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div ref={root} className="relative">
      <Magnetic>
        <button
          ref={button}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="true"
          className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-[13px] font-medium text-bg transition-colors hover:bg-accent"
        >
          Let&apos;s talk
          <span className={`inline-block transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
        </button>
      </Magnetic>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+12px)] w-72 origin-top-right border border-line-strong bg-bg/90 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <p className="micro px-3 pb-2 pt-2 text-fg-dim">Pick a channel</p>
            <ul>
              {socials.map((s, i) => {
                const Icon = socialIcon[s.id];
                return (
                  <motion.li key={s.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <a
                      href={s.href}
                      target={s.id === "email" ? undefined : "_blank"}
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                    >
                      <span className="grid size-8 place-items-center border border-line text-fg-muted transition-colors group-hover:border-accent group-hover:text-accent">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium">{s.label}</span>
                        <span className="block truncate font-mono text-[11px] text-fg-dim">{s.value}</span>
                      </span>
                      <ArrowUpRight className="size-3.5 text-fg-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                    </a>
                  </motion.li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={copy}
              className="mt-1 flex w-full items-center justify-center gap-2 border-t border-line px-3 py-2.5 text-[12px] text-fg-muted transition-colors hover:text-fg"
            >
              {copied ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
              {copied ? "Email copied" : "Copy email address"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
