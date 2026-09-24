"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import InteractiveTypography from "@/components/InteractiveTypography";

interface HeroProps {
  isVisible: boolean;
}

export default function Hero({ isVisible }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Track how much hero has scrolled out of view (0 = full view, 1 = fully gone)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // CHAITANYA floats up + fades as page scrolls
  const nameY       = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  // Tagline fades out earlier (it's more subtle)
  const taglineOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  // Bottom bar fades + slides down
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const bottomY       = useTransform(scrollYProgress, [0, 0.25], ["0px", "20px"]);
  // Eyebrow fades fast
  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        background: "#111111",
      }}
    >
      {/* Background layers */}
      <AtmosphericBackground />

      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Eyebrow — top left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ padding: "5.5rem 2.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem",
                   opacity: eyebrowOpacity as any }}
        >
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%", background: "#c8102e",
            display: "inline-block", flexShrink: 0, animation: "pulse 2s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#B5B5B5", fontFamily: "Geist, sans-serif", fontWeight: 500,
          }}>
            Shipping Ideas Into Reality.
          </span>
        </motion.div>

        {/* Main typography area */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: "0 2rem", position: "relative",
        }}>
          {/* CHAITANYA + Tagline wrapper — floats up on scroll */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              y: nameY,
              opacity: nameOpacity as any,
            }}
          >
            <InteractiveTypography
              text="CHAITANYA"
              style={{
                fontSize: "clamp(5rem, 19vw, 22rem)",
                lineHeight: 1,
                textTransform: "uppercase",
                paddingTop: "0.3em",
                paddingBottom: "0.15em",
                boxSizing: "content-box",
              }}
            />

            {/* Tagline — placed cleanly below CHAITANYA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                textAlign: "center",
                marginTop: "0.5rem",
                zIndex: 20,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                opacity: taglineOpacity as any,
              }}
            >
              <p style={{
                fontSize: "clamp(0.55rem, 1vw, 0.85rem)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#c8102e",
                fontFamily: "'Poppins', Geist, sans-serif",
                fontWeight: 700,
                textShadow: "0 0 30px rgba(200,16,46,0.6)",
                opacity: 0.95,
              }}>
                Crafting Interfaces That People Remember.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar — fades down on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.1 }}
          style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            padding: "0 2.5rem 2.5rem", flexWrap: "wrap", gap: "1.5rem",
            position: "relative",
            opacity: bottomOpacity as any,
            y: bottomY,
          }}
        >
          {/* Role description */}
          <div style={{ maxWidth: "320px" }}>
            <p style={{
              fontSize: "0.875rem", color: "#B5B5B5", fontFamily: "'Poppins', Geist, sans-serif",
              fontWeight: 400, lineHeight: 1.8, letterSpacing: "0.02em",
            }}>
              Full-Stack Developer &amp; Creative Technologist engineering fast, immersive,
              and motion-driven digital products.
            </p>
          </div>

          {/* Scroll indicator — interactive button */}
          <button
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll down to About section"
            style={{
              position: "absolute", bottom: "2.5rem", left: "50%",
              transform: "translateX(-50%)", display: "flex",
              flexDirection: "column", alignItems: "center", gap: "0.5rem",
              background: "transparent", border: "none", cursor: "pointer",
              padding: "0.5rem", zIndex: 25,
            }}
          >
            <span style={{
              fontSize: "0.5rem", letterSpacing: "0.35em", textTransform: "uppercase",
              color: "rgba(181,181,181,0.6)", fontFamily: "Geist, sans-serif",
              transition: "color 0.3s ease",
            }}>Scroll</span>
            <div style={{
              width: "1px", height: "24px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
              position: "relative", overflow: "hidden",
            }}>
              <div className="scroll-line" style={{ position: "absolute", inset: 0, background: "rgba(200,16,46,0.6)" }} />
            </div>
          </button>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-end" }}>
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }}
              id="explore-work-btn"
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "#e8102e", color: "#fff",
                fontFamily: "Geist, sans-serif", fontSize: "0.8125rem",
                fontWeight: 600, letterSpacing: "0.03em",
                padding: "0.875rem 1.75rem", borderRadius: "100px", textDecoration: "none",
                boxShadow: "0 0 30px rgba(232,16,46,0.55)",
                transition: "background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#ff2040";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 45px rgba(255,32,64,0.7)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#e8102e";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(232,16,46,0.55)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              Explore Work →
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              id="lets-talk-btn"
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(255,255,255,0.08)", color: "#fff",
                fontFamily: "Geist, sans-serif", fontSize: "0.8125rem",
                fontWeight: 500, letterSpacing: "0.03em",
                padding: "0.875rem 1.5rem", borderRadius: "100px", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.45)",
                transition: "border-color 0.3s ease, background 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.85)";
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.45)";
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              Let&apos;s Talk →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
