"use client";

import Link from "next/link";
import { Region } from "@/lib/content";

interface LastCompletedCardProps {
  region: Region;
}

export default function LastCompletedCard({ region }: LastCompletedCardProps) {
  return (
    <div style={{ padding: "0 1.25rem 1.5rem" }}>
      <Link href={`/chapter/${region.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          style={{
            background: "rgba(74,122,106,0.07)",
            border: "1px solid rgba(74,122,106,0.25)",
            borderRadius: "6px",
            padding: "0.875rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            cursor: "pointer",
            minHeight: "56px",
          }}
        >
          <span
            style={{
              color: "#4A7A6A",
              fontSize: "1.5rem",
              fontFamily: "serif",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            完
          </span>
          <div>
            <div
              style={{
                color: "#9B9488",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.125rem",
              }}
            >
              Last Completed · Ch.{String(region.order).padStart(2, "0")}
            </div>
            <div
              style={{
                color: "#C8C2B4",
                fontSize: "0.85rem",
                fontFamily: "var(--font-serif, serif)",
              }}
            >
              {region.name}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
