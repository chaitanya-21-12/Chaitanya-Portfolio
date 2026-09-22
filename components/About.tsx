"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";

const pillars = [
  {
    num: "01",
    tag: "PRODUCTION SYSTEMS",
    title: "Live Commercial Web Apps",
    desc: "End-to-end hotel booking systems, rental platforms with dealer consoles, & cafe management SaaS deployed for real clients.",
    skills: ["Next.js", "React", "Node.js", "PostgreSQL", "Supabase"],
  },
  {
    num: "02",
    tag: "CREATIVE COMPUTING",
    title: "3D Virtual Worlds & ML",
    desc: "ARTisTry (Unreal Engine 5 AR/VR simulation with 3D audio & cutscenes) and academic time-series predictive modeling.",
    skills: ["Unreal Engine 5", "Blueprints", "AR/VR", "Time-Series ML"],
  },
  {
    num: "03",
    tag: "LEADERSHIP & OPERATIONS",
    title: "Campus Execution & Culture",
    desc: "Core member managing transport & logistics for 500+ attendees at Sabrang '24 and organized campus BGMI esports tournaments.",
    skills: ["Sabrang '24 Core", "Logistics 500+", "Esports Lead"],
  },
];

export default function About() {
  return (
    <section
      id="about"
      style={{
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "6rem 0 4rem",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "25%",
          left: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(200,16,46,0.04) 0%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Main container — fits comfortably in 1 viewport */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", width: "100%", position: "relative", zIndex: 1 }}
      >
        {/* Section label */}
        <div style={{ marginBottom: "1.75rem" }}>
          <span className="section-label">01 / ABOUT ME</span>
        </div>

        {/* Two-column layout — compact & punchy */}
        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left Column: Name, concise bio, stats & resume button */}
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
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
              </h2>
              <p style={{
                fontSize: "0.75rem",
                color: "#c8102e",
                fontFamily: "Geist, sans-serif",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "0.75rem",
              }}>
                {personalInfo.title}
              </p>
            </div>

            {/* Concise 2-sentence bio */}
            <p
              style={{
                fontSize: "1rem",
                color: "#888880",
                fontFamily: "Geist, sans-serif",
                fontWeight: 300,
                lineHeight: 1.75,
                marginBottom: "1.75rem",
                maxWidth: "540px",
              }}
            >
              Full-stack engineer and creative technologist based in Jaipur, pursuing Computer Science &amp; Engineering at JK Lakshmipat University (Class of 2026). I build high-performance production systems for live clients and explore 3D virtual worlds in Unreal Engine 5.
            </p>

            {/* Compact metrics badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.75rem",
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                marginBottom: "1.75rem",
              }}
            >
              <div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f0ede8", fontFamily: "Geist, sans-serif", lineHeight: 1 }}>
                  4<span style={{ color: "#c8102e" }}>+</span>
                </p>
                <p style={{ fontSize: "0.625rem", color: "#666660", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>
                  Live Client Apps
                </p>
              </div>
              <div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f0ede8", fontFamily: "Geist, sans-serif", lineHeight: 1 }}>
                  2026
                </p>
                <p style={{ fontSize: "0.625rem", color: "#666660", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>
                  B.Tech CSE @ JKLU
                </p>
              </div>
              <div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f0ede8", fontFamily: "Geist, sans-serif", lineHeight: 1 }}>
                  500<span style={{ color: "#c8102e" }}>+</span>
                </p>
                <p style={{ fontSize: "0.625rem", color: "#666660", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>
                  Fest Logistics Lead
                </p>
              </div>
            </div>

            {/* Actions: Download Resume & Connect */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem" }}>
              <a
                href={personalInfo.resumeUrl}
                download="Chaitanya_Aggarwal_Resume.pdf"
                id="download-resume-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#c8102e",
                  color: "#ffffff",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  padding: "0.75rem 1.4rem",
                  borderRadius: "100px",
                  textDecoration: "none",
                  boxShadow: "0 0 20px rgba(200, 16, 46, 0.35)",
                  transition: "background 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#b8342b";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#c8102e";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>↓</span>
                Download Resume (PDF)
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(22, 22, 22, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#f0ede8",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  padding: "0.75rem 1.25rem",
                  borderRadius: "100px",
                  textDecoration: "none",
                  transition: "border-color 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200, 16, 46, 0.6)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Let&apos;s Connect →
              </a>
            </div>

            {/* Quick meta line */}
            <p style={{ fontSize: "0.75rem", color: "#666660", fontFamily: "Geist, sans-serif" }}>
              Jaipur, India &nbsp;•&nbsp; JK Lakshmipat University &nbsp;•&nbsp; <span style={{ color: "#f0ede8" }}>Open to opportunities</span>
            </p>
          </div>

          {/* Right Column: 3 Compact Bento Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                style={{
                  background: "rgba(18, 18, 18, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "14px",
                  padding: "1.25rem 1.5rem",
                  backdropFilter: "blur(12px)",
                  transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200, 16, 46, 0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.5), 0 0 20px rgba(200,16,46,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Header: Tag + Number */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{
                    fontSize: "0.5625rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#c8102e",
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 700,
                  }}>
                    {pillar.tag}
                  </span>
                  <span style={{
                    fontSize: "0.6875rem",
                    color: "rgba(255, 255, 255, 0.2)",
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 600,
                  }}>
                    {pillar.num}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  color: "#f0ede8",
                  fontFamily: "Geist, sans-serif",
                  letterSpacing: "-0.01em",
                  marginBottom: "0.4rem",
                }}>
                  {pillar.title}
                </h3>

                {/* Desc */}
                <p style={{
                  fontSize: "0.8125rem",
                  color: "#888880",
                  fontFamily: "Geist, sans-serif",
                  lineHeight: 1.55,
                  marginBottom: "0.75rem",
                  fontWeight: 300,
                }}>
                  {pillar.desc}
                </p>

                {/* Skills pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {pillar.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: "0.625rem",
                        fontFamily: "Geist, sans-serif",
                        color: "#B5B5B5",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.07)",
                        borderRadius: "100px",
                        padding: "0.15rem 0.6rem",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
