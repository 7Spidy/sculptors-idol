"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Region, regions, isChapterDone } from "@/lib/content";
import SiteNav from "@/components/nav/SiteNav";
import ChapterHero from "@/components/chapter/ChapterHero";
import Checklist from "@/components/chapter/Checklist";
import BossCard from "@/components/chapter/BossCard";
import SealStamp from "@/components/ui/SealStamp";

interface ChapterClientProps {
  region: Region;
}

export default function ChapterClient({ region }: ChapterClientProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [spoilersOn, setSpoilersOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);
  const wasCompleteRef = useRef(false);

  const slug = region.slug;

  // Load spoiler preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`sculptor:spoilers:${slug}`);
      if (stored === "true") setSpoilersOn(true);
    } catch {}
  }, [slug]);

  // Load progress from API
  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data: { completedItemIds: string[] }) => {
        const ids = new Set<string>(data.completedItemIds ?? []);
        setCompletedIds(ids);
        wasCompleteRef.current = isChapterDone(region, ids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, region]);

  const handleToggleSpoilers = useCallback(() => {
    setSpoilersOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`sculptor:spoilers:${slug}`, String(next));
      } catch {}
      return next;
    });
  }, [slug]);

  const handleToggleItem = useCallback(async (id: string, checked: boolean) => {
    // Optimistic update
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, checked }),
      });
      const data = await res.json();
      const updated = new Set<string>(data.completedItemIds ?? []);
      setCompletedIds(updated);

      // Fire stamp animation only once on first completion
      if (!wasCompleteRef.current && isChapterDone(region, updated)) {
        wasCompleteRef.current = true;
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 2000);
      }
    } catch {
      // Revert on failure
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (checked) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  }, [region]);

  const currentSlug = regions.find((r) => !isChapterDone(r, completedIds))?.slug ?? slug;
  const chapterDone = isChapterDone(region, completedIds);

  const allBossesSpoiler = region.bosses.length > 0 && region.bosses.every((b) => b.spoiler);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#9B9488", fontSize: "0.85rem" }}>Loading…</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0E0D0B" }}>
      <SiteNav completedIds={completedIds} currentSlug={currentSlug} />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Chapter completion banner */}
        {chapterDone && (
          <div
            style={{
              background: "rgba(74,122,106,0.08)",
              borderBottom: "1px solid rgba(74,122,106,0.2)",
              padding: "0.625rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <SealStamp size={22} color="#4A7A6A" playOnMount={justCompleted} />
            <span style={{ color: "#4A7A6A", fontSize: "0.8rem" }}>
              Chapter complete
            </span>
          </div>
        )}

        <ChapterHero
          region={region}
          completedIds={completedIds}
          spoilersOn={spoilersOn}
          onToggleSpoilers={handleToggleSpoilers}
        />

        {/* Body — 2-column desktop, stacked mobile */}
        <div
          className="chapter-body"
          style={{
            padding: "1.25rem",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Checklist column */}
          <div>
            <Checklist
              region={region}
              completedIds={completedIds}
              spoilersOn={spoilersOn}
              onToggle={handleToggleItem}
            />
          </div>

          {/* Boss column */}
          {region.bosses.length > 0 && (
            <div>
              <h3
                style={{
                  color: "#9B9488",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                  fontFamily: "var(--font-sans, sans-serif)",
                }}
              >
                Bosses
              </h3>

              {allBossesSpoiler && !spoilersOn ? (
                <p style={{ color: "#9B9488", fontSize: "0.8rem", fontStyle: "italic" }}>
                  Spoiler bosses in this chapter — toggle above to reveal.
                </p>
              ) : (
                region.bosses.map((boss) => (
                  <BossCard key={boss.id} boss={boss} spoilersOn={spoilersOn} />
                ))
              )}
            </div>
          )}
        </div>
      </motion.main>

      <style>{`
        @media (min-width: 640px) {
          .chapter-body {
            grid-template-columns: 1fr 210px !important;
          }
        }
        @media (max-width: 479px) {
          .spoiler-label { display: none; }
          .nav-label { display: none; }
        }
      `}</style>
    </div>
  );
}
