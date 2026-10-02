"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Portal } from "./portal";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, Play, Volume2, VolumeX, X } from "lucide-react";
import type { Project } from "@/lib/data";
import { CipherVisual } from "./project-visuals";

type Slide =
  | { kind: "video"; src: string; full?: string; poster: string; caption: string }
  | { kind: "image"; src: string; alt: string; caption: string; w: number; h: number };

function slidesFor(p: Project): Slide[] {
  const s: Slide[] = [];
  for (const shot of p.shots ?? []) s.push({ kind: "image", ...shot });
  if (p.video) s.push({ kind: "video", src: p.video.src, full: p.video.full, poster: p.video.poster, caption: p.video.caption });
  return s;
}

/**
 * Real screenshots in a browser frame: tabs to switch, cursor-driven 3D tilt,
 * click to open a lightbox. Projects without screenshots render a code-built visual.
 */
export function ProjectMedia({ project, priority = false }: { project: Project; priority?: boolean }) {
  const slides = slidesFor(project);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleSound = () => {
    const v = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (v) {
      // Must run inside the click handler so the browser treats it as user-initiated.
      v.muted = next;
      if (!next) v.play().catch(() => {});
    }
  };
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  // Reset to first slide when the project changes (sticky stage reuses this component).
  const [prevSlug, setPrevSlug] = useState(project.slug);
  if (prevSlug !== project.slug) {
    setPrevSlug(project.slug);
    setI(0);
  }

  if (slides.length === 0) {
    return (
      <div className="relative aspect-[16/10] w-full" data-cursor={project.status ?? "Soon"}>
        <CipherVisual />
      </div>
    );
  }

  const current = slides[Math.min(i, slides.length - 1)];

  return (
    <div className="w-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        className="group relative"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="Expand"
          aria-label={`Open ${project.name} screenshots full screen`}
          className="relative block w-full overflow-hidden border border-line-strong bg-[#0b0b0e] text-left shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <div className="flex gap-1.5">
              <span className="size-2 bg-white/15" />
              <span className="size-2 bg-white/15" />
              <span className="size-2 bg-white/15" />
            </div>
            <span className="truncate px-3 font-mono text-[10px] text-fg-dim">
              {project.slug}.app — {current.caption}
            </span>
            <Maximize2 className="size-3 text-fg-dim transition-colors group-hover:text-fg" />
          </div>
          <div className="relative aspect-[16/10] w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {current.kind === "video" ? (
                  <InViewVideo ref={videoRef} src={current.src} poster={current.poster} muted={muted || open} />
                ) : (
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    priority={priority}
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    className="object-contain"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Glare that follows the cursor */}
          <motion.span
            aria-hidden
            style={{ left: glareX, top: glareY }}
            className="pointer-events-none absolute size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.07),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </button>
        {current.kind === "video" && (
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            aria-label={muted ? "Turn sound on" : "Mute"}
            className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 border border-line-strong bg-bg/80 px-3 py-1.5 font-mono text-[11px] backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-accent" />}
            {muted ? "Sound off · tap for sound" : "Sound on"}
          </button>
        )}
      </motion.div>

      {slides.length > 1 && (
        <div role="tablist" aria-label={`${project.name} screenshots`} className="mt-3 flex gap-2">
          {slides.map((s, si) => (
            <button
              key={s.src}
              role="tab"
              type="button"
              aria-selected={si === i}
              onClick={() => setI(si)}
              className={`group/tab relative flex-1 overflow-hidden border text-left transition-colors ${
                si === i ? "border-accent/60" : "border-line hover:border-line-strong"
              }`}
            >
              <span className="relative block aspect-[16/7] w-full overflow-hidden bg-[#0b0b0e]">
                <Image
                  src={s.kind === "video" ? s.poster : s.src}
                  alt=""
                  fill
                  sizes="160px"
                  className={`object-cover object-top transition duration-500 ${si === i ? "opacity-100" : "opacity-40 group-hover/tab:opacity-80"}`}
                />
                {s.kind === "video" && (
                  <span className="absolute inset-0 grid place-items-center">
                    <Play className="size-4 fill-fg text-fg" />
                  </span>
                )}
              </span>
              <span className={`micro block truncate px-2 py-1.5 text-[9px] ${si === i ? "text-fg" : "text-fg-dim"}`}>{s.caption}</span>
            </button>
          ))}
        </div>
      )}

      <Lightbox open={open} onClose={() => setOpen(false)} slides={slides} index={i} setIndex={setI} title={project.name} />
    </div>
  );
}

/** Plays only while visible; never downloads until it is near the viewport. */
function InViewVideo({
  src,
  poster,
  muted,
  ref,
}: {
  src: string;
  poster: string;
  muted: boolean;
  ref: React.RefObject<HTMLVideoElement | null>;
}) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [ref]);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = muted;
  }, [muted, ref]);
  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label="Jarvis HUD demo footage"
      className="size-full object-cover"
    >
      <source src={src} type="video/mp4" />
      <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
    </video>
  );
}

function Lightbox({
  open,
  onClose,
  slides,
  index,
  setIndex,
  title,
}: {
  open: boolean;
  onClose: () => void;
  slides: Slide[];
  index: number;
  setIndex: (i: number) => void;
  title: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = useCallback((d: number) => setIndex((index + d + slides.length) % slides.length), [index, slides.length, setIndex]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  const s = slides[index];
  return (
    <Portal>
    <AnimatePresence>
      {open && s && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshots`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex flex-col bg-bg/95 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="container-x flex items-center justify-between py-5" onClick={(e) => e.stopPropagation()}>
            <span className="micro text-fg-muted">
              {title} <span className="text-fg-dim">· {s.caption} · {index + 1}/{slides.length}</span>
            </span>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="grid size-10 place-items-center border border-line hover:border-fg">
              <X className="size-4" />
            </button>
          </div>
          <div className="relative flex-1 px-4 pb-8 md:px-16" onClick={(e) => e.stopPropagation()}>
            <motion.div key={s.src} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative size-full">
              {s.kind === "video" ? (
                <video poster={s.poster} autoPlay playsInline controls className="size-full object-contain">
                  <source src={s.full ?? s.src} type="video/mp4" />
                  <source src={(s.full ?? s.src).replace(/\.mp4$/, ".webm")} type="video/webm" />
                </video>
              ) : (
                <Image src={s.src} alt={s.alt} fill sizes="100vw" className="object-contain" />
              )}
            </motion.div>
            {slides.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous" className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-line bg-bg/70 hover:border-fg md:left-4">
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next" className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-line bg-bg/70 hover:border-fg md:right-4">
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </Portal>
  );
}
