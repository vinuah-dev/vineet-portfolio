"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Flame, RotateCcw, Route, Wind } from "lucide-react";

/**
 * Interactive SAFEX-style evacuation: click to ignite, fire spreads, and every
 * occupant re-plans with hazard-aware A* (fire blocks, heat costs more).
 */

// # wall · . floor · d door · E exit
const MAP = [
  "############################",
  "#......#.......#...........#",
  "#......#.......#...........#",
  "#......d.......d...........#",
  "#......#.......#...........#",
  "###d####.......####d########",
  "E..........................E",
  "###d#######d#######d####d###",
  "#.......#.......#.......#..#",
  "#.......#.......#.......#..#",
  "#.......d.......d.......d..#",
  "#.......#.......#.......#..#",
  "#.......#.......#.......#..#",
  "####E#######################",
];
const W = MAP[0].length;
const H = MAP.length;
const idx = (x: number, y: number) => y * W + x;
const WALL = new Uint8Array(W * H);
const EXITS: number[] = [];
const FLOOR: number[] = [];
MAP.forEach((row, y) =>
  [...row].forEach((c, x) => {
    if (c === "#") WALL[idx(x, y)] = 1;
    else {
      if (c === "E") EXITS.push(idx(x, y));
      else FLOOR.push(idx(x, y));
    }
  }),
);
const NB = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

type Agent = { x: number; y: number; path: number[]; state: "idle" | "moving" | "out" | "caught"; wander: number };

function heatMap(fire: Uint8Array) {
  // Distance-to-fire (BFS, capped) → extra traversal cost near flames.
  const dist = new Int16Array(W * H).fill(99);
  const q: number[] = [];
  fire.forEach((f, i) => {
    if (f) {
      dist[i] = 0;
      q.push(i);
    }
  });
  for (let h = 0; h < q.length; h++) {
    const c = q[h];
    if (dist[c] >= 3) continue;
    const cx = c % W;
    const cy = (c / W) | 0;
    for (const [dx, dy] of NB) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = idx(nx, ny);
      if (WALL[n] || dist[n] <= dist[c] + 1) continue;
      dist[n] = dist[c] + 1;
      q.push(n);
    }
  }
  return dist;
}

function astar(start: number, fire: Uint8Array, heat: Int16Array): number[] {
  const exits = EXITS.filter((e) => !fire[e]);
  if (!exits.length) return [];
  const ex = exits.map((e) => [e % W, (e / W) | 0]);
  const h = (i: number) => {
    const x = i % W;
    const y = (i / W) | 0;
    let m = Infinity;
    for (const [a, b] of ex) m = Math.min(m, Math.abs(a - x) + Math.abs(b - y));
    return m;
  };
  const g = new Float32Array(W * H).fill(Infinity);
  const from = new Int32Array(W * H).fill(-1);
  const closed = new Uint8Array(W * H);
  const open: { i: number; f: number }[] = [{ i: start, f: h(start) }];
  g[start] = 0;
  while (open.length) {
    let bi = 0;
    for (let k = 1; k < open.length; k++) if (open[k].f < open[bi].f) bi = k;
    const { i: cur } = open.splice(bi, 1)[0];
    if (closed[cur]) continue;
    closed[cur] = 1;
    if (exits.includes(cur)) {
      const path = [cur];
      let p = from[cur];
      while (p !== -1 && p !== start) {
        path.push(p);
        p = from[p];
      }
      return path.reverse();
    }
    const cx = cur % W;
    const cy = (cur / W) | 0;
    for (const [dx, dy] of NB) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = idx(nx, ny);
      if (WALL[n] || fire[n] || closed[n]) continue;
      const cost = 1 + (heat[n] === 1 ? 30 : heat[n] === 2 ? 8 : heat[n] === 3 ? 2 : 0);
      const ng = g[cur] + cost;
      if (ng < g[n]) {
        g[n] = ng;
        from[n] = cur;
        open.push({ i: n, f: ng + h(n) });
      }
    }
  }
  return [];
}

function spawnAgents(n: number): Agent[] {
  const rooms = FLOOR.filter((i) => {
    const y = (i / W) | 0;
    return y !== 6; // keep the corridor clear at start
  });
  const picked = new Set<number>();
  while (picked.size < n) picked.add(rooms[Math.floor(Math.random() * rooms.length)]);
  return [...picked].map((i) => ({ x: i % W, y: (i / W) | 0, path: [], state: "idle", wander: Math.random() * 6 }));
}

type Stats = { out: number; caught: number; moving: number; replans: number; fires: number; elapsed: number; alarm: boolean };

