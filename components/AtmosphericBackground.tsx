"use client";

import { useEffect, useRef } from "react";

/**
 * AtmosphericBackground — Dark cloud background + flowing red cursor smoke.
 *
 * TWO CANVAS LAYERS:
 *
 * Canvas 1 — Dark cloud background:
 *   8 large dark blobs drifting with slow sine waves → cloud texture.
 *
 * Canvas 2 — Red cursor cloud (KEY EFFECT):
 *   6 soft red radial-gradient particles orbit around the cursor in
 *   Lissajous figure patterns (sin×cos at different frequencies).
 *   Since offsets are time-based, the cloud KEEPS FLOWING even when
 *   cursor is completely still — like smoke or fire at rest.
 */
export default function AtmosphericBackground() {
  const bgCanvasRef    = useRef<HTMLCanvasElement>(null); // dark clouds

  // ── CANVAS 1: Dark background cloud ────────────────────────────────────────
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const clouds = [
      { bx: 0.10, by: 0.30, r: 0.40, sx: 0.00034, sy: 0.00027, px: 0.0, py: 0.7 },
      { bx: 0.32, by: 0.52, r: 0.33, sx: 0.00027, sy: 0.00038, px: 1.2, py: 0.3 },
      { bx: 0.56, by: 0.28, r: 0.44, sx: 0.00041, sy: 0.00031, px: 2.5, py: 1.8 },
      { bx: 0.74, by: 0.55, r: 0.36, sx: 0.00029, sy: 0.00022, px: 0.8, py: 2.4 },
      { bx: 0.88, by: 0.35, r: 0.29, sx: 0.00037, sy: 0.00044, px: 3.5, py: 0.5 },
      { bx: 0.45, by: 0.74, r: 0.31, sx: 0.00024, sy: 0.00034, px: 1.6, py: 3.1 },
      { bx: 0.20, by: 0.65, r: 0.26, sx: 0.00044, sy: 0.00027, px: 4.0, py: 1.0 },
      { bx: 0.65, by: 0.15, r: 0.34, sx: 0.00031, sy: 0.00037, px: 0.5, py: 2.8 },
    ];

    let t = 0, rafId: number;

    const draw = () => {
      t++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.filter = "blur(55px)";

      for (const c of clouds) {
        const ox = Math.sin(t * c.sx + c.px) * W * 0.06;
        const oy = Math.cos(t * c.sy + c.py) * H * 0.05;
        const cx = c.bx * W + ox;
        const cy = c.by * H + oy;
        const r  = c.r * Math.min(W, H) * 0.72;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0,    "rgba(40, 30, 30, 0.88)");
        g.addColorStop(0.4,  "rgba(32, 24, 24, 0.66)");
        g.addColorStop(0.75, "rgba(24, 18, 18, 0.28)");
        g.addColorStop(1,    "rgba(16, 12, 12, 0.00)");
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      ctx.filter = "none";
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <>
      {/* 1. Dark cloud background canvas */}
      <canvas
        ref={bgCanvasRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
      />

      {/* 2. Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "radial-gradient(ellipse 88% 78% at 50% 45%, transparent 15%, rgba(17,17,17,0.8) 68%, #111111 100%)",
        }}
      />


      {/* 4. Film grain */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "256px",
        }}
      />

      {/* 5. Dust particles */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
        {[
          { s: 2.0, c: "rgba(200,16,46,0.45)", t: "14%", l: "9%",  d: "6.8s", dl: "0s"   },
          { s: 1.4, c: "rgba(255,255,255,0.18)", t: "28%", l: "80%", d: "7.2s", dl: "0.8s" },
          { s: 2.5, c: "rgba(255,255,255,0.12)", t: "52%", l: "18%", d: "5.9s", dl: "1.6s" },
          { s: 1.2, c: "rgba(200,16,46,0.40)",  t: "70%", l: "88%", d: "8.3s", dl: "2.4s" },
          { s: 2.2, c: "rgba(255,255,255,0.10)", t: "38%", l: "55%", d: "6.5s", dl: "3.2s" },
          { s: 1.8, c: "rgba(200,16,46,0.35)",  t: "82%", l: "42%", d: "7.6s", dl: "4.0s" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            width: `${p.s}px`, height: `${p.s}px`,
            background: p.c, top: p.t, left: p.l,
            animation: `dust-float ${p.d} ease-in-out ${p.dl} infinite`,
          }} />
        ))}
      </div>

      {/* 6. Bottom fade */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
        background: "linear-gradient(to top, #111111 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 8,
      }} />
    </>
  );
}
