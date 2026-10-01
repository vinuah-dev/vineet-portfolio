"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects, profile, type Project } from "@/lib/data";
import { ProjectMedia } from "../project-media";
import { Reveal, SectionLabel, SplitText } from "../reveal";
import { GithubIcon } from "../icons";

export function Work() {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-32 md:pt-48">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02" label="Selected work" />
            <SplitText
              id="work-title"
              text={"Case studies in\n*applied* engineering."}
              className="display mt-8 text-[clamp(2.6rem,7vw,6.5rem)]"
            />
          </div>
          <Reveal className="max-w-xs text-sm leading-relaxed text-fg-muted md:pb-3">
            Five builds across computer vision, voice AI, surveillance, security and product. Real
            screenshots: tap one to expand it.
          </Reveal>
        </div>

        <div className="relative mt-16 md:mt-28 lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Project narratives */}
          <ol className="lg:col-span-5">
            {projects.map((p, i) => (
              <ProjectEntry key={p.name} project={p} onActive={() => setActive(i)} />
            ))}
          </ol>

          {/* Sticky visual (desktop) */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-0 flex h-[100svh] items-center">
              <div className="relative w-full">
                <div className="mb-4 flex items-center justify-between">
                  <span className="micro text-fg-dim">
                    <span className="text-fg">{current.index}</span> / {String(projects.length).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {projects.map((p, i) => (
                      <button
                        key={p.name}
                        type="button"
                        aria-label={`Jump to ${p.name}`}
                        onClick={() => document.getElementById(`project-${p.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                        className="group/dot py-2"
                      >
                        <span
                          className={`block h-px transition-all duration-500 ${i === active ? "w-10 bg-accent" : "w-4 bg-line-strong group-hover/dot:w-6 group-hover/dot:bg-fg"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <VisualStage project={current} />
                <div className="mt-4 flex items-center justify-between">
                  <span className="micro text-fg-dim">{current.kind}</span>
                  <span className="micro text-fg-dim">{current.tags.slice(0, 3).join(" · ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-fg-muted">More experiments, hackathon builds and work-in-progress live on GitHub.</p>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium"
          >
            <span className="link-underline">github.com/{profile.githubUser}</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function VisualStage({ project }: { project: Project }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={project.slug}
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <ProjectMedia project={project} />
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectEntry({ project, onActive }: { project: Project; onActive: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const mobileScale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const mobileY = useTransform(scrollYProgress, [0, 1], [40, 0]);

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <li ref={ref} id={`project-${project.slug}`} className="scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0 md:py-20 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0">
      {/* Inline visual (mobile/tablet) */}
      <motion.div style={{ scale: mobileScale, y: mobileY }} className="mb-10 w-full lg:hidden">
        <ProjectMedia project={project} />
      </motion.div>

      <Reveal y={16}>
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">{project.index}</span>
          <span className="micro text-fg-dim">{project.kind}</span>
          {project.status && (
            <span className="micro ml-auto border border-line px-2 py-0.5 text-fg-muted">{project.status}</span>
          )}
        </div>
      </Reveal>

      <SplitText as="h3" text={project.name} className="display mt-5 text-[clamp(2.5rem,5vw,4.5rem)]" stagger={0.06} />

      {project.badge && (
        <Reveal delay={0.05}>
          <span className="micro mt-5 inline-flex items-center gap-2 border border-accent/40 bg-accent-soft px-2.5 py-1 text-accent">
            <span className="size-1 rotate-45 bg-accent" />
            {project.badge}
          </span>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-md leading-relaxed text-fg-muted">{project.summary}</p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 border-l border-accent pl-4">
          <div className="micro text-fg-dim">{project.highlight.label}</div>
          <p className="mt-1 text-sm text-fg">{project.highlight.value}</p>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <ul className="mt-8 space-y-2 text-sm text-fg-muted">
          {project.features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span className="h-px w-3 bg-fg-dim" />
              {f}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.25}>
        <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t} className="border border-line px-2.5 py-1 font-mono text-[11px] text-fg-muted">
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
          {project.github ? (
            <a href={project.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 font-medium">
              <GithubIcon className="size-4" />
              <span className="link-underline">Source code</span>
              <ArrowUpRight className="size-3.5 text-fg-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-fg-dim">
              <GithubIcon className="size-4" /> Repository private while in development
            </span>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 font-medium">
              <span className="link-underline">Live demo</span>
              <ArrowUpRight className="size-3.5 text-fg-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>
      </Reveal>
    </li>
  );
}
