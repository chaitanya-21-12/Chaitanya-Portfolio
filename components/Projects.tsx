"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/lib/data";

// ProjectDetail overlay modal
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
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px", padding: "0.5rem 1.25rem", color: "#f0ede8", fontFamily: "Geist, sans-serif", fontSize: "0.8125rem", cursor: "pointer", transition: "border-color 0.3s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,16,46,0.5)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
        >
          Close ✕
        </button>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem 8rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8102e", fontFamily: "Geist, sans-serif" }}>
              {project.category}
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
            <span style={{ fontSize: "0.6875rem", color: "#888880", fontFamily: "Geist, sans-serif" }}>
              {project.year}
            </span>
            {project.role && (
              <>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
                <span style={{ fontSize: "0.6875rem", color: "#888880", fontFamily: "Geist, sans-serif" }}>
                  {project.role}
                </span>
              </>
            )}
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f0ede8", fontFamily: "Geist, sans-serif", marginBottom: "1rem", lineHeight: 1.1 }}>
            {project.title}
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#c8102e", fontFamily: "Geist, sans-serif", marginBottom: "1.5rem" }}>
            {project.subtitle}
          </p>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              id="project-visit-site"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#c8102e", color: "#fff", fontFamily: "Geist, sans-serif", fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.03em", padding: "0.75rem 1.5rem", borderRadius: "100px", textDecoration: "none", transition: "background 0.3s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#b8342b"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#c8102e"; }}
            >
              Visit Live Site ↗
            </a>
          )}
        </div>

        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "4rem" }}>
          <Image src={project.image} alt={`${project.title} full view`} fill style={{ objectFit: "cover" }} sizes="1000px" priority />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "4rem" }}>
          <div>
            <h3 style={{ fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8102e", fontFamily: "Geist, sans-serif", marginBottom: "1.5rem" }}>
              Overview
            </h3>
            <p style={{ fontSize: "1rem", color: "#B5B5B5", fontFamily: "Geist, sans-serif", lineHeight: 1.9, fontWeight: 300 }}>
              {project.description}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8102e", fontFamily: "Geist, sans-serif", marginBottom: "1.5rem" }}>
              Technologies
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {project.technologies.map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#f0ede8", fontFamily: "Geist, sans-serif", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#c8102e" }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 2x2 Edge-to-Edge Website Preview Card Component (matching user reference)
function BentoProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{
        duration: 0.45,
        delay: (index % 4) * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={() => onOpen(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bento-project-card"
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(260px, 38vh, 335px)",
        borderRadius: "18px",
        overflow: "hidden",
        background: "#0d0d0d",
        border: isHovered
          ? "1px solid rgba(200, 16, 46, 0.55)"
          : "1px solid rgba(255, 255, 255, 0.09)",
        boxShadow: isHovered
          ? "0 22px 50px rgba(0, 0, 0, 0.85), 0 0 32px rgba(200, 16, 46, 0.2)"
          : "0 8px 24px rgba(0, 0, 0, 0.5)",
        cursor: "pointer",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* 100% Background Image filling the entire card */}
      <Image
        src={project.image}
        alt={`${project.title} preview`}
        fill
        style={{
          objectFit: "cover",
          objectPosition: "top center",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        sizes="(max-width: 860px) 100vw, 720px"
        loading="lazy"
      />

      {/* Subtle overlay gradient to keep text readable across both light and dark screenshot backgrounds */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 38%, transparent 70%)",
          transition: "background 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Top Badges: Category + Year on left, Live Site on right */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          right: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#f0ede8",
              fontFamily: "Geist, sans-serif",
              fontWeight: 600,
              background: "rgba(10, 10, 10, 0.75)",
              backdropFilter: "blur(10px)",
              padding: "0.3rem 0.75rem",
              borderRadius: "100px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {project.category}
          </span>
          <span
            style={{
              fontSize: "0.625rem",
              color: "rgba(255, 255, 255, 0.65)",
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              background: "rgba(10, 10, 10, 0.65)",
              backdropFilter: "blur(10px)",
              padding: "0.3rem 0.6rem",
              borderRadius: "100px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {project.year}
          </span>
        </div>

        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.625rem",
              color: "#ffffff",
              background: "rgba(200, 16, 46, 0.88)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "100px",
              padding: "0.3rem 0.75rem",
              fontFamily: "Geist, sans-serif",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 0 16px rgba(200, 16, 46, 0.5)",
              transition: "background 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#b8342b";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200, 16, 46, 0.88)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#ffffff",
                display: "inline-block",
              }}
            />
            Live Site ↗
          </a>
        ) : null}
      </div>

      {/* Center Hover Action Pill */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1)" : "scale(0.92)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.14em",
            color: "#ffffff",
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            background: "#c8102e",
            padding: "0.55rem 1.35rem",
            borderRadius: "100px",
            boxShadow: "0 0 25px rgba(200, 16, 46, 0.75)",
          }}
        >
          VIEW CASE STUDY →
        </span>
      </div>

      {/* Bottom Info Overlay inside the card */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1.25rem 1.35rem",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: "#ffffff",
            fontFamily: "Geist, sans-serif",
            lineHeight: 1.2,
            margin: 0,
            textShadow: "0 2px 10px rgba(0,0,0,0.85)",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: "0.78125rem",
            color: "#E0DED8",
            fontFamily: "Geist, sans-serif",
            fontWeight: 400,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: "0 1px 8px rgba(0,0,0,0.85)",
          }}
        >
          {project.subtitle}
        </p>

        {/* Tech pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.35rem" }}>
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: "0.5625rem",
                color: "#e0deda",
                background: "rgba(0, 0, 0, 0.55)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "100px",
                padding: "0.15rem 0.5rem",
                fontFamily: "Geist, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

const CARDS_PER_PAGE = 4;

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "client" | "creative">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = projects.filter((p) => {
    if (filter === "client") return p.type === "web";
    if (filter === "creative") return p.type !== "web";
    return true;
  });

  const totalPages = Math.ceil(filteredProjects.length / CARDS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const handleFilterChange = (tabId: "all" | "client" | "creative") => {
    setFilter(tabId);
    setCurrentPage(1);
  };

  return (
    <>
      <section
        id="projects"
        style={{
          background: "transparent",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 0",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
          {/* Section header: Sleek, compact top bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <span style={{ fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8102e", fontFamily: "Geist, sans-serif", fontWeight: 700 }}>
                02 / SELECTED WORK
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#f0ede8", fontFamily: "Geist, sans-serif", margin: 0 }}>
                Featured Projects
              </h2>
            </div>

            {/* Filter Pills + Page Switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              {/* Filter pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(255, 255, 255, 0.03)", padding: "0.25rem", borderRadius: "100px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                {[
                  { id: "all", label: "All (6)" },
                  { id: "client", label: "Client Work (4)" },
                  { id: "creative", label: "Creative & ML (2)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleFilterChange(tab.id as any)}
                    style={{
                      background: filter === tab.id ? "#c8102e" : "transparent",
                      color: filter === tab.id ? "#ffffff" : "#888880",
                      border: "none",
                      borderRadius: "100px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.6875rem",
                      fontFamily: "Geist, sans-serif",
                      fontWeight: filter === tab.id ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Page Switcher */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(255, 255, 255, 0.03)", padding: "0.2rem 0.55rem", borderRadius: "100px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: currentPage === 1 ? "rgba(255, 255, 255, 0.2)" : "#f0ede8",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontSize: "0.8125rem",
                      padding: "0.1rem 0.35rem",
                      fontFamily: "Geist, sans-serif",
                    }}
                  >
                    ‹
                  </button>
                  <span style={{ fontSize: "0.6875rem", color: "#888880", fontFamily: "Geist, sans-serif", fontWeight: 500 }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: currentPage === totalPages ? "rgba(255, 255, 255, 0.2)" : "#f0ede8",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      fontSize: "0.8125rem",
                      padding: "0.1rem 0.35rem",
                      fontFamily: "Geist, sans-serif",
                    }}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Exactly 4 Edge-to-Edge Rectangular Preview Cards (2x2 Matrix) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`page-${currentPage}-${filter}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="projects-bento-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.25rem",
              }}
            >
              {paginatedProjects.map((project, i) => (
                <BentoProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={setActiveProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>
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
