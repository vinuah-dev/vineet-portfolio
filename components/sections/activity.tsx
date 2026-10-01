import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { getGithubData } from "@/lib/github";
import { profile } from "@/lib/data";
import { GithubIcon } from "../icons";
import { Reveal, SectionLabel, SplitText } from "../reveal";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export async function Activity() {
  const data = await getGithubData();
  const { user, repos, languages, activity, activityTotal } = data;
  const langTotal = languages.reduce((n, l) => n + l.count, 0);

  return (
    <section id="activity" aria-labelledby="activity-title" className="relative pt-32 md:pt-48">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="06" label="Activity" />
            <SplitText
              id="activity-title"
              text={"The build log,\n*in public.*"}
              className="display mt-8 text-[clamp(2.6rem,7vw,6.5rem)]"
            />
          </div>
          <Reveal className="micro flex items-center gap-2 text-fg-dim md:pb-3">
            <span className={`size-1.5 rounded-full ${data.live ? "animate-pulse-dot bg-ok" : "bg-fg-dim"}`} />
            {data.live ? "Live from GitHub API · hourly" : "GitHub snapshot"}
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:mt-24 lg:grid-cols-12">
          {/* Profile */}
          <Reveal className="flex flex-col justify-between gap-10 bg-bg p-6 md:p-8 lg:col-span-4">
            <div className="flex items-center gap-4">
              {user ? (
                <Image
                  src={user.avatar_url}
                  alt={`${profile.name} on GitHub`}
                  width={56}
                  height={56}
                  className="size-14 border border-line grayscale"
                />
              ) : (
                <span className="grid size-14 place-items-center border border-line">
                  <GithubIcon className="size-6" />
                </span>
              )}
              <div>
                <div className="font-medium">{user?.name ?? profile.name}</div>
                <div className="font-mono text-xs text-fg-dim">@{profile.githubUser}</div>
              </div>
            </div>

            {user && (
              <dl className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="micro text-fg-dim">Public repos</dt>
                  <dd className="display mt-2 text-5xl">{user.public_repos}</dd>
                </div>
                <div>
                  <dt className="micro text-fg-dim">On GitHub since</dt>
                  <dd className="display mt-2 text-5xl">{new Date(user.created_at).getFullYear()}</dd>
                </div>
              </dl>
            )}

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-between border border-line-strong px-4 py-3 text-sm transition-colors hover:border-fg"
            >
              <span className="flex items-center gap-2">
                <GithubIcon className="size-4" /> View GitHub profile
              </span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>

          {/* Activity + languages */}
          <Reveal delay={0.08} className="flex flex-col gap-10 bg-bg p-6 md:p-8 lg:col-span-8">
            {activity ? (
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="micro text-fg-muted">Public activity · last 13 weeks</h3>
                  <span className="micro text-fg-dim">
                    <span className="text-fg">{activityTotal}</span> public events
                  </span>
                </div>
                <ActivityGrid days={activity} />
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center border border-dashed border-line p-6">
                <h3 className="micro text-fg-muted">Public activity</h3>
                <p className="mt-3 max-w-md text-sm text-fg-dim">
                  Live contribution data is temporarily unavailable. The full, up-to-date history is on{" "}
                  <a href={profile.github} target="_blank" rel="noreferrer" className="link-underline text-fg">
                    GitHub
                  </a>
                  .
                </p>
              </div>
            )}

            {languages.length > 0 && (
              <div>
                <h3 className="micro text-fg-muted">Primary languages across repositories</h3>
                <div className="mt-4 flex h-1.5 w-full gap-0.5 overflow-hidden">
                  {languages.map((l, i) => (
                    <span
                      key={l.name}
                      className="h-full"
                      style={{
                        width: `${(l.count / langTotal) * 100}%`,
                        background: i === 0 ? "var(--accent)" : `rgba(237,237,235,${0.65 - i * 0.12})`,
                      }}
                    />
                  ))}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-fg-dim">
                  {languages.map((l) => (
                    <li key={l.name}>
                      <span className="text-fg-muted">{l.name}</span> {Math.round((l.count / langTotal) * 100)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>

        {/* Selected repositories */}
        <ul className="mt-px grid gap-px overflow-hidden border border-t-0 border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <Reveal as="li" key={r.name} delay={(i % 3) * 0.06} className="bg-bg">
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col gap-6 p-6 transition-colors duration-300 hover:bg-white/[0.025]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-sm text-fg transition-colors group-hover:text-accent">{r.name}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-fg-dim transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                </div>
                <p className="text-sm leading-relaxed text-fg-dim">{r.description}</p>
                {(r.language || r.pushedAt) && (
                  <div className="micro mt-auto flex flex-wrap items-center gap-4 text-fg-dim">
                    {r.language && <span>{r.language}</span>}
                    {typeof r.stars === "number" && r.stars > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="size-3" /> {r.stars}
                      </span>
                    )}
                    {r.pushedAt && <span>Updated {dateFmt.format(new Date(r.pushedAt))}</span>}
                  </div>
                )}
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ActivityGrid({ days }: { days: { date: string; count: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const level = (c: number) => (c === 0 ? 0 : Math.min(4, Math.ceil((c / max) * 4)));
  const shades = [
    "bg-white/[0.04]",
    "bg-accent/25",
    "bg-accent/45",
    "bg-accent/70",
    "bg-accent",
  ];
  // Split into weeks (columns of 7)
  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="mt-5 overflow-x-auto pb-1">
      <div className="flex gap-1" role="img" aria-label={`Public GitHub activity heatmap over the last ${days.length} days`}>
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-1 flex-col gap-1">
            {w.map((d) => (
              <span
                key={d.date}
                title={`${d.count} event${d.count === 1 ? "" : "s"} · ${d.date}`}
                className={`aspect-square min-w-2.5 ${shades[level(d.count)]}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="micro mt-3 flex items-center justify-end gap-1.5 text-fg-dim">
        Less
        {shades.map((s) => (
          <span key={s} className={`size-2.5 ${s}`} />
        ))}
        More
      </div>
    </div>
  );
}
