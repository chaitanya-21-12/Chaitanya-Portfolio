"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { executeCommand, WELCOME_LINES, TerminalLine } from "@/lib/terminal-commands";

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hint, setHint] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+T shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Init welcome lines on open
  useEffect(() => {
    if (isOpen) {
      setLines(WELCOME_LINES);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = useCallback(() => {
    if (!input.trim() && input !== "") return;

    const trimmed = input.trim();
    const newLines: TerminalLine[] = [
      { type: "input", content: trimmed },
    ];

    const result = executeCommand(trimmed);

    if (result.length === 1 && result[0].content === "__CLEAR__") {
      setLines(WELCOME_LINES);
      setInput("");
      return;
    }

    if (result.length === 1 && result[0].content === "__EXIT__") {
      setIsOpen(false);
      setInput("");
      return;
    }

    setLines((prev) => [...prev, ...newLines, ...result]);
    if (trimmed) {
      setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    }
    setHistoryIndex(-1);
    setInput("");
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = ["help","about","skills","projects","experience","contact","socials","whoami","clear","exit"];
      const match = commands.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  const lineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":   return "#e2e8f0";
      case "success": return "#c8102e";
      case "error":   return "#ff6b6b";
      case "ascii":   return "#c8102e";
      default:        return "rgba(255,255,255,0.65)";
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setHint(false); }}
        title="Open Terminal (Ctrl + T)"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "1.5rem",
          zIndex: 9000,
          background: "rgba(10,10,10,0.85)",
          border: "1px solid rgba(200,16,46,0.4)",
          borderRadius: "8px",
          padding: "0.45rem 0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: hint ? "0 0 16px rgba(200,16,46,0.3)" : "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,16,46,0.8)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(200,16,46,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,16,46,0.4)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = hint ? "0 0 16px rgba(200,16,46,0.3)" : "none";
        }}
      >
        <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#c8102e" }}>{">"}_</span>
        {hint && (
          <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
            Ctrl + T
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        animation: "termFadeIn 0.15s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
    >
      <style>{`
        @keyframes termFadeIn { from { opacity:0; transform:scale(0.97) } to { opacity:1; transform:scale(1) } }
        .term-scroll::-webkit-scrollbar { width: 4px; }
        .term-scroll::-webkit-scrollbar-track { background: transparent; }
        .term-scroll::-webkit-scrollbar-thumb { background: rgba(200,16,46,0.3); border-radius: 2px; }
      `}</style>
      <div
        style={{
          width: "min(820px, 95vw)",
          height: "min(560px, 85vh)",
          background: "rgba(6,6,8,0.97)",
          border: "1px solid rgba(200,16,46,0.25)",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(200,16,46,0.08)",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        }}
      >
        {/* Title bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.65rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {["#ff5f56","#ffbd2e","#27c93f"].map((c, i) => (
              <div key={i} onClick={i === 0 ? () => setIsOpen(false) : undefined}
                style={{ width: 12, height: 12, borderRadius: "50%", background: c, cursor: i === 0 ? "pointer" : "default" }} />
            ))}
          </div>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
            portfolio — chaitanya@ca ~ bash
          </span>
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)" }}>Esc to close</span>
        </div>

        {/* Output */}
        <div
          className="term-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", fontSize: "0.78rem", lineHeight: 1.7 }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {line.type === "input" && (
                <span style={{ color: "#c8102e", marginRight: "0.5rem", flexShrink: 0 }}>
                  chaitanya@ca ~ %
                </span>
              )}
              <span style={{ color: lineColor(line.type) }}>{line.content}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "0.65rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          gap: "0.5rem",
          flexShrink: 0,
        }}>
          <span style={{ color: "#c8102e", fontSize: "0.78rem", flexShrink: 0 }}>
            chaitanya@ca ~ %
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            placeholder="type a command..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: "0.78rem",
              fontFamily: "inherit",
              caretColor: "#c8102e",
            }}
          />
        </div>
      </div>
    </div>
  );
}
