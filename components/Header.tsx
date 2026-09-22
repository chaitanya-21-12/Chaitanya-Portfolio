"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/lib/data";

interface HeaderProps {
  onNavOpen: () => void;
}

export default function Header({ onNavOpen }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem 2rem",
        mixBlendMode: "normal",
      }}
    >
      {/* Logo / Monogram */}
      <a
        href="#"
        aria-label="Chaitanya Aggarwal - Home"
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#f0ede8",
          textDecoration: "none",
          fontFamily: "Geist, sans-serif",
        }}
      >
        <span style={{ color: "#c8102e" }}>C</span>
        <span>A.</span>
      </a>

      {/* Dive In Button */}
      <button
        onClick={onNavOpen}
        id="nav-open-btn"
        aria-label="Open navigation menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "100px",
          padding: "0.5rem 1.25rem",
          color: "#f0ede8",
          fontFamily: "Geist, sans-serif",
          fontSize: "0.8125rem",
          letterSpacing: "0.02em",
          fontWeight: 400,
          transition: "border-color 0.3s ease, background 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(200,16,46,0.5)";
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(200,16,46,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(255,255,255,0.12)";
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        Dive In{" "}
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>+</span>
      </button>
    </motion.header>
  );
}
