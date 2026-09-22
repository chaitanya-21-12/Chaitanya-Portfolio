"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/lib/data";

// ProjectDetail overlay — unchanged
function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      key="project-detail"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project details`}
      style={{ position: "fixed", inset: 0, zIndex: 8000, background: "#080808", overflowY: "auto" }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", justifyContent: "flex-end", padding: "1.5rem 2rem", background: "rgba(8,8,8,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={onClose}
          id="project-detail-close"
          aria-label="Close project detail"
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", padding: "0.5rem 1.25rem", color: "#f0ede8", fontFamily: "Geist, sans-serif", fontSize: "0.8125rem", cursor: "none", transition: "border-color 0.3s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,16,46,0.5)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
        >
          Close ×
        </button>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem 6rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.6875rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8102e", marginBottom: "1rem", fontFamily: "Geist, sans-serif", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ display: "inline-block", width: "2rem", height: "1px", background: "#c8102e" }} />
            {project.category}
          </p>
          <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f0ede8", fontFamily: "Geist, sans-serif", lineHeight: 1, marginBottom: "0.5rem" }}>
            {project.title}
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#888880", fontFamily: "Geist, sans-serif", fontWeight: 300 }}>{project.subtitle}</p>
        </div>

        <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", borderRadius: "4px", overflow: "hidden", marginBottom: "3rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Image src={project.image} alt={`${project.title} screenshot`} fill style={{ objectFit: "cover" }} sizes="(max-width: 1100px) 100vw, 1100px" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", marginBottom: "3rem", paddingBottom: "3rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {project.role && (
            <div>
              <p style={{ fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#444440", fontFamily: "Geist, sans-serif", marginBottom: "0.5rem" }}>ROLE</p>
              <p style={{ fontSize: "0.9375rem", color: "#f0ede8", fontFamily: "Geist, sans-serif" }}>{project.role}</p>
            </div>
          )}
          <div>
            <p style={{ fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#444440", fontFamily: "Geist, sans-serif", marginBottom: "0.5rem" }}>YEAR</p>
            <p style={{ fontSize: "0.9375rem", color: "#f0ede8", fontFamily: "Geist, sans-serif" }}>{project.year}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#444440", fontFamily: "Geist, sans-serif", marginBottom: "0.5rem" }}>STACK</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {project.technologies.map((tech) => (
                <span key={tech} style={{ fontSize: "0.75rem", color: "#888880", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", padding: "0.2rem 0.75rem", fontFamily: "Geist, sans-serif" }}>{tech}</span>
              ))}
            </div>
          </div>
          {project.url && (
            <div>
              <p style={{ fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#444440", fontFamily: "Geist, sans-serif", marginBottom: "0.5rem" }}>LIVE SITE</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.9375rem", color: "#c8102e", fontFamily: "Geist, sans-serif", textDecoration: "none" }}>
                {project.url.replace("https://", "")} →
              </a>
            </div>
          )}
        </div>

        <p style={{ fontSize: "1.125rem", color: "#888880", fontFamily: "Geist, sans-serif", fontWeight: 300, lineHeight: 1.8, maxWidth: "700px" }}>
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

// Compact grid card for featured projects
// Directional fly-in vectors per card index
const FLY_VARIANTS = [
  { x: -70, y: 50, rotate: -3 },  // card 0: from bottom-left, slight tilt
  { x: 0,   y: 80, rotate:  1 },  // card 1: from below
  { x: 70,  y: 50, rotate:  3 },  // card 2: from bottom-right, slight tilt
  { x: 0,   y: 60, rotate: -1 },  // card 3: from below
];

function FeaturedCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fly = FLY_VARIANTS[index % FLY_VARIANTS.length];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const img = imageRef.current.querySelector("img") as HTMLImageElement | null;
    if (img) {
      img.style.transform = `scale(1.06) translate(${x * -6}px, ${y * -6}px)`;
    }
  };

  const handleMouseLeave = () => {
    const img = imageRef.current?.querySelector("img") as HTMLImageElement | null;
    if (img) img.style.transform = "scale(1) translate(0,0)";
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overlayRef.current) overlayRef.current.style.opacity = "1";
    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,16,46,0.2)";
  };

  const handleMouseLeaveDiv = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseLeave();
    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
  };

  return (
    <motion.article
      initial={{ opacity: 0, x: fly.x, y: fly.y, rotate: fly.rotate, scale: 0.92 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.85,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={() => onOpen(project)}
      className="project-card"
      style={{ cursor: "none" }}
    >
      {/* Image container */}
      <div
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveDiv}
        onMouseEnter={handleMouseEnter}
        style={{
          position: "relative",
          aspectRatio: "4/3",
          borderRadius: "3px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "1rem",
          transition: "border-color 0.4s ease",
        }}
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.2)", transition: "opacity 0.3s ease" }} />
        {/* Hover view indicator */}
        <div
          ref={overlayRef}
          className="view-indicator"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8,8,8,0.45)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "#fff", fontFamily: "Geist, sans-serif", background: "rgba(200,16,46,0.85)", padding: "0.5rem 1.25rem", borderRadius: "100px" }}>
            VIEW →
          </span>
        </div>
        {/* Category badge */}
        <div style={{ position: "absolute", top: "0.875rem", left: "0.875rem", fontSize: "0.5625rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontFamily: "Geist, sans-serif", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", padding: "0.3rem 0.75rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)" }}>
          {project.year}
        </div>
      </div>

      {/* Card meta */}
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.375rem", gap: "0.5rem" }}>
          <h3 style={{ fontSize: "clamp(0.9375rem, 1.4vw, 1.1rem)", fontWeight: 600, letterSpacing: "-0.01em", color: "#f0ede8", fontFamily: "Geist, sans-serif", lineHeight: 1.2, transition: "color 0.3s ease" }}>
            {project.title}
          </h3>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: "0.625rem", color: "#c8102e", fontFamily: "Geist, sans-serif", textDecoration: "none", border: "1px solid rgba(200,16,46,0.3)", borderRadius: "100px", padding: "0.25rem 0.75rem", flexShrink: 0, transition: "background 0.3s ease", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,16,46,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              Live ↗
            </a>
          )}
        </div>
        <p style={{ fontSize: "0.75rem", color: "#555552", fontFamily: "Geist, sans-serif", letterSpacing: "0.03em", marginBottom: "0.625rem" }}>
          {project.category}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} style={{ fontSize: "0.5625rem", color: "#666662", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "100px", padding: "0.15rem 0.55rem", fontFamily: "Geist, sans-serif", letterSpacing: "0.04em" }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// More Work card — editorial/larger format
function MoreWorkCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  return (
    <motion.article
      key={project.id}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => onOpen(project)}
      className="project-card"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
        overflow: "hidden",
        cursor: "none",
        transition: "border-color 0.4s ease",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,16,46,0.25)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          style={{ objectFit: "cover", transition: "transform 0.8s ease" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
        />
      </div>
      <div style={{ padding: "1.5rem" }}>
        <h4 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#f0ede8", fontFamily: "Geist, sans-serif", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>
          {project.title}
        </h4>
        <p style={{ fontSize: "0.8125rem", color: "#888880", fontFamily: "Geist, sans-serif", lineHeight: 1.6, marginBottom: "1rem" }}>
          {project.subtitle}
        </p>
        <p style={{ fontSize: "0.8125rem", color: "#666662", fontFamily: "Geist, sans-serif", lineHeight: 1.7, marginBottom: "1rem" }}>
          {project.description.slice(0, 120)}…
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} style={{ fontSize: "0.625rem", color: "#888880", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "100px", padding: "0.2rem 0.6rem", fontFamily: "Geist, sans-serif", letterSpacing: "0.05em" }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <>
      <section
        id="projects"
        style={{ background: "transparent", padding: "8rem 0" }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
          {/* Section header — sweeps in from left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ marginBottom: "4rem" }}
          >
            <div className="section-label" style={{ marginBottom: "1.25rem" }}>FEATURED WORK</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f0ede8", fontFamily: "Geist, sans-serif", lineHeight: 1 }}>
                Selected Projects
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                style={{ fontSize: "0.9375rem", color: "#888880", fontFamily: "Geist, sans-serif", maxWidth: "340px", lineHeight: 1.7 }}
              >
                Built for real clients — live in production, crafted with care.
              </motion.p>
            </div>
          </motion.div>

          {/* 4-column featured grid */}
          <div
            className="projects-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {featuredProjects.map((project, i) => (
              <FeaturedCard
                key={project.id}
                project={project}
                index={i}
                onOpen={setActiveProject}
              />
            ))}
          </div>

          {/* More Work */}
          {otherProjects.length > 0 && (
            <div style={{ marginTop: "8rem" }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: "3rem" }}
              >
                <div className="section-label" style={{ marginBottom: "1rem" }}>OTHER PROJECTS</div>
                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.02em", color: "#f0ede8", fontFamily: "Geist, sans-serif" }}>
                  More Work
                </h3>
              </motion.div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                {otherProjects.map((project, i) => (
                  <MoreWorkCard key={project.id} project={project} index={i} onOpen={setActiveProject} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
