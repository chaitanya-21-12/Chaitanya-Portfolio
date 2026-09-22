"use client";

import { motion } from "framer-motion";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section
      id="experience"
      style={{
        background: "#080808",
        padding: "8rem 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "5rem" }}
        >
          <div className="section-label" style={{ marginBottom: "1.25rem" }}>
            EXPERIENCE
          </div>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#f0ede8",
              fontFamily: "Geist, sans-serif",
              lineHeight: 1,
              marginBottom: "1rem",
            }}
          >
            Where I&apos;ve Been
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#888880",
              fontFamily: "Geist, sans-serif",
              maxWidth: "450px",
              lineHeight: 1.7,
            }}
          >
            My professional journey through different roles and environments.
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: "3rem",
                padding: "3rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                alignItems: "start",
              }}
            >
              {/* Left: meta */}
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#888880",
                    fontFamily: "Geist, sans-serif",
                    marginBottom: "0.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {exp.period}
                </p>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#c8102e",
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {exp.type}
                </p>
              </div>

              {/* Right: detail */}
              <div>
                <h3
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#f0ede8",
                    fontFamily: "Geist, sans-serif",
                    lineHeight: 1.1,
                    marginBottom: "0.4rem",
                  }}
                >
                  {exp.role}
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#c8102e",
                    fontFamily: "Geist, sans-serif",
                    marginBottom: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {exp.company}
                </p>
                {exp.description && (
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "#888880",
                      fontFamily: "Geist, sans-serif",
                      lineHeight: 1.7,
                      fontWeight: 300,
                      maxWidth: "560px",
                    }}
                  >
                    {exp.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
