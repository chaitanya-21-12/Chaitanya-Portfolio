"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [phase, setPhase] = useState<"monogram" | "name" | "progress" | "exit">(
    "monogram"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase 1: monogram appears (0ms)
    const t1 = setTimeout(() => setPhase("name"), 800);
    // Phase 2: name reveals (800ms)
    const t2 = setTimeout(() => setPhase("progress"), 1400);
    // Phase 3: progress bar fills (1400ms)
    const t3 = setTimeout(() => setProgress(100), 1500);
    // Phase 4: exit animation (2300ms)
    const t4 = setTimeout(() => {
      setPhase("exit");
    }, 2400);
    // Complete (2800ms)
    const t5 = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "#080808",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Monogram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontSize: "clamp(5rem, 15vw, 12rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#f0ede8",
              lineHeight: 1,
              fontFamily: "Geist, sans-serif",
            }}
          >
            CA
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase !== "monogram" ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: "1.5rem",
              fontSize: "0.75rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#888880",
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            CHAITANYA AGGARWAL
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "progress" || phase === "name" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: "2rem",
              width: "160px",
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "#c8102e",
                transformOrigin: "left",
                scaleX: progress / 100,
              }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
