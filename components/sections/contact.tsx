"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/lib/data";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "../icons";
import { Magnetic } from "../magnetic";
import { Reveal, SectionLabel, SplitText } from "../reveal";

const links = [
  { label: "Gmail", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "LinkedIn", value: "Vineet Shah", href: profile.linkedin, icon: LinkedinIcon },
  { label: "Instagram", value: `@${profile.instagramHandle}`, href: profile.instagram, icon: InstagramIcon },
  { label: "GitHub", value: `@${profile.githubUser}`, href: profile.github, icon: GithubIcon },
];

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-title"
      onPointerMove={onPointerMove}
      className="noise relative mt-32 overflow-hidden border-t border-line pt-24 md:mt-48 md:pt-36"
    >
      {/* Background: grid + light that follows the pointer + scroll-driven glow */}
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(255,107,53,0.07), transparent 60%)",
        }}
      />
      <motion.div
        aria-hidden
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="pointer-events-none absolute -bottom-1/2 left-1/2 -z-10 h-[80vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,107,53,0.16),transparent)]"
      />

      <div className="container-x">
        <SectionLabel index="07" label="Contact" />
        <SplitText
          id="contact-title"
          text={"Have an idea?\nLet’s *build* it."}
          className="display mt-10 text-[clamp(3.2rem,12vw,11.5rem)]"
          stagger={0.06}
          accent
        />

        <div className="mt-16 flex flex-col gap-8 md:mt-24 md:flex-row md:items-center md:justify-between">
          <Reveal className="flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="Say hi"
                className="group inline-flex items-center gap-3 rounded-full bg-fg py-4 pl-7 pr-5 text-base font-medium text-bg transition-colors hover:bg-accent md:text-lg"
              >
                {profile.email}
                <span className="grid size-8 place-items-center rounded-full bg-bg text-fg transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-3 text-sm text-fg-muted transition-colors hover:border-fg hover:text-fg"
              aria-live="polite"
            >
              {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy email"}
            </button>
          </Reveal>
          <Reveal delay={0.1} className="max-w-xs text-sm leading-relaxed text-fg-muted">
            {profile.availability}. I usually reply within a day.
          </Reveal>
        </div>

        <ul className="mt-20 border-t border-line md:mt-28">
          {links.map((l, i) => (
            <Reveal as="li" key={l.label} delay={i * 0.06} className="border-b border-line">
              <a
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="group relative flex items-center justify-between gap-6 overflow-hidden py-6 md:py-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-white/[0.03] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-y-100"
                />
                <span className="relative flex items-center gap-4">
                  <span className="micro w-20 text-fg-dim">{l.label}</span>
                  <span className="text-xl font-medium tracking-tight transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2 md:text-3xl">
                    {l.value}
                  </span>
                </span>
                <span className="relative flex items-center gap-3 text-fg-dim transition-colors group-hover:text-fg">
                  {l.icon && <l.icon className="hidden size-5 sm:block" />}
                  <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer className="container-x mt-24 flex flex-col gap-4 pb-28 text-xs text-fg-dim md:mt-32 md:flex-row md:items-center md:justify-between">
      <span className="micro">
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span className="micro">
        Designed &amp; built in {profile.city} · {profile.coords}
      </span>
      <a href="#top" className="micro link-underline self-start text-fg-muted hover:text-fg md:self-auto">
        Back to top ↑
      </a>
    </footer>
  );
}
