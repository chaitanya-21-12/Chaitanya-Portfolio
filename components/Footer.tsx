"use client";

import { personalInfo } from "@/lib/data";

const socials = [
  { label: "GitHub", href: personalInfo.socials.github },
  { label: "LinkedIn", href: personalInfo.socials.linkedin },

  { label: "Instagram", href: personalInfo.socials.instagram },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "3rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        {/* Left: logo + tagline */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem" }}>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#f0ede8",
              fontFamily: "Geist, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#c8102e" }}>C</span>A.
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#444440",
              fontFamily: "Geist, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            Full Stack Web Developer
          </span>
        </div>

        {/* Center: socials */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.8125rem",
                color: "#888880",
                textDecoration: "none",
                fontFamily: "Geist, sans-serif",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#c8102e";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#888880";
              }}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Right: copyright */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "#444440",
            fontFamily: "Geist, sans-serif",
          }}
        >
          © 2026 Chaitanya Aggarwal
        </p>
      </div>
    </footer>
  );
}
