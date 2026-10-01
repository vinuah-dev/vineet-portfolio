"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { achievements, timeline } from "@/lib/data";
import { Reveal, SectionLabel, SplitText } from "../reveal";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative pt-32 md:pt-48">
      <div className="container-x">
        <SectionLabel index="03" label="Experience & milestones" />
        <SplitText
          as="h2"
          id="experience-title"
          text={"Shipped under\n*pressure.*"}
          className="display mt-8 text-[clamp(2.6rem,7vw,6.5rem)]"
        />
      </div>

      <Milestones />
      <Timeline />
    </section>
  );
}

/* ── Achievements: pinned horizontal scroll on desktop, stacked on mobile ── */

function Milestones() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setDistance(isDesktop ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <div
      ref={sectionRef}
      className="relative mt-16 md:mt-24"
      style={{ height: distance ? `calc(100svh + ${distance}px)` : undefined }}
    >
      <div className={distance ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden" : ""}>
        <motion.div
          ref={trackRef}
          style={{ x: distance ? x : 0 }}
          className="flex flex-col gap-4 px-5 md:w-max md:flex-row md:gap-6 md:px-10 xl:px-14 [@media(min-width:1360px)]:pl-[calc((100vw-1360px)/2+3.5rem)]"
        >
          {achievements.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 0.06}
              className="group relative flex min-h-[18rem] flex-col justify-between border border-line bg-bg-elev p-6 transition-colors duration-500 hover:border-line-strong md:h-[60svh] md:max-h-[34rem] md:min-h-[24rem] md:w-[min(30rem,38vw)] md:p-8"
            >
              <div className="flex items-start justify-between">
                <span className="micro text-fg-dim">0{i + 1}</span>
                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${a.title} repository`}
                    className="grid size-8 place-items-center border border-line text-fg-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
              <div>
                <div className="display text-[clamp(3.5rem,7vw,6.5rem)] text-fg transition-colors duration-500 group-hover:text-accent">
                  {a.mark}
                </div>
                <h3 className="mt-6 text-lg font-medium tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{a.note}</p>
              </div>
            </Reveal>
          ))}
          <div className="hidden w-[30vw] shrink-0 flex-col justify-end pb-2 md:flex">
            <p className="font-serif text-3xl italic leading-tight text-fg-muted">
              “Ideas are cheap. Working demos at 4 a.m. are not.”
            </p>
          </div>
        </motion.div>

        {distance > 0 && (
          <div className="container-x mt-10 flex items-center gap-4">
            <span className="micro text-fg-dim">Milestones</span>
            <div className="relative h-px flex-1 bg-line">
              <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-fg" />
            </div>
            <span className="micro text-fg-dim">0{achievements.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Timeline with scroll-driven progression ── */

function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });

  return (
    <div className="container-x mt-32 grid gap-12 md:grid-cols-12">
      <div className="md:col-span-4">
        <div className="md:sticky md:top-32">
          <h3 className="display text-4xl md:text-5xl">Timeline</h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            Education, internship, competitions and leadership. The short version.
          </p>
        </div>
      </div>

      <ol ref={ref} className="relative md:col-span-7 md:col-start-6">
        <div aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line">
          <motion.div style={{ scaleY }} className="absolute inset-0 origin-top bg-accent" />
        </div>
        {timeline.map((item) => (
          <TimelineItem key={item.title} item={item} />
        ))}
      </ol>
    </div>
  );
}

function TimelineItem({ item }: { item: (typeof timeline)[number] }) {
  const ref = useRef<HTMLLIElement>(null);
  const reached = useInView(ref, { margin: "0px 0px -40% 0px", once: true });

  return (
    <li ref={ref} className="relative pb-14 pl-10 last:pb-0 md:pb-20">
      <span
        aria-hidden
        className={`absolute left-0 top-1.5 size-[11px] border transition-colors duration-500 ${
          reached ? "border-accent bg-accent" : "border-line-strong bg-bg"
        }`}
      />
      <Reveal y={16}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="micro text-accent">{item.period}</span>
          <span className="micro text-fg-dim">· {item.type}</span>
        </div>
        <h4 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{item.title}</h4>
        <p className="mt-1 text-sm text-fg-muted">{item.org}</p>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-fg-dim">{item.body}</p>
      </Reveal>
    </li>
  );
}
