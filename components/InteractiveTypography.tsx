"use client";

import { useEffect, useRef } from "react";

interface InteractiveTypographyProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Variable-font + scale pressure typography.
 *
 * Per-character effect based on cursor proximity:
 *   wght:  100  → 800   (thin hairline → bold fill)
 *   wdth:   75  → 115   (condensed → extended)
 *   scale: 1.0  → 1.85  (small → large — the "hill/curve" the user wants)
 *
 * The scale transform creates the visual where the letter under cursor
 * dramatically grows (pops out), tapering smoothly to hairlines on sides.
 * justify-content: space-between distributes letters across the container,
 * and scale fills the gaps naturally as cursor moves through.
 *
 * All animation is direct DOM mutation in RAF — zero React re-renders.
 */
export default function InteractiveTypography({
  text,
  className,
  style,
}: InteractiveTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);

  const chars = text.split("");
  const N = chars.length;

  // Lerped current values
  const weightsRef = useRef<number[]>([]);
  const widthsRef = useRef<number[]>([]);
  const scalesRef = useRef<number[]>([]);
  // Target values (set by mouse)
  const targetWeightsRef = useRef<number[]>([]);
  const targetWidthsRef = useRef<number[]>([]);
  const targetScalesRef = useRef<number[]>([]);

  const rafRef = useRef<number>(0);
  const isLoopingRef = useRef(false);

  const BASE_WEIGHT = 100;
  const MAX_WEIGHT  = 900;  // max boldness on hover for stronger visual contrast
  const BASE_WIDTH  = 30;
  const BASE_SCALE  = 1.0;
  const MAX_SCALE   = 2.2;  // scaleY — grows taller not wider
  const RADIUS      = 320;
  const LERP        = 0.075;

  // Init arrays
  useEffect(() => {
    const init = Array(N).fill;
    weightsRef.current       = Array.from({ length: N }, () => BASE_WEIGHT);
    widthsRef.current        = Array.from({ length: N }, () => BASE_WIDTH);
    scalesRef.current        = Array.from({ length: N }, () => BASE_SCALE);
    targetWeightsRef.current = Array.from({ length: N }, () => BASE_WEIGHT);
    targetWidthsRef.current  = Array.from({ length: N }, () => BASE_WIDTH);
    targetScalesRef.current  = Array.from({ length: N }, () => BASE_SCALE);

    spansRef.current.forEach((span) => {
      if (!span) return;
      span.style.fontVariationSettings = `"wght" ${BASE_WEIGHT}, "wdth" ${BASE_WIDTH}`;
      span.style.transform = `scaleY(${BASE_SCALE})`;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  useEffect(() => {
    const startLoop = () => {
      if (isLoopingRef.current) return;
      isLoopingRef.current = true;

      const loop = () => {
        let settled = true;

        for (let i = 0; i < N; i++) {
          const span = spansRef.current[i];
          if (!span) continue;

          const w  = weightsRef.current[i] + (targetWeightsRef.current[i] - weightsRef.current[i]) * LERP;
          const wd = widthsRef.current[i]  + (targetWidthsRef.current[i]  - widthsRef.current[i])  * LERP;
          const sc = scalesRef.current[i]  + (targetScalesRef.current[i]  - scalesRef.current[i])  * LERP;

          weightsRef.current[i] = w;
          widthsRef.current[i]  = wd;
          scalesRef.current[i]  = sc;

          if (
            Math.abs(w  - targetWeightsRef.current[i]) > 0.5 ||
            Math.abs(wd - targetWidthsRef.current[i])  > 0.1 ||
            Math.abs(sc - targetScalesRef.current[i])  > 0.002
          ) settled = false;

          // wdth stays fixed — only weight + scaleY change (letter grows taller in column)
          span.style.fontVariationSettings = `"wght" ${Math.round(w)}, "wdth" ${BASE_WIDTH}`;
          span.style.transform = `scaleY(${sc.toFixed(3)})`;
          span.style.zIndex = sc > 1.05 ? '2' : '0';  // hover letter above neighbors
        }

        if (settled) { isLoopingRef.current = false; return; }
        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    };

    const onMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < N; i++) {
        const span = spansRef.current[i];
        if (!span) continue;

        const rect = span.getBoundingClientRect();
        const charCX = rect.left + rect.width  / 2;
        const charCY = rect.top  + rect.height / 2;
        const dx   = e.clientX - charCX;
        const dy   = e.clientY - charCY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          const t = 1 - dist / RADIUS;
          // Smoothstep: t²(3 - 2t)
          const eased = t * t * (3 - 2 * t);

          targetWeightsRef.current[i] = BASE_WEIGHT + (MAX_WEIGHT - BASE_WEIGHT) * eased;
          targetWidthsRef.current[i]  = BASE_WIDTH;  // fixed — no horizontal expansion
          targetScalesRef.current[i]  = BASE_SCALE  + (MAX_SCALE  - BASE_SCALE)  * eased;
        } else {
          targetWeightsRef.current[i] = BASE_WEIGHT;
          targetWidthsRef.current[i]  = BASE_WIDTH;
          targetScalesRef.current[i]  = BASE_SCALE;
        }
      }
      startLoop();
    };

    const onMouseLeave = () => {
      for (let i = 0; i < N; i++) {
        targetWeightsRef.current[i] = BASE_WEIGHT;
        targetWidthsRef.current[i]  = BASE_WIDTH;
        targetScalesRef.current[i]  = BASE_SCALE;
      }
      startLoop();
    };

    window.addEventListener("mousemove",  onMouseMove,  { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tp-flex tp-stroke ${className || ""}`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.25em",
        userSelect: "none",
        width: "100%",
        overflow: "visible",
        ...style,
      }}
      aria-label={text}
      role="heading"
      aria-level={1}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => { if (el) spansRef.current[i] = el; }}
          aria-hidden="true"
          style={{
            display: "inline-block",
            fontFamily: "'Roboto Flex', sans-serif",
            fontWeight: 100,
            fontVariationSettings: `"wght" ${BASE_WEIGHT}, "wdth" ${BASE_WIDTH}`,
            color: "rgba(255, 255, 255, 0.88)",
            transformOrigin: "center center",
            lineHeight: 1,
            position: "relative",
            zIndex: 0,
            willChange: "transform, font-variation-settings",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
