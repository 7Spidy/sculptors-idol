"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/nav/SiteNav";
import KnowledgeTabs from "@/components/knowledge/KnowledgeTabs";
import GourdSeedCard from "@/components/knowledge/GourdSeedCard";
import SkillTreeSection from "@/components/knowledge/SkillTreeSection";
import { gourdSeeds, skillTrees } from "@/lib/knowledge";

type Tab = "seeds" | "skills";

export default function KnowledgePage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("seeds");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data: { completedItemIds: string[] }) => {
        setCompletedIds(new Set(data.completedItemIds ?? []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = useCallback(async (id: string, checked: boolean) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, checked }),
      });
    } catch {
      // Revert on failure
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }
  }, []);

  const foundCount = gourdSeeds.filter((s) => completedIds.has(s.id)).length;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#9B9488", fontSize: "0.85rem" }}>Loading…</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0E0D0B" }}>
      <SiteNav completedIds={completedIds} currentSlug="" />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ maxWidth: "640px", margin: "0 auto" }}
      >
        {/* Page header */}
        <div
          style={{
            padding: "1.25rem 1.25rem 0.75rem",
            borderBottom: "1px solid #2A2724",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                color: "#9B9488",
                cursor: "pointer",
                fontSize: "0.75rem",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "var(--font-sans, sans-serif)",
              }}
            >
              ← Home
            </button>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "1.25rem",
              fontWeight: 500,
              color: "#E8E2D4",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Knowledge
          </h1>
          <p
            style={{
              color: "#9B9488",
              fontSize: "0.75rem",
              margin: "0.25rem 0 0",
              fontFamily: "var(--font-sans, sans-serif)",
              lineHeight: 1.5,
            }}
          >
            Reference — always visible, no spoiler gates.
          </p>
        </div>

        <KnowledgeTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "seeds" && (
          <div>
            {/* Seeds summary */}
            <div
              style={{
                padding: "0.625rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#9B9488",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-sans, sans-serif)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Healing Gourd Seeds
              </span>
              <span
                style={{
                  color: foundCount === gourdSeeds.length ? "#4A7A6A" : "#9B9488",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-sans, sans-serif)",
                }}
              >
                {foundCount} / {gourdSeeds.length} found
              </span>
            </div>

            {gourdSeeds.map((seed, i) => (
              <GourdSeedCard
                key={seed.id}
                seed={seed}
                checked={completedIds.has(seed.id)}
                onToggle={handleToggle}
                index={i}
              />
            ))}
          </div>
        )}

        {activeTab === "skills" && (
          <div style={{ paddingTop: "0.5rem" }}>
            {skillTrees.map((tree, i) => (
              <SkillTreeSection key={tree.id} tree={tree} treeIndex={i} />
            ))}
          </div>
        )}
      </motion.main>
    </div>
  );
}
