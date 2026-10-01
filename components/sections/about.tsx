"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/lib/data";
import { Reveal, ScrollWords, SectionLabel } from "../reveal";

const focus = [
  { k: "Full-stack", v: "Products from schema to interface: Next.js, Node, Postgres, Supabase." },
  { k: "AI / ML", v: "Computer vision and LLM systems that run under real constraints." },
  { k: "Build culture", v: "Hackathons, fast prototypes and leading small teams to a demo." },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative pt-32 md:pt-48">
      <div className="container-x">
        <SectionLabel index="01" label="About" />
        <h2 id="about-title" className="sr-only">
          About
        </h2>

        <ScrollWords
          text="I like building things that sit at the intersection of *software,* *artificial* *intelligence* and real-world problems."
          className="mt-10 max-w-[18ch] text-[clamp(2.1rem,6vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.04em]"
        />

        <div className="mt-20 grid gap-12 border-t border-line pt-10 md:mt-32 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <dl className="space-y-5 text-sm">
              {[
                ["Studying", "B.Tech, Computer Science Engineering"],
                ["University", `${profile.university}, ${profile.city}`],
                ["Location", `${profile.city}, ${profile.country} · ${profile.coords}`],
                ["Currently", "Building CIPHER, a local-first AI SOC"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-4">
                  <dt className="micro pt-0.5 text-fg-dim">{k}</dt>
                  <dd className="text-fg-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <p className="text-lg leading-relaxed text-fg md:text-xl">
                I&apos;m Vineet, a Computer Science Engineering student at {profile.university}, Nagpur. I
                build full-stack products and AI systems, and I&apos;m most at home where models meet
                messy, real inputs like a CCTV feed, a voice command or a security log.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-fg-muted">
                Hackathons taught me to ship. Projects taught me to make things hold up. I care about
                clean architecture, fast interfaces and software that does one thing really well.
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
              {focus.map((f, i) => (
                <Reveal as="li" key={f.k} delay={0.1 + i * 0.08} className="bg-bg p-5">
                  <span className="micro text-accent">0{i + 1}</span>
                  <h3 className="mt-6 text-sm font-medium">{f.k}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-fg-dim">{f.v}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Disciplines />
    </section>
  );
}

const DISCIPLINES = ["Computer Vision", "LLM Systems", "Full-stack", "Automation", "Security", "Product"];

/** Oversized discipline ribbon that slides horizontally with scroll. */
function Disciplines() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  const row = (key: string) =>
    DISCIPLINES.map((d) => (
      <span key={`${key}-${d}`} className="flex items-center gap-[0.4em] pr-[0.4em]">
        {d}
        <span className="inline-block size-[0.18em] rotate-45 bg-accent/70" />
      </span>
    ));

  return (
    <div ref={ref} aria-hidden className="mt-32 select-none overflow-hidden border-y border-line py-6 md:mt-48 md:py-10">
      <motion.div
        style={{ x: x1 }}
        className="display flex whitespace-nowrap text-[clamp(2.5rem,8vw,7rem)] text-fg"
      >
        {row("a")}
        {row("b")}
      </motion.div>
      <motion.div
        style={{ x: x2 }}
        className="flex whitespace-nowrap font-serif text-[clamp(2.5rem,8vw,7rem)] italic leading-[1.05] text-transparent [-webkit-text-stroke:1px_var(--line-strong)]"
      >
        {row("c")}
        {row("d")}
      </motion.div>
    </div>
  );
}
