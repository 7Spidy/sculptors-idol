"use client";

import SealStamp from "@/components/ui/SealStamp";

export default function AllDoneScreen() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2rem",
        textAlign: "center",
        gap: "1.25rem",
      }}
    >
      <SealStamp size={48} color="#C9A227" playOnMount={true} />

      <h2
        style={{
          fontFamily: "var(--font-serif, serif)",
          fontSize: "clamp(20px, 5vw, 26px)",
          fontWeight: 500,
          color: "#E8E2D4",
          lineHeight: 1.3,
        }}
      >
        Dragon&#39;s Homecoming
      </h2>

      <p style={{ color: "#9B9488", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "300px" }}>
        You walked every path Sekiro walked, and kept every promise.
        <br />
        Ashina endures because of you, Pam.
      </p>
    </div>
  );
}
