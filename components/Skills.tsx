"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { skills } from "@/lib/data";

const skillGroups = [
  { label: "PROGRAMMING", items: skills.programming },
  { label: "FRAMEWORKS", items: skills.frameworks },
  { label: "BACKEND", items: skills.backend },
  { label: "DATABASES", items: skills.databases },
  { label: "SOFT SKILLS", items: skills.soft },
];

// Interactive skill row: proximity-based brightness/scale on hover
function SkillRow({ label, items, index }: { label: string; items: string[]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);
  const rafRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const opacitiesRef = useRef<number[]>(items.map(() => 0.45));
  const targetOpacitiesRef = useRef<number[]>(items.map(() => 0.45));
  const scalesRef = useRef<number[]>(items.map(() => 1));
  const targetScalesRef = useRef<number[]>(items.map(() => 1));

  const startLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const loop = () => {
      let settled = true;
      for (let i = 0; i < spansRef.current.length; i++) {
        const span = spansRef.current[i];
        if (!span) continue;

        const op = opacitiesRef.current[i] + (targetOpacitiesRef.current[i] - opacitiesRef.current[i]) * 0.1;
        const sc = scalesRef.current[i] + (targetScalesRef.current[i] - scalesRef.current[i]) * 0.1;
        opacitiesRef.current[i] = op;
        scalesRef.current[i] = sc;

        if (Math.abs(op - targetOpacitiesRef.current[i]) > 0.002 || Math.abs(sc - targetScalesRef.current[i]) > 0.0005) {
          settled = false;
        }

        span.style.opacity = String(op);
        span.style.transform = `scale(${sc})`;
      }

      if (settled) {
        isAnimatingRef.current = false;
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const radius = 180;

      for (let i = 0; i < spansRef.current.length; i++) {
        const span = spansRef.current[i];
        if (!span) continue;
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = Math.abs(mouseX - cx);

        if (dist < radius) {
          const t = 1 - dist / radius;
          const eased = t * t * (3 - 2 * t);
          targetOpacitiesRef.current[i] = 0.35 + eased * 0.65; // 0.35 → 1.0
          targetScalesRef.current[i] = 1 + eased * 0.04;
        } else {
          targetOpacitiesRef.current[i] = 0.25;
          targetScalesRef.current[i] = 1;
        }
      }
      startLoop();
    };

    const onMouseLeave = () => {
      for (let i = 0; i < targetOpacitiesRef.current.length; i++) {
        targetOpacitiesRef.current[i] = 0.45;
        targetScalesRef.current[i] = 1;
      }
      startLoop();
    };

    row.addEventListener("mousemove", onMouseMove, { passive: true });
    row.addEventListener("mouseleave", onMouseLeave, { passive: true });
    return () => {
      row.removeEventListener("mousemove", onMouseMove);
      row.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [startLoop]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.07 }}
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "2rem",
        alignItems: "center",
        padding: "1.25rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Label */}
      <span style={{
        fontSize: "0.5625rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#c8102e",
        fontFamily: "Geist, sans-serif",
        fontWeight: 500,
        flexShrink: 0,
      }}>
        {label}
      </span>

      {/* Items row — interactive */}
      <div
        ref={rowRef}
        style={{ display: "flex", flexWrap: "wrap", gap: "0", alignItems: "center" }}
      >
        {items.map((item, i) => (
          <span
            key={item}
            ref={(el) => { if (el) spansRef.current[i] = el; }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "Geist, sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              fontWeight: 300,
              color: "#f0ede8",
              opacity: 0.45,
              willChange: "transform, opacity",
              transformOrigin: "center center",
              whiteSpace: "nowrap",
            }}
          >
            {item}
            {i < items.length - 1 && (
              <span style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#c8102e",
                flexShrink: 0,
                margin: "0 1rem",
                opacity: 0.6,
              }} />
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        background: "#080808",
        padding: "8rem 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "4rem" }}
        >
          <div className="section-label" style={{ marginBottom: "1.25rem" }}>THE TOOLKIT</div>
          <h2 style={{
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#f0ede8",
            fontFamily: "Geist, sans-serif",
            lineHeight: 1,
          }}>
            What I Work With
          </h2>
        </motion.div>

        {/* Editorial rows */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {skillGroups.map((group, i) => (
            <SkillRow key={group.label} label={group.label} items={group.items} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
