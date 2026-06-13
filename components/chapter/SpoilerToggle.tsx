"use client";

interface SpoilerToggleProps {
  on: boolean;
  onToggle: () => void;
}

export default function SpoilerToggle({ on, onToggle }: SpoilerToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={on ? "Hide spoilers" : "Show spoilers"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        background: on ? "rgba(201,162,39,0.12)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${on ? "rgba(201,162,39,0.35)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "4px",
        color: on ? "#C9A227" : "#9B9488",
        cursor: "pointer",
        fontSize: "0.75rem",
        padding: "0.375rem 0.625rem",
        minHeight: "36px",
        minWidth: "36px",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: "0.9rem", lineHeight: 1 }}>{on ? "🙈" : "👁"}</span>
      <span className="spoiler-label">{on ? "Hide" : "Spoilers"}</span>
    </button>
  );
}
