"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChecklistItem } from "@/lib/content";
import { useSessionMode } from "@/lib/SessionContext";

interface NavCueRowProps {
  item: ChecklistItem;
  ticked: boolean;
  onTick: (id: string, checked: boolean) => void;
  index: number;
}

export default function NavCueRow({ item, ticked, onTick, index }: NavCueRowProps) {
  const shouldReduce = useReducedMotion();
  const isReadonly = useSessionMode() === "readonly";

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.2, delay: index * 0.04 }}
      style={{
        background: "rgba(212,134,10,0.09)",
        border: "1px solid rgba(212,134,10,0.38)",
        borderRadius: "6px",
        padding: "8px 11px",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.625rem",
        margin: "0.5rem 0",
        minHeight: "44px",
      }}
    >
      {/* Warning icon */}
      <span
        style={{
          color: "#D4860A",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          flexShrink: 0,
          marginTop: "1px",
        }}
      >
        ⚠
      </span>

      {/* Text */}
      <p
        style={{
          color: "#D4860A",
          fontSize: "0.8rem",
          fontStyle: "italic",
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {item.text}
      </p>

      {/* Tick checkbox */}
      <button
        onClick={() => { if (!isReadonly) onTick(item.id, !ticked); }}
        aria-label={ticked ? "Mark undone" : "Mark done"}
        disabled={isReadonly}
        style={{
          flexShrink: 0,
          width: "18px",
          height: "18px",
          marginTop: "3px",
          border: `1.5px solid ${ticked ? "#D4860A" : "rgba(212,134,10,0.4)"}`,
          borderRadius: "3px",
          background: ticked ? "rgba(212,134,10,0.2)" : "transparent",
          cursor: isReadonly ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "all 0.15s",
          minWidth: "18px",
          minHeight: "18px",
          opacity: isReadonly ? 0.5 : 1,
        }}
      >
        {ticked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#D4860A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
