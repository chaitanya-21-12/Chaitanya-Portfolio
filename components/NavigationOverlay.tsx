"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/lib/data";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "PROJECTS", num: "01", href: "#projects" },
  { label: "ABOUT", num: "02", href: "#about" },
  { label: "EXPERIENCE", num: "03", href: "#experience" },
  { label: "EDUCATION", num: "04", href: "#education" },
  { label: "CONTACT", num: "05", href: "#contact" },
];

const socials = [
  { label: "GitHub", href: personalInfo.socials.github },
  { label: "LinkedIn", href: personalInfo.socials.linkedin },

  { label: "Instagram", href: personalInfo.socials.instagram },
];

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleNavClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 650);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click to close */}
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 8900,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Right-side panel */}
          <motion.div
            ref={panelRef}
            key="nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 9000,
              width: "min(480px, 90vw)",
              background: "#0a0a0a",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.75rem 2rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "#f0ede8", fontFamily: "Geist, sans-serif" }}>
                <span style={{ color: "#c8102e" }}>C</span>A.
              </span>
              <button
                onClick={onClose}
                id="nav-close-btn"
                aria-label="Close navigation menu"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "100px",
                  padding: "0.5rem 1.25rem",
                  color: "#f0ede8",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.02em",
                  cursor: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,16,46,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                }}
              >
                Close <span style={{ fontSize: "1rem" }}>×</span>
              </button>
            </div>

            {/* Navigation items — staggered reveal */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.5rem 2rem", overflowY: "auto" }}>
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{
                    duration: 0.45,
                    delay: isOpen ? 0.1 + i * 0.09 : i * 0.04,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item.href)}
                    aria-label={`Navigate to ${item.label}`}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      width: "100%",
                      textAlign: "left",
                      padding: "1rem 0",
                      display: "flex",
                      alignItems: "baseline",
                      gap: "1rem",
                      cursor: "none",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      const label = e.currentTarget.querySelector(".nav-label") as HTMLElement;
                      const num = e.currentTarget.querySelector(".nav-num") as HTMLElement;
                      const arrow = e.currentTarget.querySelector(".nav-arrow") as HTMLElement;
                      if (label) { label.style.color = "#c8102e"; label.style.letterSpacing = "-0.01em"; }
                      if (num) num.style.color = "#c8102e";
                      if (arrow) { arrow.style.opacity = "1"; arrow.style.transform = "translateX(0)"; }
                    }}
                    onMouseLeave={(e) => {
                      const label = e.currentTarget.querySelector(".nav-label") as HTMLElement;
                      const num = e.currentTarget.querySelector(".nav-num") as HTMLElement;
                      const arrow = e.currentTarget.querySelector(".nav-arrow") as HTMLElement;
                      if (label) { label.style.color = "#f0ede8"; label.style.letterSpacing = "-0.03em"; }
                      if (num) num.style.color = "#333330";
                      if (arrow) { arrow.style.opacity = "0"; arrow.style.transform = "translateX(-8px)"; }
                    }}
                  >
                    <span
                      className="nav-num"
                      style={{
                        fontSize: "0.6875rem",
                        letterSpacing: "0.08em",
                        color: "#333330",
                        fontFamily: "Geist, sans-serif",
                        transition: "color 0.3s ease",
                        flexShrink: 0,
                        paddingBottom: "0.25rem",
                      }}
                    >
                      {item.num}
                    </span>
                    <span
                      className="nav-label"
                      style={{
                        fontSize: "clamp(2rem, 5vw, 3.25rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#f0ede8",
                        fontFamily: "Geist, sans-serif",
                        lineHeight: 1.05,
                        transition: "color 0.3s ease, letter-spacing 0.3s ease",
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="nav-arrow"
                      style={{
                        fontSize: "1.25rem",
                        color: "#c8102e",
                        opacity: 0,
                        transform: "translateX(-8px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        flexShrink: 0,
                      }}
                    >
                      →
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              style={{
                padding: "1.5rem 2rem",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                flexShrink: 0,
              }}
            >
              <p style={{ fontSize: "0.5625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8102e", marginBottom: "0.875rem", fontFamily: "Geist, sans-serif" }}>
                SOCIALS
              </p>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.8125rem", color: "#888880", textDecoration: "none", fontFamily: "Geist, sans-serif", transition: "color 0.3s ease" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#f0ede8"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#888880"; }}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
