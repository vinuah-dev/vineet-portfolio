"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Portal } from "./portal";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Milestone } from "@/lib/data";

/** Expanded case-study view for a milestone: gallery + full write-up. */
export function MilestoneDetail({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: Milestone[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const m = open ? items[index] : null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const [shot, setShot] = useState(0);
  const [shownFor, setShownFor] = useState<string | null>(null);
  if (m && shownFor !== m.id) {
    setShownFor(m.id);
    setShot(0);
  }

  useEffect(() => {
    if (!open) return;
    const restore = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      restore?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onIndex]);

  const imgs = m?.images ?? [];
  const current = imgs[Math.min(shot, Math.max(0, imgs.length - 1))];
  const next = index !== null ? items[(index + 1) % items.length] : null;

  return (
    <Portal>
    <AnimatePresence>
      {m && index !== null && (
        <motion.div
          className="fixed inset-0 z-[80] flex justify-end bg-bg/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="milestone-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full w-full flex-col overflow-y-auto border-l border-line-strong bg-bg-elev md:w-[min(46rem,92vw)]"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg-elev/90 px-5 py-4 backdrop-blur md:px-8">
              <span className="micro text-fg-dim">
                <span className="text-accent">0{index + 1}</span> / 0{items.length} · Experience
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="grid size-10 place-items-center border border-line transition-colors hover:border-fg"
              >
                <X className="size-4" />
              </button>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1"
              >
                {current && (
                  <div className="border-b border-line">
                    <div className="relative aspect-[16/10] w-full bg-[#0b0b0e]">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={current.src}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0"
                        >
                          <Image src={current.src} alt={current.alt} fill sizes="(min-width: 768px) 46rem, 100vw" className="object-contain" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    {imgs.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:none]" role="tablist" aria-label="Photos">
                        {imgs.map((im, i) => (
                          <button
                            key={im.src}
                            type="button"
                            role="tab"
                            aria-selected={i === shot}
                            aria-label={im.alt}
                            onClick={() => setShot(i)}
                            className={`relative h-14 w-20 shrink-0 overflow-hidden border transition ${i === shot ? "border-accent" : "border-line opacity-50 hover:opacity-100"}`}
                          >
                            <Image src={im.src} alt="" fill sizes="80px" className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="px-5 py-8 md:px-8 md:py-10">
                  <div className="display text-[clamp(3rem,8vw,5.5rem)] text-accent">{m.mark}</div>
                  <h2 id="milestone-title" className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
                    {m.title}
                  </h2>
                  <p className="micro mt-3 text-fg-dim">{m.period}</p>

                  <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-fg-muted">
                    {m.summary.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>

                  <div className="mt-8 border-l border-accent pl-5">
                    <p className="micro text-fg-dim">{m.points.label}</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {m.points.items.map((it) => (
                        <li key={it} className="flex items-start gap-2.5 text-sm text-fg">
                          <span className="mt-[0.55em] size-1 shrink-0 rotate-45 bg-accent" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {m.closing && <p className="mt-8 text-sm leading-relaxed text-fg-dim">{m.closing}</p>}

                  {m.link && (
                    <a
                      href={m.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group mt-8 inline-flex items-center gap-2 text-sm font-medium"
                    >
                      <span className="link-underline">{m.link.label}</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <footer className="sticky bottom-0 mt-auto flex items-center justify-between gap-3 border-t border-line bg-bg-elev/90 px-5 py-3 backdrop-blur md:px-8">
              <button
                type="button"
                onClick={() => onIndex((index - 1 + items.length) % items.length)}
                aria-label="Previous milestone"
                className="grid size-10 place-items-center border border-line transition-colors hover:border-fg"
              >
                <ArrowLeft className="size-4" />
              </button>
              {next && (
                <button
                  type="button"
                  onClick={() => onIndex((index + 1) % items.length)}
                  className="group flex min-w-0 flex-1 items-center justify-end gap-3 text-right"
                >
                  <span className="min-w-0">
                    <span className="micro block text-fg-dim">Next</span>
                    <span className="block truncate text-sm font-medium">{next.title}</span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center border border-line transition-colors group-hover:border-accent group-hover:text-accent">
                    <ArrowRight className="size-4" />
                  </span>
                </button>
              )}
            </footer>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
    </Portal>
  );
}
