"use client";

import Link from "next/link";
import { Region, getChapterProgress, regions } from "@/lib/content";
import SpoilerToggle from "./SpoilerToggle";

interface ChapterHeroProps {
  region: Region;
  completedIds: Set<string>;
  spoilersOn: boolean;
  onToggleSpoilers: () => void;
}

export default function ChapterHero({
  region,
  completedIds,
  spoilersOn,
  onToggleSpoilers,
}: ChapterHeroProps) {
  const { completed, total, percent } = getChapterProgress(region, completedIds);

  const prevRegion = regions.find((r) => r.order === region.order - 1);
  const nextRegion = regions.find((r) => r.order === region.order + 1);

  return (
    <div
      style={{
        backgroundImage: `url('/chapters/${region.slug}.webp'), ${region.theme.bg}`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center top, center",
        backgroundRepeat: "no-repeat, no-repeat",
        padding: "1.25rem",
        position: "relative",
      }}
    >
      {/* Vignette so text is always readable over any hero image */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(14,13,11,0.55) 0%, rgba(14,13,11,0.4) 50%, rgba(14,13,11,0.7) 100%)",
        pointerEvents: "none",
      }} />

      {/* All content sits above the vignette */}
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* Top row: Home button + Spoiler toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          gap: "0.5rem",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#9B9488",
            fontSize: "0.8rem",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.375rem 0.625rem",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
            background: "rgba(0,0,0,0.2)",
            minHeight: "36px",
            whiteSpace: "nowrap",
          }}
        >
          ← Home
        </Link>

        <SpoilerToggle on={spoilersOn} onToggle={onToggleSpoilers} />
      </div>

      {/* Eyebrow */}
      <div
        style={{
          color: region.theme.accent,
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "0.375rem",
          fontWeight: 500,
        }}
      >
        Chapter {String(region.order).padStart(2, "0")} of 19
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "var(--font-serif, serif)",
          fontSize: "clamp(18px, 4vw, 22px)",
          fontWeight: 500,
          color: "#E8E2D4",
          lineHeight: 1.3,
          marginBottom: "0.5rem",
        }}
      >
        {region.name}
      </h1>

      {/* Blurb */}
      <p
        style={{
          color: "#9B9488",
          fontSize: "11px",
          lineHeight: 1.6,
          marginBottom: "1rem",
          maxWidth: "560px",
        }}
      >
        {region.blurb}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.7rem",
            color: "#9B9488",
            marginBottom: "0.375rem",
          }}
        >
          <span>
            {completed}/{total} items
          </span>
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

      {/* Prev / Next nav */}
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
        {prevRegion ? (
          <Link
            href={`/chapter/${prevRegion.slug}`}
            style={{
              color: "#9B9488",
              fontSize: "0.75rem",
              textDecoration: "none",
              padding: "0.375rem 0.625rem",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.2)",
              minHeight: "36px",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span>‹</span>
            <span className="nav-label"> Ch.{String(prevRegion.order).padStart(2, "0")}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextRegion && (
          <Link
            href={`/chapter/${nextRegion.slug}`}
            style={{
              color: "#9B9488",
              fontSize: "0.75rem",
              textDecoration: "none",
              padding: "0.375rem 0.625rem",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.2)",
              minHeight: "36px",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span className="nav-label">Ch.{String(nextRegion.order).padStart(2, "0")} </span>
            <span>›</span>
          </Link>
        )}
      </div>
      </div>{/* end zIndex wrapper */}
    </div>
  );
}
