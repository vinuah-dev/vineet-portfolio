"use client";

import { Bot, Command, Flame } from "lucide-react";
import { EvacSim } from "../evac-sim";
import { Reveal, SectionLabel, SplitText } from "../reveal";

const experiments = [
  {
    icon: Flame,
    k: "Exp. 01",
    title: "Evacuation simulator",
    body: "SAFEX's routing idea, in your browser. Click the plan to start fires; every person re-plans with hazard-aware A*.",
  },
  {
    icon: Bot,
    k: "Exp. 02",
    title: "Talk to Jarvis",
    body: "Ask by voice or text. It answers and drives this page for you.",
    action: { label: "Open Jarvis", event: "jarvis:open" },
  },
  {
    icon: Command,
    k: "Exp. 03",
    title: "Command palette",
    body: "Press ⌘K or Ctrl K anywhere to jump, copy or connect.",
    action: { label: "Open palette", event: "palette:open" },
  },
];

export function Lab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="relative pt-32 md:pt-48">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03" label="Lab" />
            <SplitText id="lab-title" text={"Don't read about it.\n*Play* with it."} className="display mt-8 text-[clamp(2.6rem,7vw,6.5rem)]" accent />
          </div>
          <Reveal className="max-w-xs text-sm leading-relaxed text-fg-muted md:pb-3">
            Small, live versions of the ideas behind the projects. Everything runs locally in your browser.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-8 lg:order-2">
            <EvacSim />
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] text-fg-dim">
              <span><span className="mr-1.5 inline-block size-2 bg-ok align-middle" />Exit</span>
              <span><span className="mr-1.5 inline-block size-2 bg-accent align-middle" />Fire / heat</span>
              <span><span className="mr-1.5 inline-block size-2 rounded-full bg-fg align-middle" />Person</span>
              <span><span className="mr-1.5 inline-block size-2 rounded-full bg-amber-300 align-middle" />Trapped</span>
              <span>- - - A* route</span>
            </div>
          </Reveal>

          <ul className="flex flex-col gap-px self-start border border-line bg-line lg:col-span-4 lg:order-1">
            {experiments.map((e, i) => (
              <Reveal as="li" key={e.k} delay={i * 0.06} className="bg-bg p-5">
                <div className="flex items-center justify-between">
                  <span className="micro text-accent">{e.k}</span>
                  <e.icon className="size-4 text-fg-dim" />
                </div>
                <h3 className="mt-4 text-lg font-medium tracking-tight">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{e.body}</p>
                {e.action && (
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(e.action.event))}
                    className="link-underline mt-4 text-sm font-medium"
                  >
                    {e.action.label} →
                  </button>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
