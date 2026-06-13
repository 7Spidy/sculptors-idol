"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChecklistItem } from "@/lib/content";
import ReturnBadge from "@/components/ui/ReturnBadge";

interface ChecklistRowProps {
  item: ChecklistItem;
  checked: boolean;
  spoilersOn: boolean;
  onToggle: (id: string, checked: boolean) => void;
  index: number;
}

export default function ChecklistRow({ item, checked, spoilersOn, onToggle, index }: ChecklistRowProps) {
  const [revealed, setRevealed] = useState(false);
  const shouldReduce = useReducedMotion();

  const isBlurred = item.spoiler && !spoilersOn && !revealed;

  function handleTextClick() {
    if (isBlurred) {
      setRevealed(true);
      return;
    }
  }

  function handleCheckboxClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isBlurred) {
      setRevealed(true);
      return;
    }
    onToggle(item.id, !checked);
  }

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.2, delay: index * 0.04 }}
      onClick={handleTextClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.625rem",
        padding: "0.625rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: isBlurred ? "pointer" : "default",
        minHeight: "44px",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleCheckboxClick}
        aria-label={checked ? "Mark incomplete" : "Mark complete"}
        style={{
          flexShrink: 0,
          width: "18px",
          height: "18px",
          marginTop: "2px",
          border: `1.5px solid ${checked ? "#4A7A6A" : "#2A2724"}`,
          borderRadius: "3px",
          background: checked ? "rgba(74,122,106,0.15)" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          padding: 0,
          minWidth: "18px",
          minHeight: "18px",
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

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: "0px" }}>
        {item.returnPath && <ReturnBadge />}
        <span
          style={{
            color: checked ? "#9B9488" : "#C8C2B4",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            textDecoration: checked ? "line-through" : "none",
            filter: isBlurred ? "blur(4px)" : "none",
            transition: "filter 0.2s",
            userSelect: isBlurred ? "none" : "auto",
            cursor: isBlurred ? "pointer" : "default",
            flex: 1,
          }}
          title={isBlurred ? "Tap to reveal" : undefined}
        >
          {item.text}
        </span>
        {isBlurred && (
          <span style={{ color: "#9B9488", fontSize: "0.7rem", marginLeft: "0.5rem", alignSelf: "center", flexShrink: 0 }}>
            tap to reveal
          </span>
        )}
      </div>
    </motion.div>
  );
}
