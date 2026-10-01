import type { ProjectVisual as VisualKind } from "@/lib/data";

/**
 * Hand-built interface mockups for each project. Pure markup + CSS animation:
 * no images to download, crisp at any size.
 */
export function ProjectVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "cipher":
      return <Cipher />;
    case "fire":
      return <Fire />;
    case "jarvis":
      return <Jarvis />;
    case "gauraksha":
      return <Gauraksha />;
    case "gym":
      return <Gym />;
  }
}

function Frame({ path, children, status }: { path: string; children: React.ReactNode; status?: string }) {
  return (
    <div className="relative flex size-full flex-col overflow-hidden border border-line-strong bg-[#0b0b0e] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex gap-1.5">
          <span className="size-2 bg-white/15" />
          <span className="size-2 bg-white/15" />
          <span className="size-2 bg-white/15" />
        </div>
        <span className="font-mono text-[10px] text-fg-dim">{path}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-fg-dim">
          <span className="animate-pulse-dot size-1.5 rounded-full bg-ok" />
          {status ?? "live"}
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/* ── 01 CIPHER ─────────────────────────────────────────── */

const ALERTS = [
  { sev: "CRIT", c: "text-accent border-accent/40", t: "Suspicious PowerShell spawn", s: "host-07" },
  { sev: "HIGH", c: "text-amber-300 border-amber-300/30", t: "Brute-force on SSH (42 tries)", s: "gw-01" },
  { sev: "MED", c: "text-fg-muted border-line-strong", t: "New admin account created", s: "dc-02" },
  { sev: "LOW", c: "text-fg-dim border-line", t: "Outbound DNS anomaly", s: "host-12" },
  { sev: "HIGH", c: "text-amber-300 border-amber-300/30", t: "Lateral movement via SMB", s: "host-03" },
  { sev: "LOW", c: "text-fg-dim border-line", t: "Expired cert on service", s: "web-04" },
];

function Cipher() {
  return (
    <Frame path="cipher://soc/local" status="offline-safe">
      <div className="grid h-full grid-cols-5">
        <div className="col-span-3 flex flex-col border-r border-line">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="micro text-fg-dim">Event stream</span>
            <svg viewBox="0 0 120 24" className="h-5 w-24 text-accent" aria-hidden>
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                points="0,18 10,16 20,17 30,12 40,14 50,6 60,11 70,9 80,15 90,8 100,10 110,4 120,7"
              />
            </svg>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <ul className="animate-log absolute inset-x-0 top-0">
              {[...ALERTS, ...ALERTS].map((a, i) => (
                <li key={i} className="flex items-center gap-3 border-b border-line px-3 py-2.5">
                  <span className={`border px-1.5 py-px font-mono text-[9px] ${a.c}`}>{a.sev}</span>
                  <span className="flex-1 truncate text-[11px] text-fg-muted">{a.t}</span>
                  <span className="font-mono text-[10px] text-fg-dim">{a.s}</span>
                </li>
              ))}
            </ul>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0b0e]" />
          </div>
        </div>
        <div className="col-span-2 flex flex-col p-3">
          <span className="micro text-fg-dim">AI triage</span>
          <p className="mt-3 text-[11px] leading-relaxed text-fg">
            Likely credential-stuffing followed by lateral movement. Isolate{" "}
            <span className="text-accent">host-03</span>, rotate keys on gw-01.
          </p>
          <div className="mt-4 space-y-2">
            {["Correlated 3 alerts", "Mapped to MITRE T1021", "Playbook drafted"].map((s) => (
              <div key={s} className="flex items-center gap-2 font-mono text-[10px] text-fg-dim">
                <span className="text-ok">✓</span> {s}
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-line pt-3 font-mono text-[10px] text-fg-dim">
            egress <span className="text-ok">0 B</span> · model local
            <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-fg/70" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ── 02 Fire evacuation ────────────────────────────────── */

function Fire() {
  const crowd = [
    [70, 70], [84, 78], [92, 64], [62, 86], [78, 92], [100, 82], [140, 150], [150, 162], [162, 146],
    [250, 70], [262, 84], [240, 90], [300, 160], [312, 172],
  ];
  return (
    <Frame path="cam-04 · floor-2 · evac.route" status="tracking">
      <svg viewBox="0 0 400 260" className="size-full" aria-hidden>
        <defs>
          <radialGradient id="fireGlow">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </radialGradient>
          <pattern id="fgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.04)" />
          </pattern>
        </defs>
        <rect width="400" height="260" fill="url(#fgrid)" />
        {/* Floor plan */}
        <g fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5">
          <rect x="30" y="30" width="340" height="200" />
          <path d="M30 120H130M170 120H230M270 120H370M200 30V95M200 145V230M130 120V170M270 120V75" />
        </g>
        {/* Fire zone */}
        <circle cx="300" cy="80" r="70" fill="url(#fireGlow)" className="animate-glow" />
        <rect x="270" y="52" width="62" height="52" fill="none" stroke="#ff6b35" strokeWidth="1.2" />
        <rect x="270" y="42" width="62" height="10" fill="#ff6b35" />
        <text x="274" y="50" fontSize="7" fill="#0a0a0a" fontFamily="monospace">FIRE 0.94</text>
        {/* Smoke box */}
        <rect x="216" y="44" width="40" height="36" fill="none" stroke="rgba(255,255,255,0.4)" strokeDasharray="3 2" />
        <text x="218" y="40" fontSize="7" fill="rgba(255,255,255,0.55)" fontFamily="monospace">SMOKE</text>
        {/* Crowd */}
        {crowd.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="#ededeb" opacity="0.85" />
        ))}
        {/* Density heat */}
        <circle cx="80" cy="78" r="26" fill="none" stroke="rgba(251,191,36,0.5)" strokeDasharray="2 3" />
        {/* A* routes */}
        <path
          d="M84 78 L150 78 L150 140 L110 140 L110 200 L46 200"
          fill="none"
          stroke="#3ddc97"
          strokeWidth="2"
          className="animate-dash"
          strokeDasharray="6 6"
        />
        <path
          d="M300 165 L230 165 L230 200 L355 200"
          fill="none"
          stroke="#3ddc97"
          strokeWidth="2"
          className="animate-dash"
          strokeDasharray="6 6"
        />
        {/* Exits */}
        <g fontFamily="monospace" fontSize="8">
          <rect x="30" y="192" width="16" height="16" fill="#3ddc97" />
          <text x="50" y="222" fill="#3ddc97">EXIT A</text>
          <rect x="354" y="192" width="16" height="16" fill="#3ddc97" />
          <text x="322" y="222" fill="#3ddc97">EXIT B</text>
          <text x="36" y="44" fill="rgba(255,255,255,0.4)">ZONE 1 · DENSITY HIGH</text>
        </g>
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-2 font-mono text-[10px]">
        <span className="border border-line bg-bg/80 px-2 py-1 text-fg-muted">yolov8 · 28 fps</span>
        <span className="border border-ok/30 bg-bg/80 px-2 py-1 text-ok">A* rerouted</span>
      </div>
    </Frame>
  );
}

/* ── 03 Jarvis ─────────────────────────────────────────── */

function Jarvis() {
  const bars = Array.from({ length: 36 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.7)) * 0.75);
  return (
    <Frame path="jarvis · voice session" status="listening">
      <div className="flex h-full flex-col">
        <div className="relative grid flex-1 place-items-center">
          <div className="absolute size-40 rounded-full border border-line" />
          <div className="animate-glow absolute size-28 rounded-full border border-accent/30" />
          <div className="flex h-16 items-center gap-[3px]">
            {bars.map((h, i) => (
              <span
                key={i}
                className="animate-eq w-[3px] origin-center rounded-full bg-fg"
                style={{ height: `${h * 100}%`, animationDelay: `${(i % 9) * -0.12}s`, opacity: 0.35 + h * 0.6 }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2 border-t border-line p-3 font-mono text-[11px]">
          <p className="text-fg-dim">
            <span className="text-fg-muted">you ›</span> send mom “reaching in 10” on whatsapp
          </p>
          <p className="text-fg-dim">
            <span className="text-accent">router ›</span> intent=message · channel=whatsapp · model=local
          </p>
          <p className="text-fg">
            <span className="text-ok">jarvis ›</span> Sent. Anything else?
          </p>
          <div className="flex gap-1.5 pt-1">
            {["Local", "GPT", "Gemini", "Vision"].map((m, i) => (
              <span
                key={m}
                className={`border px-2 py-0.5 text-[9px] ${i === 0 ? "border-accent/50 text-accent" : "border-line text-fg-dim"}`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ── 04 Gauraksha Care ─────────────────────────────────── */

const COWS = [
  { id: "GC-0142", name: "Kamdhenu", next: "FMD booster", due: "in 2 days", st: "due" },
  { id: "GC-0098", name: "Ganga", next: "HS vaccine", due: "12 Oct", st: "ok" },
  { id: "GC-0211", name: "Nandini", next: "Deworming", due: "overdue", st: "late" },
  { id: "GC-0057", name: "Gauri", next: "BQ vaccine", due: "28 Oct", st: "ok" },
  { id: "GC-0176", name: "Surabhi", next: "FMD booster", due: "3 Nov", st: "ok" },
  { id: "GC-0230", name: "Lakshmi", next: "Health check", due: "in 5 days", st: "due" },
];

function Gauraksha() {
  return (
    <Frame path="gauraksha.care/dashboard" status="synced">
      <div className="grid h-full grid-cols-[3.25rem_1fr]">
        <div className="flex flex-col items-center gap-3 border-r border-line pt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`size-5 border ${i === 1 ? "border-accent bg-accent-soft" : "border-line"}`} />
          ))}
        </div>
        <div className="flex flex-col gap-3 p-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Registry", "312"],
              ["Due this week", "18"],
              ["Coverage", "94%"],
            ].map(([k, v]) => (
              <div key={k} className="border border-line p-2.5">
                <div className="micro text-[9px] text-fg-dim">{k}</div>
                <div className="mt-1 text-lg font-medium tracking-tight">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex h-16 items-end gap-1.5 border border-line px-2.5 pb-2 pt-3">
            {[40, 55, 35, 70, 62, 80, 58, 90, 74, 85, 68, 95].map((h, i) => (
              <span
                key={i}
                className="animate-rise-bar flex-1 origin-bottom bg-fg/20"
                style={{ height: `${h}%`, animationDelay: `${i * 0.05}s`, background: i === 11 ? "var(--accent)" : undefined }}
              />
            ))}
          </div>
          <table className="w-full text-left text-[10px]">
            <thead className="micro text-[9px] text-fg-dim">
              <tr>
                <th className="pb-1.5 font-normal">Tag</th>
                <th className="pb-1.5 font-normal">Name</th>
                <th className="pb-1.5 font-normal">Next</th>
                <th className="pb-1.5 text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {COWS.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="py-1.5 font-mono text-fg-dim">{c.id}</td>
                  <td className="py-1.5 text-fg">{c.name}</td>
                  <td className="py-1.5 text-fg-muted">{c.next}</td>
                  <td className="py-1.5 text-right">
                    <span
                      className={`px-1.5 py-px font-mono text-[9px] ${
                        c.st === "late" ? "bg-accent/15 text-accent" : c.st === "due" ? "bg-amber-300/10 text-amber-300" : "bg-ok/10 text-ok"
                      }`}
                    >
                      {c.due}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Frame>
  );
}

/* ── 05 Gym platform ───────────────────────────────────── */

function Gym() {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <Frame path="revolution.gym · member" status="supabase">
      <div className="grid h-full grid-cols-2 gap-3 p-4">
        <div className="mx-auto flex h-full w-full max-w-[11rem] flex-col border border-line-strong bg-bg p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-fg-muted">Hi, Aarav</span>
            <span className="micro text-[9px] text-accent">Gold</span>
          </div>
          <div className="relative mx-auto mt-3 grid size-24 place-items-center">
            <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90" aria-hidden>
              <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="5"
                strokeDasharray={c}
                strokeDashoffset={c * 0.28}
                className="animate-ring"
                style={{ ["--ring-c" as string]: `${c}` }}
              />
            </svg>
            <div className="text-center">
              <div className="text-lg font-medium leading-none">1,240</div>
              <div className="micro mt-1 text-[8px] text-fg-dim">points</div>
            </div>
          </div>
          <div className="mt-auto space-y-1.5">
            {["Check-in streak · 9d", "Refer a friend · +200", "Shop · Whey 1kg"].map((t, i) => (
              <div key={t} className={`border px-2 py-1.5 text-[9px] ${i === 1 ? "border-accent/40 text-fg" : "border-line text-fg-dim"}`}>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="border border-line p-3">
            <div className="micro text-[9px] text-fg-dim">Members</div>
            <div className="mt-1 text-xl font-medium tracking-tight">486</div>
            <div className="mt-2 flex h-8 items-end gap-1">
              {[30, 45, 40, 60, 55, 72, 80].map((h, i) => (
                <span key={i} className="animate-rise-bar flex-1 origin-bottom bg-fg/25" style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          </div>
          <div className="border border-line p-3">
            <div className="micro text-[9px] text-fg-dim">Health</div>
            <div className="mt-2 space-y-2 text-[10px]">
              {[
                ["Weight", "72.4 kg", 60],
                ["Body fat", "18%", 40],
                ["Sessions", "14 / mo", 75],
              ].map(([k, v, p]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-fg-muted">
                    <span>{k}</span>
                    <span className="font-mono text-fg">{v}</span>
                  </div>
                  <div className="mt-1 h-px bg-line">
                    <div className="h-px bg-fg/60" style={{ width: `${p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 border border-dashed border-line p-3 font-mono text-[9px] text-fg-dim">
            referral_code <span className="text-fg">REV-AARAV</span>
            <br />
            rls <span className="text-ok">enabled</span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
