"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SiteNav from "@/components/nav/SiteNav";
import Greeting from "@/components/home/Greeting";
import CurrentChapterCard from "@/components/home/CurrentChapterCard";
import LastCompletedCard from "@/components/home/LastCompletedCard";
import AllDoneScreen from "@/components/home/AllDoneScreen";
import { getCurrentChapter, getLastCompletedChapter, regions } from "@/lib/content";

export default function HomePage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data: { completedItemIds: string[] }) => {
        setCompletedIds(new Set(data.completedItemIds ?? []));
      })
      .catch(() => {
        // Fallback to empty on error
      })
      .finally(() => setLoading(false));
  }, []);

  const allDone = regions.every((r) => {
    const items = r.checklist.filter((i) => !i.isNavCue);
    return items.every((i) => completedIds.has(i.id));
  });

  const currentChapter = getCurrentChapter(completedIds);
  const lastCompleted = getLastCompletedChapter(completedIds);
  const currentSlug = currentChapter?.slug ?? "";

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
        style={{ maxWidth: "480px", margin: "0 auto" }}
      >
        <Greeting />

        {allDone ? (
          <AllDoneScreen />
        ) : (
          <>
            {currentChapter && (
              <CurrentChapterCard
                region={currentChapter}
                completedIds={completedIds}
              />
            )}

            {lastCompleted && (
              <LastCompletedCard region={lastCompleted} />
            )}
          </>
        )}
      </motion.main>
    </div>
  );
}
