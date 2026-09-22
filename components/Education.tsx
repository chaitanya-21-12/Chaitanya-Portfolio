"use client";

import { motion } from "framer-motion";
import { education, leadership } from "@/lib/data";

export default function Education() {
  return (
    <section
      id="education"
      style={{
        background: "#080808",
        padding: "8rem 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
        <div
          className="edu-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6rem",
          }}
        >
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-label" style={{ marginBottom: "1.5rem" }}>
              EDUCATION
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f0ede8",
                fontFamily: "Geist, sans-serif",
                lineHeight: 1,
                marginBottom: "3rem",
              }}
            >
              Academic
              <br />
              Background
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    paddingLeft: "1.25rem",
                    borderLeft: "1px solid rgba(200,16,46,0.3)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-3px",
                      top: "0.4rem",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#c8102e",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#c8102e",
                      fontFamily: "Geist, sans-serif",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {edu.period}
                  </p>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "#f0ede8",
                      fontFamily: "Geist, sans-serif",
                      letterSpacing: "-0.01em",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {edu.degree}
                    {edu.field && ` — ${edu.field}`}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "#888880",
                      fontFamily: "Geist, sans-serif",
                      marginBottom: edu.grades ? "0.4rem" : 0,
                    }}
                  >
                    {edu.institution}, {edu.location}
                  </p>
                  {edu.grades && (
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#444440",
                        fontFamily: "Geist, sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      {edu.grades}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Leadership */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="section-label" style={{ marginBottom: "1.5rem" }}>
              LEADERSHIP
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f0ede8",
                fontFamily: "Geist, sans-serif",
                lineHeight: 1,
                marginBottom: "3rem",
              }}
            >
              Beyond
              <br />
              The Screen
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {leadership.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  style={{
                    padding: "1.25rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "1rem",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 500,
                        color: "#f0ede8",
                        fontFamily: "Geist, sans-serif",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.role}
                    </h3>
                    {item.description && (
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "#888880",
                          fontFamily: "Geist, sans-serif",
                          fontWeight: 300,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#c8102e",
                      fontFamily: "Geist, sans-serif",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                      paddingTop: "0.1rem",
                    }}
                  >
                    {item.event}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
