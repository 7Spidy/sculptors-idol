import rawContent from "@/data/sekiro-content.json";

export type GuideUrl = {
  label: string;
  url: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  spoiler: boolean;
  isNavCue?: boolean;
  returnPath?: boolean;
};

export type Boss = {
  id: string;
  name: string;
  type: "miniboss" | "boss";
  spoiler: boolean;
  tip: string;
  guideUrls: GuideUrl[];
};

export type Theme = {
  accent: string;
  bg: string;
};

export type Region = {
  id: string;
  slug: string;
  name: string;
  order: number;
  spoilerRegion: boolean;
  blurb: string;
  theme: Theme;
  checklist: ChecklistItem[];
  bosses: Boss[];
};

export type GreetingEntry = {
  range: string;
  text: string;
};

export type SekiroContent = {
  $comment: string;
  meta: {
    siteName: string;
    tagline: string;
    subtitle: string;
    endingFocus: string;
  };
  greetings: {
    morning: GreetingEntry;
    afternoon: GreetingEntry;
    evening: GreetingEntry;
    night: GreetingEntry;
  };
  motivationalLines: string[];
  regions: Region[];
};

const content = rawContent as SekiroContent;
export default content;

export const regions: Region[] = content.regions;
export const regionBySlug: Record<string, Region> = Object.fromEntries(
  regions.map((r) => [r.slug, r])
);

export function isChapterDone(region: Region, completedIds: Set<string>): boolean {
  return region.checklist
    .filter((i) => !i.isNavCue)
    .every((i) => completedIds.has(i.id));
}

export function getChapterProgress(region: Region, completedIds: Set<string>): {
  completed: number;
  total: number;
  percent: number;
} {
  const items = region.checklist.filter((i) => !i.isNavCue);
  const completed = items.filter((i) => completedIds.has(i.id)).length;
  const total = items.length;
  return { completed, total, percent: total === 0 ? 100 : Math.round((completed / total) * 100) };
}

export function getCurrentChapter(completedIds: Set<string>): Region | null {
  return regions.find((r) => !isChapterDone(r, completedIds)) ?? null;
}

export function getLastCompletedChapter(completedIds: Set<string>): Region | null {
  const done = regions.filter((r) => isChapterDone(r, completedIds));
  return done.length > 0 ? done[done.length - 1] : null;
}
