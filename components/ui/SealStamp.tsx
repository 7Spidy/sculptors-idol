"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

interface SealStampProps {
  size?: number;
  color?: string;
  onComplete?: () => void;
  playOnMount?: boolean;
}

export default function SealStamp({
  size = 48,
  color = "#4A7A6A",
  playOnMount = false,
}: SealStampProps) {
  const shouldReduce = useReducedMotion();
  const hasPlayed = useRef(false);
  const [visible, setVisible] = useState(playOnMount);

  if (playOnMount && !hasPlayed.current) {
    hasPlayed.current = true;
  }

  if (!visible && !playOnMount) {
    return (
      <span
        onClick={() => setVisible(true)}
        style={{ cursor: "pointer", color, fontSize: size, fontFamily: "serif", lineHeight: 1 }}
      >
        完
      </span>
    );
  }

  return (
    <motion.span
      initial={shouldReduce ? {} : { scale: 1.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }}
      style={{ color, fontSize: size, fontFamily: "serif", lineHeight: 1, display: "inline-block" }}
    >
      完
    </motion.span>
  );
}
