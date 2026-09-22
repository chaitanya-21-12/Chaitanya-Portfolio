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
          gap: "0.6rem",
          background: "rgba(22, 22, 22, 0.9)",
          border: "1.5px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "100px",
          padding: "0.55rem 1.35rem",
          color: "#ffffff",
          fontFamily: "Geist, sans-serif",
          fontSize: "0.8125rem",
          letterSpacing: "0.04em",
          fontWeight: 600,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          transition: "border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#c8102e";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(200, 16, 46, 0.15)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 20px rgba(200, 16, 46, 0.35), 0 4px 16px rgba(0, 0, 0, 0.8)";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255, 255, 255, 0.35)";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(22, 22, 22, 0.9)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        }}
      >
        <span>Dive In</span>
        <span style={{ fontSize: "1.1rem", lineHeight: 1, color: "#c8102e", fontWeight: 700 }}>+</span>
      </button>
    </motion.header>
  );
}
