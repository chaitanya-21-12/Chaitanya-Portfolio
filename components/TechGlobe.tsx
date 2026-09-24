"use client";

import { useEffect, useRef, useState } from "react";

const TECHS = [
  { name: "React",       color: "#61DAFB" },
  { name: "Next.js",     color: "#ffffff" },
  { name: "TypeScript",  color: "#3178C6" },
  { name: "Node.js",     color: "#68A063" },
  { name: "MongoDB",     color: "#47A248" },
  { name: "Flutter",     color: "#02569B" },
  { name: "Python",      color: "#FFD343" },
  { name: "PostgreSQL",  color: "#336791" },
  { name: "Express.js",  color: "#999999" },
  { name: "Supabase",    color: "#3ECF8E" },
  { name: "Java",        color: "#ED8B00" },
  { name: "MySQL",       color: "#4479A1" },
  { name: "JavaScript",  color: "#F7DF1E" },
  { name: "HTML",        color: "#E34F26" },
  { name: "CSS",         color: "#1572B6" },
  { name: "Git",         color: "#F05032" },
  { name: "Unreal",      color: "#0E1128" },
  { name: "Arduino",     color: "#00979D" },
  { name: "Dart",        color: "#0175C2" },
  { name: "Figma",       color: "#F24E1E" },
];

interface Tag {
  name: string;
  color: string;
  theta: number; // longitude
  phi: number;   // latitude
}

function distributeOnSphere(count: number): { theta: number; phi: number }[] {
  // Fibonacci sphere distribution for even spacing
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const phi = Math.acos(y);
    points.push({ theta, phi });
  }
  return points;
}

export default function TechGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const rotY = useRef(0);
  const rotX = useRef(0.2);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const velY = useRef(0.003);
  const velX = useRef(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [transforms, setTransforms] = useState<{ x: number; y: number; z: number; op: number }[]>([]);

  useEffect(() => {
    const pts = distributeOnSphere(TECHS.length);
    setTags(TECHS.map((t, i) => ({ ...t, ...pts[i] })));
  }, []);

  useEffect(() => {
    if (tags.length === 0) return;

    const RADIUS = 160;

    function project(theta: number, phi: number, ry: number, rx: number) {
      // Rotate by ry (Y axis) and rx (X axis)
      const sinRY = Math.sin(ry), cosRY = Math.cos(ry);
      const sinRX = Math.sin(rx), cosRX = Math.cos(rx);

      // Sphere point
      let x = Math.sin(phi) * Math.cos(theta);
      let y = Math.cos(phi);
      let z = Math.sin(phi) * Math.sin(theta);

      // Rotate around Y
      const x1 = x * cosRY - z * sinRY;
      const z1 = x * sinRY + z * cosRY;

      // Rotate around X
      const y2 = y * cosRX - z1 * sinRX;
      const z2 = y * sinRX + z1 * cosRX;

      return { x: x1 * RADIUS, y: y2 * RADIUS, z: z2, op: (z2 + 1) / 2 };
    }

    function animate() {
      if (!isDragging.current) {
        rotY.current += velY.current;
        rotX.current += velX.current * 0.1;
        velX.current *= 0.95;
      }

      const next = tags.map((t) =>
        project(t.theta, t.phi, rotY.current, rotX.current)
      );
      setTransforms(next);
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [tags]);

  // Mouse / touch drag
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      const pos = "touches" in e ? e.touches[0] : e;
      lastMouse.current = { x: pos.clientX, y: pos.clientY };
    };
    const onUp = () => { isDragging.current = false; };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const pos = "touches" in e ? e.touches[0] : e;
      const dx = pos.clientX - lastMouse.current.x;
      const dy = pos.clientY - lastMouse.current.y;
      rotY.current += dx * 0.005;
      rotX.current += dy * 0.005;
      velY.current = dx * 0.002;
      velX.current = dy * 0.002;
      lastMouse.current = { x: pos.clientX, y: pos.clientY };
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <section
      id="tech-globe"
      style={{
        background: "#080808",
        padding: "5rem 0 4rem",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}>

          {/* Left: text */}
          <div>
            <p style={{
              fontSize: "0.65rem", letterSpacing: "0.2em", color: "#c8102e",
              fontFamily: "Geist, sans-serif", marginBottom: "0.75rem",
            }}>
              ● TECH STACK
            </p>
            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.6rem)", fontWeight: 300,
              color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em",
              fontFamily: "Geist, sans-serif", lineHeight: 1.2,
              marginBottom: "1.25rem",
            }}>
              Tools I Build<br />With
            </h2>
            <p style={{
              fontSize: "0.85rem", color: "rgba(255,255,255,0.4)",
              fontFamily: "Geist, sans-serif", lineHeight: 1.7,
              maxWidth: "360px",
            }}>
              An interactive 3D map of my technical universe. Drag to rotate — every tag is a technology I&apos;ve shipped production code with.
            </p>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2rem" }}>
              {TECHS.slice(0, 6).map((t) => (
                <span key={t.name} style={{
                  padding: "0.25rem 0.7rem",
                  borderRadius: "100px",
                  border: `1px solid ${t.color}33`,
                  background: `${t.color}11`,
                  fontSize: "0.7rem",
                  color: t.color,
                  fontFamily: "Geist, sans-serif",
                }}>
                  {t.name}
                </span>
              ))}
              <span style={{
                padding: "0.25rem 0.7rem",
                borderRadius: "100px",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "Geist, sans-serif",
              }}>
                +{TECHS.length - 6} more
              </span>
            </div>
          </div>

          {/* Right: globe */}
          <div
            ref={containerRef}
            style={{
              position: "relative",
              width: "100%",
              height: "400px",
              cursor: "grab",
              userSelect: "none",
            }}
          >
            {/* Glow behind globe */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 260, height: 260,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,16,46,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Wireframe circle hint */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 320, height: 320,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.04)",
              pointerEvents: "none",
            }} />

            {/* Tags */}
            {tags.map((tag, i) => {
              const t = transforms[i];
              if (!t) return null;
              const scale = 0.55 + t.op * 0.65;
              const opacity = 0.15 + t.op * 0.85;
              return (
                <div
                  key={tag.name}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px)) scale(${scale})`,
                    opacity,
                    transition: "none",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: Math.round(t.z * 100 + 100),
                  }}
                >
                  <span style={{
                    fontSize: "0.7rem",
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 500,
                    color: tag.color,
                    letterSpacing: "0.04em",
                    textShadow: `0 0 12px ${tag.color}88`,
                    padding: "0.2rem 0.5rem",
                    background: `${tag.color}12`,
                    borderRadius: "4px",
                    border: `1px solid ${tag.color}28`,
                  }}>
                    {tag.name}
                  </span>
                </div>
              );
            })}

            {/* Drag hint */}
            <div style={{
              position: "absolute",
              bottom: 12, left: "50%",
              transform: "translateX(-50%)",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "Geist, sans-serif",
              letterSpacing: "0.1em",
              pointerEvents: "none",
            }}>
              drag to rotate
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
