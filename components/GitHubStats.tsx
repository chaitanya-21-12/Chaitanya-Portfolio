"use client";

import { useEffect, useState, useRef } from "react";
import { skills } from "@/lib/data";

interface Repo {
  name: string;
  description: string | null;
  stars: number;
  language: string | null;
  isPrivate: boolean;
  url: string | null;
}

interface Lang { name: string; count: number; }

interface GHData {
  avatar: string;
  publicRepos: number;
  privateRepos: number;
  totalRepos: number;
  totalStars: number;
  followers: number;
  topRepos: Repo[];
  topLanguages: Lang[];
  profileUrl: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
  Java: "#b07219", CSS: "#563d7c", HTML: "#e34c26",
  Dart: "#00B4AB", "C++": "#f34b7d", C: "#555555",
};

function AnimatedNumber({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

export default function GitHubStats() {
  const [data, setData] = useState<GHData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = data?.topLanguages.reduce((a, l) => a + l.count, 0) || 1;

  return (
    <section
      id="github-stats"
      style={{
        background: "#080808",
        padding: "5rem 0 4rem",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.65rem", letterSpacing: "0.2em", color: "#c8102e",
            fontFamily: "Geist, sans-serif", marginBottom: "0.75rem",
          }}>
            ● OPEN SOURCE
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300,
              color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em",
              fontFamily: "Geist, sans-serif",
            }}>
              GitHub Activity
            </h2>
            {data && (
              <a
                href={data.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.75rem", color: "rgba(255,255,255,0.4)",
                  fontFamily: "Geist, sans-serif", letterSpacing: "0.08em",
                  textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)",
                  padding: "0.4rem 0.9rem", borderRadius: "100px",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,16,46,0.5)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)";
                }}
              >
                View Profile →
              </a>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Geist, sans-serif", fontSize: "0.85rem" }}>
            Fetching GitHub data...
          </div>
        ) : !data ? (
          <div style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Geist, sans-serif", fontSize: "0.85rem" }}>
            Could not load GitHub stats.
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "12px", overflow: "hidden",
              marginBottom: "2.5rem",
            }}>
              {[
                { label: "Total Repos", value: data.totalRepos },
                { label: "Total Stars", value: data.totalStars },
                { label: "Followers", value: data.followers },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: "#0d0d0d", padding: "1.75rem 1.5rem", textAlign: "center",
                }}>
                  <div style={{
                    fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 300,
                    color: "#fff", fontFamily: "Geist, sans-serif", letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}>
                    <AnimatedNumber target={value} />
                  </div>
                  <div style={{
                    fontSize: "0.65rem", color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.15em", marginTop: "0.5rem",
                    fontFamily: "Geist, sans-serif", textTransform: "uppercase",
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Grid: Top Repos + Languages */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

              {/* Top Repos */}
              <div style={{
                background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "12px", padding: "1.5rem",
              }}>
                <p style={{
                  fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)",
                  fontFamily: "Geist, sans-serif", marginBottom: "1.25rem", textTransform: "uppercase",
                }}>
                  Top Repositories
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {data.topRepos.map((repo) => {
                    const Tag = repo.url ? "a" : "div";
                    return (
                    <Tag
                      key={repo.name}
                      {...(repo.url ? { href: repo.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{
                        display: "block", textDecoration: "none",
                        padding: "0.85rem 1rem",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "8px", background: "rgba(255,255,255,0.02)",
                        transition: "border-color 0.2s, background 0.2s",
                        cursor: repo.url ? "pointer" : "default",
                      }}
                      onMouseEnter={repo.url ? (e: React.MouseEvent<HTMLElement>) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,16,46,0.3)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(200,16,46,0.04)";
                      } : undefined}
                      onMouseLeave={repo.url ? (e: React.MouseEvent<HTMLElement>) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                      } : undefined}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          {repo.isPrivate && (
                            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>🔒</span>
                          )}
                          <span style={{
                            fontSize: "0.8rem", color: "rgba(255,255,255,0.85)",
                            fontFamily: "Geist, sans-serif", fontWeight: 500,
                          }}>
                            {repo.name}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ color: "#fbbf24", fontSize: "0.65rem" }}>★</span>
                          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontFamily: "Geist, sans-serif" }}>
                            {repo.stars}
                          </span>
                        </div>
                      </div>
                      {repo.description && (
                        <p style={{
                          fontSize: "0.7rem", color: "rgba(255,255,255,0.35)",
                          fontFamily: "Geist, sans-serif", marginTop: "0.3rem",
                          lineHeight: 1.5, overflow: "hidden",
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}>
                          {repo.description}
                        </p>
                      )}
                      {repo.language && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem" }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: LANG_COLORS[repo.language] || "#888",
                            display: "inline-block", flexShrink: 0,
                          }} />
                          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "Geist, sans-serif" }}>
                            {repo.language}
                          </span>
                        </div>
                      )}
                    </Tag>
                    );
                  })}
                </div>
              </div>

              {/* Language Breakdown */}
              <div style={{
                background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "12px", padding: "1.5rem",
              }}>
                <p style={{
                  fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)",
                  fontFamily: "Geist, sans-serif", marginBottom: "1.25rem", textTransform: "uppercase",
                }}>
                  Language Breakdown
                </p>

                {/* Bar */}
                <div style={{
                  display: "flex", height: "8px", borderRadius: "4px",
                  overflow: "hidden", marginBottom: "1.5rem", gap: "2px",
                }}>
                  {data.topLanguages.map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${(lang.count / total) * 100}%`,
                        background: LANG_COLORS[lang.name] || "#555",
                        borderRadius: "2px",
                        transition: "width 0.8s ease",
                      }}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {data.topLanguages.map((lang) => (
                    <div key={lang.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{
                          width: 9, height: 9, borderRadius: "50%",
                          background: LANG_COLORS[lang.name] || "#555",
                          display: "inline-block", flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontFamily: "Geist, sans-serif" }}>
                          {lang.name}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontFamily: "Geist, sans-serif" }}>
                        {((lang.count / total) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            {/* Frameworks & Tools */}
            <div style={{
              marginTop: "1.5rem",
              background: "#0d0d0d",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "1.5rem",
            }}>
              <p style={{
                fontSize: "0.65rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)",
                fontFamily: "Geist, sans-serif", marginBottom: "1.25rem", textTransform: "uppercase",
              }}>
                Frameworks & Tools
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {[...skills.frameworks, ...skills.backend].map((tech) => (
                  <span key={tech} style={{
                    padding: "0.3rem 0.75rem",
                    borderRadius: "100px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.65)",
                    fontFamily: "Geist, sans-serif",
                    background: "rgba(255,255,255,0.03)",
                    letterSpacing: "0.02em",
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </>
        )}
      </div>
    </section>
  );
}
