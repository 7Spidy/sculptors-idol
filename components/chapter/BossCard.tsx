"use client";

import { Boss } from "@/lib/content";

interface BossCardProps {
  boss: Boss;
  spoilersOn: boolean;
}

export default function BossCard({ boss, spoilersOn }: BossCardProps) {
  const hidden = boss.spoiler && !spoilersOn;

  const badgeColor = boss.type === "boss" ? "#B23A2E" : "#C9A227";
  const badgeBg = boss.type === "boss" ? "rgba(178,58,46,0.12)" : "rgba(201,162,39,0.1)";
  const badgeLabel = boss.type === "boss" ? "BOSS" : "MINI-BOSS";

  return (
    <div
      style={{
        background: "#1A1815",
        border: "1px solid #2A2724",
        borderRadius: "6px",
        padding: "0.875rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginBottom: "0.625rem",
      }}
    >
      {/* Header: name + type badge */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", justifyContent: "space-between" }}>
        <h4
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: hidden ? "#9B9488" : "#E8E2D4",
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {hidden ? "???" : boss.name}
        </h4>
        <span
          style={{
            color: badgeColor,
            background: badgeBg,
            border: `1px solid ${badgeColor}44`,
            borderRadius: "3px",
            fontSize: "0.6rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            padding: "2px 6px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            alignSelf: "flex-start",
          }}
        >
          {badgeLabel}
        </span>
      </div>

      {hidden ? (
        <p style={{ color: "#9B9488", fontSize: "0.75rem", fontStyle: "italic" }}>
          Toggle spoilers to reveal.
        </p>
      ) : (
        <>
          {/* Tip */}
          {boss.tip && (
            <p
              style={{
                color: "#9B9488",
                fontSize: "9.5px",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              {boss.tip}
            </p>
          )}

          {/* Guide links */}
          {boss.guideUrls.length > 0 && (
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginTop: "0.125rem" }}>
              {boss.guideUrls.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "3px",
                    color: "#9B9488",
                    fontSize: "0.7rem",
                    padding: "3px 8px",
                    textDecoration: "none",
                    minHeight: "28px",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.color = "#C9A227";
                    el.style.borderColor = "rgba(201,162,39,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.color = "#9B9488";
                    el.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <span>▶</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
