/**
 * Code-built interface visual for projects without public screenshots.
 * Pure markup + CSS animation: no images to download.
 */
export function CipherVisual() {
  return <Cipher />;
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
