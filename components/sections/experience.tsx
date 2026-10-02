"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { MilestoneDetail } from "../milestone-detail";
import { achievements, timeline } from "@/lib/data";
import { Reveal, SectionLabel, SplitText } from "../reveal";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative pt-32 md:pt-48">
      <div className="container-x">
        <SectionLabel index="04" label="Experience & milestones" />
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
  const [open, setOpen] = useState<number | null>(null);

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
            <Reveal key={a.id} delay={i * 0.06} className="shrink-0 md:w-[min(26rem,34vw)]">
              <button
                type="button"
                onClick={() => setOpen(i)}
                data-cursor="Open"
                aria-label={`${a.mark}: ${a.title}. Open details`}
                className="group relative flex h-full min-h-[20rem] w-full flex-col justify-between overflow-hidden border border-line bg-bg-elev p-6 text-left transition-colors duration-500 hover:border-line-strong md:h-[60svh] md:max-h-[34rem] md:min-h-[24rem] md:p-8"
              >
                {a.images?.[0] && (
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[58%] overflow-hidden">
                    <Image
                      src={a.images[0].src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 26rem, 100vw"
                      className="object-cover opacity-40 grayscale transition duration-700 ease-[var(--ease-out)] group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
                    />
                    <span className="absolute inset-0 bg-gradient-to-b from-bg-elev/20 via-bg-elev/40 to-bg-elev" />
                  </span>
                )}
                <span className="relative flex items-start justify-between">
                  <span className="micro bg-bg-elev/85 px-1.5 py-0.5 text-fg-muted">0{i + 1}</span>
                  <span className="grid size-9 place-items-center border border-line bg-bg-elev/85 text-fg-muted transition duration-500 group-hover:rotate-90 group-hover:border-accent group-hover:text-accent">
                    <Plus className="size-4" />
                  </span>
                </span>
                <span className="relative block">
                  <span
                    className={`display block whitespace-nowrap uppercase text-fg transition-colors duration-500 group-hover:text-accent ${
                      a.mark.length > 6 ? "text-[clamp(2.5rem,4.4vw,4.25rem)]" : "text-[clamp(3rem,6vw,5.75rem)]"
                    }`}
                  >
                    {a.mark}
                  </span>
                  <span className="mt-5 block text-lg font-medium leading-snug tracking-tight">{a.title}</span>
                  <span className="mt-2 block font-mono text-[12px] tracking-wide text-fg-dim">{a.line}</span>
                  <span className="micro mt-6 flex items-center gap-2 text-fg-muted opacity-100 transition duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    View details <ArrowRight className="size-3.5" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
          <div className="hidden w-[30vw] shrink-0 flex-col justify-end pb-2 md:flex">
            <p className="font-serif text-3xl italic leading-tight text-fg-muted">
              “Ideas are cheap. Working demos at 4 a.m. are not.”
            </p>
          </div>
        </motion.div>

        <MilestoneDetail items={achievements} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />

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
