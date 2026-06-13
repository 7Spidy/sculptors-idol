"use client";

import { useState } from "react";
import ProgressRing from "./ProgressRing";
import ChapterDrawer from "./ChapterDrawer";
import { regions, isChapterDone } from "@/lib/content";
import { useSessionMode } from "@/lib/SessionContext";

interface SiteNavProps {
  completedIds: Set<string>;
  currentSlug?: string;
}

export default function SiteNav({ completedIds, currentSlug = "" }: SiteNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mode = useSessionMode();

  const totalItems = regions.reduce(
    (acc, r) => acc + r.checklist.filter((i) => !i.isNavCue).length,
    0
  );
  const completedCount = regions.reduce((acc, r) => {
    return acc + r.checklist.filter((i) => !i.isNavCue && completedIds.has(i.id)).length;
  }, 0);
  const totalPercent = Math.round((completedCount / totalItems) * 100);

  const completedChapters = regions.filter((r) => isChapterDone(r, completedIds)).length;

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.875rem 1.25rem",
          borderBottom: "1px solid #2A2724",
          background: "rgba(14,13,11,0.9)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", overflow: "hidden" }}>
            <span
              style={{
                fontFamily: "var(--font-serif, serif)",
                fontSize: "1.05rem",
                fontWeight: 500,
                color: "#C9A227",
                whiteSpace: "nowrap",
                letterSpacing: "0.04em",
              }}
            >
              Sekiro
            </span>
            <span
              style={{
                color: "#9B9488",
                fontSize: "0.7rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "var(--font-serif, serif)",
              }}
            >
              Sculptor&#39;s Idol
            </span>
          </div>
          <span
            style={{
              color: "#9B9488",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {completedChapters}/19 chapters
          </span>
        </div>

        {/* Read-only badge — desktop text, mobile dot */}
        {mode === "readonly" && (
          <>
            <span
              className="readonly-badge"
              style={{
                alignItems: "center",
                fontSize: "8px",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.12em",
                color: "#9B9488",
                background: "rgba(155,148,136,0.12)",
                border: "1px solid rgba(155,148,136,0.3)",
                borderRadius: "4px",
                padding: "3px 8px",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              READ ONLY
            </span>
            <span
              className="readonly-dot"
              title="Read-only mode"
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#9B9488",
                opacity: 0.6,
                flexShrink: 0,
              }}
            />
          </>
        )}

        {/* Right: ring + drawer trigger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ProgressRing percent={totalPercent} size={32} strokeWidth={2.5} />
            <span style={{ color: "#9B9488", fontSize: "0.7rem" }}>{totalPercent}%</span>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open chapter list"
            style={{
              background: "none",
              border: "1px solid #2A2724",
              borderRadius: "4px",
              color: "#E8E2D4",
              cursor: "pointer",
              fontSize: "1rem",
              padding: "0.375rem 0.625rem",
              minWidth: "36px",
              minHeight: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ☰
          </button>
        </div>
      </nav>

      <ChapterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        completedIds={completedIds}
        currentSlug={currentSlug}
      />
    </>
  );
}
