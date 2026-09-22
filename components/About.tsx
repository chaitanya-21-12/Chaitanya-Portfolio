"use client";

import { motion } from "framer-motion";
import { personalInfo, experiences } from "@/lib/data";

/** Splits text into word spans, each with a staggered whileInView reveal */
function WordReveal({ text, delay = 0, style = {} }: {
  text: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <span style={{ display: "inline", ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.045,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function About() {
  return (
    <section
      id="about"
      style={{
        // Transparent — sits on shared dark atmospheric canvas
        background: "transparent",
        padding: "10rem 0 8rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle left-side ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(200,16,46,0.04) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Section wrapper — scales in as it enters viewport */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}
      >
        {/* Section header */}
        <div style={{ marginBottom: "5rem" }}>
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "1.25rem" }}
          >
            WHO I AM
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#f0ede8",
              fontFamily: "Geist, sans-serif",
              lineHeight: 1,
            }}
          >
            About
          </motion.h2>
        </div>

        {/* Two-column layout */}
        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8rem",
            alignItems: "start",
          }}
        >
          {/* Left: Name + bio — word-by-word reveal */}
          <div>
            {/* Large name display */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ marginBottom: "3rem" }}
            >
              <p
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "#f0ede8",
                  fontFamily: "Geist, sans-serif",
                  lineHeight: 0.95,
                  marginBottom: "0.5rem",
                }}
              >
                CHAITANYA
                <br />
                <span style={{ color: "rgba(240,237,232,0.25)" }}>AGGARWAL</span>
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#c8102e", fontFamily: "Geist, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem" }}>
                {personalInfo.title}
              </p>
            </motion.div>

            {/* Bio — word-by-word reveal */}
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#888880",
                fontFamily: "Geist, sans-serif",
                fontWeight: 300,
                lineHeight: 1.85,
                marginBottom: "2.5rem",
              }}
            >
              <WordReveal
                text="Full stack web developer with hands-on experience building and deploying live client websites."
                delay={0.05}
              />
              {" "}
              <WordReveal
                text="Comfortable across the stack — React/Next.js front ends to Node.js/Express/PostgreSQL backends —"
                delay={0.2}
              />
              {" "}
              <WordReveal
                text="with a track record of shipping freelance and internship projects to production."
                delay={0.4}
              />
            </p>

            {/* Quick details — stagger in */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "LOCATION", value: personalInfo.location },
                { label: "AVAILABILITY", value: personalInfo.availability },
                { label: "EMAIL", value: personalInfo.email, href: `mailto:${personalInfo.email}` },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  style={{ display: "flex", gap: "2rem", alignItems: "baseline", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <span style={{ fontSize: "0.5625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#444440", fontFamily: "Geist, sans-serif", width: "100px", flexShrink: 0 }}>
                    {item.label}
                  </span>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: "0.9375rem", color: "#f0ede8", fontFamily: "Geist, sans-serif", textDecoration: "none", transition: "color 0.3s ease" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#c8102e"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#f0ede8"; }}
                    >{item.value}</a>
                  ) : (
                    <span style={{ fontSize: "0.9375rem", color: "#f0ede8", fontFamily: "Geist, sans-serif" }}>{item.value}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Experience timeline — slides from right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p style={{ fontSize: "0.5625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8102e", fontFamily: "Geist, sans-serif", marginBottom: "2rem" }}>
              EXPERIENCE
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    paddingBottom: "1.75rem",
                    marginBottom: "1.75rem",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.375rem", gap: "1rem" }}>
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 500, color: "#f0ede8", fontFamily: "Geist, sans-serif", letterSpacing: "-0.01em", marginBottom: "0.2rem" }}>
                        {exp.role}
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "#c8102e", fontFamily: "Geist, sans-serif", letterSpacing: "0.02em" }}>
                        {exp.company}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: "0.6875rem", color: "#444440", fontFamily: "Geist, sans-serif", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>
                        {exp.period}
                      </p>
                      <p style={{ fontSize: "0.5625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#333330", fontFamily: "Geist, sans-serif" }}>
                        {exp.type}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: "0.8125rem", color: "#666662", fontFamily: "Geist, sans-serif", lineHeight: 1.7, marginTop: "0.5rem" }}>
                      {exp.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
