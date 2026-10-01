"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise when entering the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/**
 * Splits a string into words and slides each up from a mask.
 * Wrap a word in *asterisks* to set it in the italic serif.
 * Use "\n" to force a line break.
 */
export function SplitText({
  text,
  className,
  as = "h2",
  delay = 0,
  stagger = 0.04,
  immediate = false,
  id,
  accent = false,
}: {
  id?: string;
  /** Colour italic words with the accent. */
  accent?: boolean;
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean;
}) {
  const Comp = motion[as];
  const lines = parseRich(text);
  let wordIndex = 0;

  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Comp id={id} className={className} {...trigger} aria-label={text.replace(/\*/g, "").replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.map(({ word, italic }, wi) => {
            const i = wordIndex++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom -mb-[0.08em]">
                <motion.span
                  className={`inline-block ${italic ? `font-serif font-normal italic tracking-[-0.02em] ${accent ? "text-accent" : ""}` : ""}`}
                  variants={{
                    hidden: { y: "105%" },
                    show: { y: 0, transition: { duration: 0.9, delay: delay + i * stagger, ease: EASE } },
                  }}
                >
                  {word}
                </motion.span>
                {wi < line.length - 1 && "\u00A0"}
              </span>
            );
          })}
        </span>
      ))}
    </Comp>
  );
}

/** Splits "plain *italic phrase* plain\nnext line" into lines of words with an italic flag. */
function parseRich(text: string) {
  let italic = false;
  return text.split("\n").map((line) =>
    line.split(" ").map((raw) => {
      let word = raw;
      const opens = word.startsWith("*");
      if (opens) word = word.slice(1);
      const closes = word.endsWith("*");
      if (closes) word = word.slice(0, -1);
      const isItalic = italic || opens;
      if (opens) italic = true;
      if (closes) italic = false;
      return { word, italic: isItalic };
    }),
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {words.map((raw, i) => {
        const italic = raw.startsWith("*") && raw.endsWith("*");
        const word = italic ? raw.slice(1, -1) : raw;
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]} italic={italic}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  italic,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  italic: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span aria-hidden className="relative">
      <motion.span
        style={{ opacity }}
        className={italic ? "font-serif font-normal italic tracking-[-0.01em] text-accent" : undefined}
      >
        {children}
      </motion.span>{" "}
    </span>
  );
}

/** Small numbered label used at the top of every section. */
export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <Reveal className="micro flex items-center gap-3 text-fg-dim" y={10}>
      <span className="text-accent">{index}</span>
      <span className="h-px w-8 bg-line-strong" />
      <span>{label}</span>
    </Reveal>
  );
}
