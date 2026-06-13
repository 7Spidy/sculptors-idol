"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Region, getChapterProgress } from "@/lib/content";

interface CurrentChapterCardProps {
  region: Region;
  completedIds: Set<string>;
}

export default function CurrentChapterCard({ region, completedIds }: CurrentChapterCardProps) {
  const shouldReduce = useReducedMotion();
  const { completed, total, percent } = getChapterProgress(region, completedIds);
  const hasProgress = percent > 0;

  return (
    <motion.div
      whileHover={shouldReduce ? {} : { y: -3 }}
      transition={{ duration: 0.15 }}
      style={{ padding: "0 1.25rem 1rem" }}
    >
      <Link href={`/chapter/${region.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            background: region.theme.bg,
            border: `1px solid ${region.theme.accent}44`,
            borderRadius: "8px",
            padding: "1.5rem",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                color: region.theme.accent,
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Chapter {String(region.order).padStart(2, "0")} of 19
            </span>
            <span
              style={{
                color: region.theme.accent,
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              {hasProgress ? "Continue" : "Begin"}
            </span>
          </div>

          {/* Chapter name */}
          <h2
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(18px, 4vw, 20px)",
              fontWeight: 500,
              color: "#E8E2D4",
              lineHeight: 1.3,
            }}
          >
            {region.name}
          </h2>

          {/* Blurb */}
          <p
            style={{
              color: "#9B9488",
              fontSize: "11px",
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {region.blurb}
          </p>

          {/* Progress */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.375rem",
                fontSize: "0.7rem",
                color: "#9B9488",
              }}
            >
              <span>{completed}/{total} items</span>
              <span style={{ color: region.theme.accent }}>{percent}%</span>
            </div>
            <div
              style={{
                height: "3px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                className="progress-bar"
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  background: region.theme.accent,
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>

          {/* Button */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              color: region.theme.accent,
              fontSize: "0.8rem",
              fontWeight: 500,
              padding: "0.5rem 1rem",
              border: `1px solid ${region.theme.accent}55`,
              borderRadius: "4px",
              background: `${region.theme.accent}11`,
              alignSelf: "flex-start",
              minHeight: "44px",
            }}
          >
            {hasProgress ? "Continue →" : "Begin →"}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
