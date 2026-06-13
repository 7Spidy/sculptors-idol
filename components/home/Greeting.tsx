"use client";

import { useMemo } from "react";
import { greetingFor, randomLine } from "@/lib/greeting";

export default function Greeting() {
  const greeting = greetingFor();
  // Pick motivational line once per mount, stable for session
  const line = useMemo(() => randomLine(), []);

  return (
    <div style={{ padding: "1.5rem 1.25rem 0.75rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-serif, serif)",
          fontSize: "clamp(18px, 4vw, 22px)",
          fontWeight: 400,
          color: "#E8E2D4",
          marginBottom: "0.375rem",
        }}
      >
        {greeting}
      </h2>
      <p
        style={{
          color: "#9B9488",
          fontSize: "0.8rem",
          fontStyle: "italic",
          lineHeight: 1.5,
        }}
      >
        &ldquo;{line}&rdquo;
      </p>
    </div>
  );
}
