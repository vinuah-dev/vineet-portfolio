"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import { SignalField } from "../signal-field";
import { LocalTime } from "../local-time";
import { Magnetic } from "../magnetic";

const HEADLINE: { text: string; serif?: boolean }[][] = [
  [{ text: "Software" }, { text: "that" }],
  [{ text: "sees," }, { text: "listens" }],
  [{ text: "&" }, { text: "thinks.", serif: true }],
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  let n = 0;

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="noise relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-32"
    >
      {/* Background: signal field + soft light + hairline grid */}
      <motion.div style={{ scale: fieldScale }} className="absolute inset-0 -z-10">
        <SignalField className="absolute inset-0 size-full" />
        <div className="absolute -top-1/3 left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,107,53,0.10),transparent)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-bg" />
      </motion.div>

      <motion.div style={{ y, opacity }} className="container-x relative flex flex-1 flex-col">
        <div className="fade-in micro flex flex-wrap items-center gap-x-4 gap-y-2 text-fg-dim" style={{ animationDelay: "0.1s" }}>
          <span className="text-fg-muted">Computer Science × AI × Software</span>
          <span className="hidden h-px w-10 bg-line-strong sm:block" />
          <span className="hidden sm:inline">Portfolio / {new Date().getFullYear()}</span>
        </div>

        <h1
          className="display mt-8 text-[clamp(3.1rem,min(14vw,17svh),9.75rem)] md:mt-10"
          aria-label="Software that sees, listens and thinks."
        >
          {HEADLINE.map((line, li) => (
            <span key={li} aria-hidden className="block">
              {line.map((word, wi) => {
                const i = n++;
                return (
                  <span key={wi} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                    <span
                      className={`rise ${word.serif ? "font-serif font-normal italic tracking-[-0.03em] text-accent" : ""}`}
                      style={{ animationDelay: `${0.15 + i * 0.07}s` }}
                    >
                      {word.text}
                    </span>
                    {wi < line.length - 1 && " "}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="mt-auto grid gap-10 pb-10 pt-10 md:grid-cols-12 md:items-end md:pb-12">
          <div className="fade-in md:col-span-6 lg:col-span-5" style={{ animationDelay: "0.7s" }}>
            <p className="max-w-md text-base leading-relaxed text-fg-muted md:text-lg">
              Computer Science student &amp; developer building AI-powered products, full-stack systems
              and experimental technology.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#work"
                  className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent"
                >
                  View work
                  <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium transition-colors hover:border-fg"
                >
                  Contact me
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
            </div>
          </div>

          <dl
            className="fade-in grid grid-cols-2 gap-px self-end overflow-hidden border border-line bg-line text-xs md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9"
            style={{ animationDelay: "0.9s" }}
          >
            {[
              {
                k: "Status",
                v: (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse-dot size-1.5 rounded-full bg-ok" /> Available
                  </span>
                ),
              },
              { k: "Local", v: <LocalTime timeZone={profile.timezone} /> },
              { k: "Based", v: `${profile.city}, IN` },
              { k: "Focus", v: "AI · CV · Full-stack" },
            ].map((row) => (
              <div key={row.k} className="bg-bg/80 px-4 py-3 backdrop-blur">
                <dt className="micro text-fg-dim">{row.k}</dt>
                <dd className="mt-1 font-mono text-[12px] text-fg">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      <a
        href="#about"
        className="fade-in group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
        style={{ animationDelay: "1.2s" }}
        aria-label="Scroll to about section"
      >
        <span className="micro text-fg-dim transition-colors group-hover:text-fg">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-fg" />
        </span>
      </a>
    </section>
  );
}
