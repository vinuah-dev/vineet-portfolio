"use client";

import { useEffect, useRef } from "react";

/**
 * Photo rendered as a halftone dot field. A lens follows the pointer (or finger)
 * and reveals the real photo; when idle, a slow scan band sweeps across it.
 */
export function Portrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    let lum: Float32Array | null = null;
    let cols = 0;
    let rows = 0;
    let w = 0;
    let h = 0;
    const STEP = 5;
    let raf = 0;
    let visible = false;
    const p = { x: -999, y: -999, tx: -999, ty: -999, r: 0, tr: 0, active: false };

    const sample = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / STEP);
      rows = Math.ceil(h / STEP);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      coverDraw(o, img, cols, rows);
      const d = o.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) lum[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
      // Contrast stretch (2nd–98th percentile) so the subject reads clearly.
      const sorted = Float32Array.from(lum).sort();
      const lo = sorted[Math.floor(sorted.length * 0.02)];
      const hi = sorted[Math.floor(sorted.length * 0.98)];
      for (let i = 0; i < lum.length; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo || 1))) ** 1.15;
    };

    const draw = (t: number) => {
      if (!lum) return;
      ctx.clearRect(0, 0, w, h);
      // Idle: the lens drifts slowly around the face so the photo is always discoverable.
      if (!p.active) {
        const k = reduce ? 0 : t / 2600;
        p.tx = w * (0.52 + 0.1 * Math.sin(k));
        p.ty = h * (0.25 + 0.06 * Math.sin(k * 1.7));
        p.tr = Math.min(w, h) * 0.22;
      }
      const ease = reduce ? 1 : 0.18;
      p.x += (p.tx - p.x) * ease;
      p.y += (p.ty - p.y) * ease;
      p.r += (p.tr - p.r) * (reduce ? 1 : 0.12);

      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const l = lum[y * cols + x];
          let px = x * STEP + STEP / 2;
          let py = y * STEP + STEP / 2;
          const dx = px - p.x;
          const dy = py - p.y;
          const dist = Math.hypot(dx, dy);
          if (p.r > 1 && dist < p.r + 40 && dist > p.r - 6) {
            const push = (1 - Math.abs(dist - p.r) / 46) * 6;
            px += (dx / (dist || 1)) * push;
            py += (dy / (dist || 1)) * push;
          }
          const rad = Math.max(0.3, l * STEP * 0.5);
          const ring = p.r > 1 && Math.abs(dist - p.r) < 14;
          ctx.fillStyle = ring ? `rgba(255,107,53,${0.4 + l * 0.6})` : `rgba(237,237,235,${0.18 + l * 0.8})`;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        }

      // Lens: the real photo
      if (p.r > 2) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#08080a";
        ctx.fillRect(0, 0, w, h);
        coverDraw(ctx, img, w, h);
        ctx.restore();
        ctx.strokeStyle = "rgba(255,107,53,0.9)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      p.tx = e.clientX - r.left;
      p.ty = e.clientY - r.top;
      if (!p.active) {
        p.x = p.tx;
        p.y = p.ty;
      }
      p.active = true;
      p.tr = Math.min(w, h) * (e.pointerType === "mouse" ? 0.26 : 0.32);
      if (reduce) draw(0);
    };
    const leave = () => {
      p.active = false;
    };

    const start = () => {
      sample();
      p.x = w * 0.52;
      p.y = h * 0.25;
      if (reduce) draw(0);
      else raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !img.src) {
        img.onload = start;
        img.src = src;
      }
      if (reduce && visible && lum) draw(0);
    }, { rootMargin: "200px" });
    io.observe(c);
    const ro = new ResizeObserver(() => {
      if (img.complete && img.naturalWidth) {
        sample();
        if (reduce) draw(0);
      }
    });
    ro.observe(c);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerdown", move);
    c.addEventListener("pointerleave", leave);
    c.addEventListener("pointerup", (e) => e.pointerType !== "mouse" && leave());

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerdown", move);
      c.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  return (
    <figure className="relative">
      <canvas ref={ref} role="img" aria-label={alt} data-cursor="Reveal" className="block aspect-[3/4] w-full touch-pan-y" />
      <figcaption className="micro mt-3 flex items-center justify-between text-fg-dim">
        <span>fig. 01: the developer</span>
        <span className="hidden sm:inline">hover to reveal</span>
        <span className="sm:hidden">drag to reveal</span>
      </figcaption>
    </figure>
  );
}

/** drawImage with object-fit: cover, biased to the top (faces). */
function coverDraw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) * 0.15, dw, dh);
}
