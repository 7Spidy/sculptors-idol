"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { regions, isChapterDone, getChapterProgress } from "@/lib/content";

interface ChapterDrawerProps {
  open: boolean;
  onClose: () => void;
  completedIds: Set<string>;
  currentSlug: string;
}

export default function ChapterDrawer({ open, onClose, completedIds, currentSlug }: ChapterDrawerProps) {
  const router = useRouter();
  const shouldReduce = useReducedMotion();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function navigate(slug: string) {
    onClose();
    router.push(`/chapter/${slug}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0 : 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 200,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: shouldReduce ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: shouldReduce ? 0 : "100%" }}
            transition={{ duration: shouldReduce ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(280px, 85vw)",
              minWidth: "260px",
              maxWidth: "320px",
              background: "#1A1815",
              borderLeft: "1px solid #2A2724",
              zIndex: 201,
              display: "flex",
              flexDirection: "column",
              overflowY: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #2A2724",
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#C9A227",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                All Chapters
              </h2>
              <button
                onClick={onClose}
                aria-label="Close chapter list"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9B9488",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  lineHeight: 1,
                  padding: "0.25rem",
                  minWidth: "36px",
                  minHeight: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Chapter list */}
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: "0.5rem 0",
              }}
            >
              {regions.map((region) => {
                const done = isChapterDone(region, completedIds);
                const isCurrent = region.slug === currentSlug;
                const { percent } = getChapterProgress(region, completedIds);
                const hasProgress = !done && percent > 0;

                return (
                  <button
                    key={region.slug}
                    onClick={() => navigate(region.slug)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      width: "100%",
                      padding: "0.625rem 1.25rem",
                      background: "none",
                      border: "none",
                      borderLeft: isCurrent ? "3px solid #C9A227" : "3px solid transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      opacity: done ? 0.7 : 1,
                      minHeight: "44px",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                  >
                    {/* Coloured dot */}
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: region.theme.accent,
                        flexShrink: 0,
                        opacity: done ? 0.6 : 1,
                      }}
                    />

                    {/* Chapter number */}
                    <span
                      style={{
                        color: "#9B9488",
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-sans, sans-serif)",
                        flexShrink: 0,
                        minWidth: "20px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {String(region.order).padStart(2, "0")}
                    </span>

                    {/* Chapter name */}
                    <span
                      style={{
                        color: done ? "#9B9488" : isCurrent ? "#E8E2D4" : "#C8C2B4",
                        fontSize: "0.8rem",
                        lineHeight: 1.3,
                        flex: 1,
                        fontFamily: "var(--font-sans, sans-serif)",
                      }}
                    >
                      {region.name}
                    </span>

                    {/* Badge */}
                    {done && (
                      <span style={{ color: "#4A7A6A", fontSize: "0.85rem", fontFamily: "serif", flexShrink: 0 }}>
                        完
                      </span>
                    )}
                    {isCurrent && !done && (
                      <span
                        style={{
                          color: "#C9A227",
                          fontSize: "0.6rem",
                          letterSpacing: "0.1em",
                          fontWeight: 500,
                          flexShrink: 0,
                          border: "1px solid rgba(201,162,39,0.4)",
                          padding: "1px 5px",
                          borderRadius: "3px",
                        }}
                      >
                        NOW
                      </span>
                    )}
                    {!isCurrent && !done && hasProgress && (
                      <span style={{ color: "#9B9488", fontSize: "0.65rem", flexShrink: 0 }}>
                        {percent}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
