"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { navItems, profile } from "@/lib/data";
import { Magnetic } from "./magnetic";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Active section tracking: a section is "active" while it crosses the viewport's middle band.
  useEffect(() => {
    // Observe every top-level section so non-nav sections (hero, activity) clear the indicator.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,padding] duration-500 ${
          scrolled || open
            ? "border-b border-line bg-bg/70 py-3 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent py-5"
        }`}
      >
        <nav aria-label="Primary" className="container-x flex items-center justify-between gap-6">
          <a href="#top" className="group flex items-center gap-3" aria-label={`${profile.name}, back to top`}>
            <span className="grid size-8 place-items-center border border-line-strong font-mono text-[11px] font-medium tracking-tight transition-colors group-hover:border-accent group-hover:text-accent">
              {profile.initials}
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:block">
              {profile.shortName}
            </span>
          </a>

          <ul className="hidden items-center gap-1 rounded-full border border-line bg-white/[0.02] p-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-4 py-1.5 text-[13px] transition-colors ${
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-5 md:flex">
            <span className="micro hidden items-center gap-2 text-fg-dim lg:flex">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-ok" />
              Available
            </span>
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-[13px] font-medium text-bg transition-colors hover:bg-accent"
              >
                Let&apos;s talk
              </a>
            </Magnetic>
          </div>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative -mr-2 grid size-10 place-items-center md:hidden"
          >
            <span
              className={`absolute h-px w-5 bg-fg transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`absolute h-px w-5 bg-fg transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-bg pt-24 md:hidden"
          >
            <ul className="container-x flex flex-1 flex-col justify-center gap-1">
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="display text-5xl">{item.label}</span>
                    <span className="micro text-fg-dim">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="container-x flex items-center justify-between pb-10 pt-6">
              <a href={`mailto:${profile.email}`} className="text-sm text-fg-muted">
                {profile.email}
              </a>
              <span className="micro flex items-center gap-2 text-fg-dim">
                <span className="animate-pulse-dot size-1.5 rounded-full bg-ok" /> Available
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