export function EvacSim() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sim = useRef({
    fire: new Uint8Array(W * H),
    heat: new Int16Array(W * H).fill(99),
    agents: spawnAgents(22),
    replans: 0,
    alarmAt: 0,
    spread: true,
    showPaths: true,
    lastSpread: 0,
    dirty: false,
  });
  const [stats, setStats] = useState<Stats>({ out: 0, caught: 0, moving: 0, replans: 0, fires: 0, elapsed: 0, alarm: false });
  const [spread, setSpread] = useState(true);
  const [showPaths, setShowPaths] = useState(true);

  const replanAll = useCallback(() => {
    const s = sim.current;
    s.heat = heatMap(s.fire);
    for (const a of s.agents) {
      if (a.state === "out" || a.state === "caught") continue;
      const cell = idx(Math.round(a.x), Math.round(a.y));
      a.path = astar(cell, s.fire, s.heat);
      a.state = "moving";
      s.replans++;
    }
  }, []);

  const ignite = useCallback(
    (cell: number) => {
      const s = sim.current;
      if (WALL[cell]) return;
      s.fire[cell] = s.fire[cell] ? 0 : 1;
      if (!s.alarmAt) s.alarmAt = performance.now();
      s.dirty = true;
      replanAll();
    },
    [replanAll],
  );

  const reset = useCallback(() => {
    const s = sim.current;
    s.fire = new Uint8Array(W * H);
    s.heat = new Int16Array(W * H).fill(99);
    s.agents = spawnAgents(22);
    s.replans = 0;
    s.alarmAt = 0;
  }, []);

  const randomFire = useCallback(() => {
    const room = FLOOR.filter((i) => ((i / W) | 0) !== 6 && !sim.current.fire[i]);
    ignite(room[Math.floor(Math.random() * room.length)]);
  }, [ignite]);

  useEffect(() => {
    sim.current.spread = spread;
  }, [spread]);
  useEffect(() => {
    sim.current.showPaths = showPaths;
  }, [showPaths]);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cell = 20;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let statTick = 0;

    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = r.width / W;
    };

    const step = (dt: number, now: number) => {
      const s = sim.current;
      // Fire spread
      if (s.alarmAt && s.spread && now - s.lastSpread > 1100) {
        s.lastSpread = now;
        const add: number[] = [];
        let count = 0;
        s.fire.forEach((f, i) => {
          if (!f) return;
          count++;
          const x = i % W;
          const y = (i / W) | 0;
          for (const [dx, dy] of NB) {
            const n = idx(x + dx, y + dy);
            if (!WALL[n] && !s.fire[n] && Math.random() < 0.09) add.push(n);
          }
        });
        if (add.length && count < 140) {
          add.forEach((n) => (s.fire[n] = 1));
          replanAll();
        }
      }
      // Agents
      for (const a of s.agents) {
        if (a.state === "out" || a.state === "caught") continue;
        if (s.fire[idx(Math.round(a.x), Math.round(a.y))]) {
          a.state = "caught";
          continue;
        }
        if (a.state === "idle") {
          a.wander += dt;
          continue;
        }
        const next = a.path[0];
        if (next === undefined) continue;
        const tx = next % W;
        const ty = (next / W) | 0;
        const dx = tx - a.x;
        const dy = ty - a.y;
        const d = Math.hypot(dx, dy);
        const v = 4.2 * dt;
        if (d <= v) {
          a.x = tx;
          a.y = ty;
          a.path.shift();
          if (EXITS.includes(next)) a.state = "out";
        } else {
          a.x += (dx / d) * v;
          a.y += (dy / d) * v;
        }
      }
    };

    const draw = (now: number) => {
      const s = sim.current;
      const w = W * cell;
      const h = H * cell;
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const i = idx(x, y);
          const px = x * cell;
          const py = y * cell;
          if (WALL[i]) {
            ctx.fillStyle = "rgba(237,237,235,0.09)";
            ctx.fillRect(px, py, cell, cell);
          } else if (EXITS.includes(i)) {
            ctx.fillStyle = s.fire[i] ? "#ff6b35" : "#3ddc97";
            ctx.fillRect(px + 1, py + 1, cell - 2, cell - 2);
          } else if (s.fire[i]) {
            const flick = reduce ? 0.85 : 0.7 + 0.3 * Math.sin(now / 120 + i);
            ctx.fillStyle = `rgba(255,107,53,${flick})`;
            ctx.fillRect(px, py, cell, cell);
          } else if (s.heat[i] <= 2) {
            ctx.fillStyle = `rgba(255,107,53,${s.heat[i] === 1 ? 0.22 : 0.1})`;
            ctx.fillRect(px, py, cell, cell);
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.025)";
            ctx.fillRect(px + 0.5, py + 0.5, cell - 1, cell - 1);
          }
        }
      // Paths
      if (s.showPaths) {
        ctx.strokeStyle = "rgba(61,220,151,0.55)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.lineDashOffset = reduce ? 0 : -now / 40;
        for (const a of s.agents) {
          if (a.state !== "moving" || !a.path.length) continue;
          ctx.beginPath();
          ctx.moveTo((a.x + 0.5) * cell, (a.y + 0.5) * cell);
          for (const p of a.path) ctx.lineTo(((p % W) + 0.5) * cell, (((p / W) | 0) + 0.5) * cell);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      // Agents
      for (const a of s.agents) {
        if (a.state === "out") continue;
        const bob = a.state === "idle" && !reduce ? Math.sin(now / 400 + a.wander) * 0.08 : 0;
        const cx = (a.x + 0.5) * cell;
        const cy = (a.y + 0.5 + bob) * cell;
        if (a.state === "caught") {
          ctx.strokeStyle = "#ff6b35";
          ctx.lineWidth = 1.5;
          const r = cell * 0.25;
          ctx.beginPath();
          ctx.moveTo(cx - r, cy - r);
          ctx.lineTo(cx + r, cy + r);
          ctx.moveTo(cx + r, cy - r);
          ctx.lineTo(cx - r, cy + r);
          ctx.stroke();
          continue;
        }
        ctx.fillStyle = a.state === "moving" && !a.path.length ? "#fbbf24" : "#ededeb";
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(2.2, cell * 0.22), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        step(dt, now);
        draw(now);
        if (now - statTick > 200) {
          statTick = now;
          const s = sim.current;
          const out = s.agents.filter((a) => a.state === "out").length;
          const caught = s.agents.filter((a) => a.state === "caught").length;
          setStats({
            out,
            caught,
            moving: s.agents.length - out - caught,
            replans: s.replans,
            fires: s.fire.reduce((n, f) => n + f, 0),
            elapsed: s.alarmAt && out + caught < s.agents.length ? (now - s.alarmAt) / 1000 : 0,
            alarm: !!s.alarmAt,
          });
        }
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [replanAll]);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * W);
    const y = Math.floor(((e.clientY - r.top) / r.height) * H);
    if (x >= 0 && y >= 0 && x < W && y < H) ignite(idx(x, y));
  };

  const done = stats.alarm && stats.moving === 0;
  const total = stats.out + stats.caught + stats.moving;

  return (
    <div className="border border-line-strong bg-[#0b0b0e]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="flex items-center gap-2 font-mono text-[11px]">
          <span className={`size-1.5 rounded-full ${stats.alarm && !done ? "animate-pulse-dot bg-accent" : done ? "bg-ok" : "bg-fg-dim"}`} />
          <span className={stats.alarm && !done ? "text-accent" : "text-fg-muted"}>
            {done ? "ALL CLEAR" : stats.alarm ? "ALARM · EVACUATING" : "STANDBY · click the plan to start a fire"}
          </span>
        </span>
        <span className="font-mono text-[11px] text-fg-dim">safex://floor-2 · a* · 28×14</span>
      </div>

      <canvas
        ref={canvas}
        onPointerDown={onPointer}
        role="img"
        aria-label="Evacuation simulator floor plan. Use the Random fire button to start a fire with the keyboard."
        data-cursor="Ignite"
        className="block aspect-[2/1] w-full touch-none"
      />

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
        {[
          ["Evacuated", `${stats.out}/${total}`, "text-ok"],
          ["Caught", String(stats.caught), stats.caught ? "text-accent" : "text-fg"],
          ["A* re-plans", String(stats.replans), "text-fg"],
          ["Burning cells", String(stats.fires), stats.fires ? "text-accent" : "text-fg"],
        ].map(([k, v, c]) => (
          <div key={k} className="bg-[#0b0b0e] px-4 py-3">
            <div className="micro text-[9px] text-fg-dim">{k}</div>
            <div className={`mt-1 font-mono text-lg tabular-nums ${c}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line p-3" aria-live="polite">
        <button type="button" onClick={randomFire} className="inline-flex items-center gap-2 bg-fg px-3 py-2 text-[12px] font-medium text-bg transition-colors hover:bg-accent">
          <Flame className="size-3.5" /> Random fire
        </button>
        <button
          type="button"
          aria-pressed={spread}
          onClick={() => setSpread((v) => !v)}
          className={`inline-flex items-center gap-2 border px-3 py-2 text-[12px] transition-colors ${spread ? "border-accent/50 text-accent" : "border-line text-fg-muted hover:text-fg"}`}
        >
          <Wind className="size-3.5" /> Spread {spread ? "on" : "off"}
        </button>
        <button
          type="button"
          aria-pressed={showPaths}
          onClick={() => setShowPaths((v) => !v)}
          className={`inline-flex items-center gap-2 border px-3 py-2 text-[12px] transition-colors ${showPaths ? "border-ok/40 text-ok" : "border-line text-fg-muted hover:text-fg"}`}
        >
          <Route className="size-3.5" /> Paths
        </button>
        <button type="button" onClick={reset} className="ml-auto inline-flex items-center gap-2 border border-line px-3 py-2 text-[12px] text-fg-muted transition-colors hover:border-fg hover:text-fg">
          <RotateCcw className="size-3.5" /> Reset
        </button>
        {done && (
          <p className="w-full pt-1 font-mono text-[11px] text-fg-muted">
            Done: {stats.out} of {total} out{stats.caught ? `, ${stats.caught} caught` : ""}, after {stats.replans} route re-plans.
          </p>
        )}
      </div>
    </div>
  );
}
