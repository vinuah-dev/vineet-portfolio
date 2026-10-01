import { stack, techUsage } from "@/lib/data";
import { Reveal, SectionLabel, SplitText } from "../reveal";

export function Stack() {
  const total = stack.reduce((n, g) => n + g.items.length, 0);

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative pt-32 md:pt-48">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="05" label="Stack" />
            <SplitText
              id="stack-title"
              text={"Tools I reach\nfor *daily.*"}
              className="display mt-8 text-[clamp(2.6rem,7vw,6.5rem)]"
            />
          </div>
          <Reveal className="micro flex gap-6 text-fg-dim md:pb-3">
            <span>
              <span className="text-fg">{String(stack.length).padStart(2, "0")}</span> domains
            </span>
            <span>
              <span className="text-fg">{total}</span> technologies
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-px w-4 border-b-2 border-dotted border-accent/60" /> hover or tap: where it&apos;s used
            </span>
          </Reveal>
        </div>

        {/* Hovering a row focuses it and quietly dims the rest (pure CSS). */}
        <ul className="group/stack mt-16 border-b border-line md:mt-24">
          {stack.map((g, gi) => (
            <li
              key={g.group}
              className="group/row relative grid gap-4 border-t border-line py-7 transition-opacity duration-500 md:grid-cols-12 md:items-baseline md:gap-8 md:py-9 md:group-hover/stack:opacity-35 md:hover:opacity-100!"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover/row:scale-x-100"
              />
              <Reveal y={12} className="flex items-baseline gap-4 md:col-span-3">
                <span className="font-mono text-xs text-fg-dim">0{gi + 1}</span>
                <h3 className="micro text-fg-muted transition-colors group-hover/row:text-accent">{g.group}</h3>
              </Reveal>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 md:col-span-9" aria-label={g.group}>
                {g.items.map((item, ii) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={ii * 0.05}
                    y={20}
                    className="flex items-baseline gap-3 text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium leading-tight tracking-[-0.03em] text-fg/80 transition-colors duration-300 group-hover/row:text-fg"
                  >
                    {techUsage[item] ? (
                      <button type="button" className="group/tech relative cursor-help outline-none">
                        <span className="underline decoration-accent/40 decoration-dotted decoration-2 underline-offset-[0.18em] transition-colors group-hover/tech:text-accent group-focus-visible/tech:text-accent">{item}</span>
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-max max-w-[min(16rem,70vw)] border border-line-strong bg-bg-elev px-3 py-2 text-left font-mono text-[11px] font-normal leading-snug tracking-normal text-fg-muted shadow-xl group-hover/tech:block group-focus/tech:block"
                        >
                          <span className="micro block text-[9px] text-fg-dim">Used in</span>
                          <span className="text-fg">{techUsage[item].join(" · ")}</span>
                        </span>
                      </button>
                    ) : (
                      item
                    )}
                    {ii < g.items.length - 1 && (
                      <span aria-hidden className="font-serif text-[0.8em] font-normal italic text-fg-dim">
                        /
                      </span>
                    )}
                  </Reveal>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
