"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GourdSeed } from "@/lib/knowledge";
import { useSessionMode } from "@/lib/SessionContext";

interface GourdSeedCardProps {
  seed: GourdSeed;
  checked: boolean;
  onToggle: (id: string, checked: boolean) => void;
  index: number;
}

export default function GourdSeedCard({ seed, checked, onToggle, index }: GourdSeedCardProps) {
  const shouldReduce = useReducedMotion();
  const mode = useSessionMode();
  const isReadonly = mode === "readonly";

  function handleCheckboxClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isReadonly) return;
    onToggle(seed.id, !checked);
  }

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.2, delay: index * 0.04 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        padding: "0.875rem 1.25rem",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        opacity: isReadonly ? 1 : 1,
      }}
    >
      {/* Order number */}
      <span
        style={{
          color: "#9B9488",
          fontSize: "0.7rem",
          fontFamily: "var(--font-sans, sans-serif)",
          flexShrink: 0,
          minWidth: "20px",
          lineHeight: "1.6",
          paddingTop: "2px",
          letterSpacing: "0.05em",
        }}
      >
        {String(seed.order).padStart(2, "0")}
      </span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: checked ? "#9B9488" : "#E8E2D4",
            fontSize: "0.85rem",
            fontWeight: 500,
            fontFamily: "var(--font-sans, sans-serif)",
            lineHeight: 1.4,
            textDecoration: checked ? "line-through" : "none",
            marginBottom: "0.3rem",
          }}
        >
          {seed.location}
        </div>
        <div
          style={{
            color: checked ? "#6B6560" : "#9B9488",
            fontSize: "0.78rem",
            lineHeight: 1.6,
            fontStyle: "italic",
            fontFamily: "var(--font-sans, sans-serif)",
          }}
        >
          {seed.tip}
        </div>
      </div>

      {/* Found checkbox */}
      <div style={{ flexShrink: 0, paddingTop: "2px" }}>
        <button
          onClick={handleCheckboxClick}
          aria-label={checked ? "Mark seed as not found" : "Mark seed as found"}
          disabled={isReadonly}
          title={isReadonly ? "Read-only mode" : undefined}
          style={{
            width: "18px",
            height: "18px",
            border: `1.5px solid ${checked ? "#4A7A6A" : "#2A2724"}`,
            borderRadius: "3px",
            background: checked ? "rgba(74,122,106,0.15)" : "transparent",
            cursor: isReadonly ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            padding: 0,
            minWidth: "18px",
            minHeight: "18px",
            opacity: isReadonly ? 0.5 : 1,
          }}
        >
          {checked && (
            <motion.svg
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M1 4.5L4 7.5L10 1"
                stroke="#4A7A6A"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={shouldReduce ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
              />
            </motion.svg>
          )}
        </button>
      </div>
    </motion.div>
  );
}
