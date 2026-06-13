# Claude Code Prompt — Sculptor's Idol

Paste this entire prompt into Claude Code from your repo root.
Make sure `HANDOFF_SPEC.md` and `data/sekiro-content.json` are already in the repo before pasting.

---

## Prompt to paste:

```
Build "Sculptor's Idol" — a Sekiro companion web app — exactly per the spec in HANDOFF_SPEC.md
and all game content in data/sekiro-content.json. Read BOTH files fully before writing a single
line of code. Every decision is already made; your job is faithful execution.

━━━ STACK ━━━
Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Framer Motion, iron-session, bcryptjs,
@upstash/redis, Vercel deployment. Google Fonts: Noto Serif JP (weights 400, 500) + Inter
(weights 300, 400, 500). Noto Serif JP is Sekiro's confirmed in-game UI font — use it for all
headings, chapter names, boss names, the logo, and the 完 seal.

━━━ AUTH ━━━
Single shared password. No email, no magic link, no Supabase.
- /login: one password <input>, submit POSTs to /api/auth/login
- /api/auth/login: bcryptjs.compareSync(body.password, process.env.SITE_PASSWORD_HASH). On match,
  write an iron-session cookie using SESSION_SECRET. On fail, return 401.
- /api/auth/logout: POST → destroys session cookie.
- Middleware: every route except /login and /api/auth/* redirects to /login if no valid session.

━━━ PERSISTENCE ━━━
Upstash Redis via @upstash/redis. Single key "sculptor:progress", value is JSON string:
  { completedItemIds: string[] }
- GET /api/progress → fetch key, return array (empty array if key missing — never 404)
- POST /api/progress → body { id: string, checked: boolean } → add or splice id from array → upsert
- Chapter completion is DERIVED client-side. NEVER store "chapter X is complete" in Redis.
- isNavCue items (isNavCue:true) ARE stored in completedItemIds when ticked, but must be
  EXCLUDED from the completion calculation. Only non-nav-cue items count toward completion.

━━━ DATA CONTRACT ━━━
All content from data/sekiro-content.json. Never hardcode region names, checklist text, boss names,
YouTube URLs, colours, or motivational lines in component files. Import and type the JSON in
lib/content.ts. The JSON is the single source of truth.

Key JSON fields to understand before building:
- region.theme.accent   → hex colour for progress bar, eyebrow text, drawer dot, card border
- region.theme.bg       → CSS gradient string for chapter card and hero background
- item.isNavCue         → true = amber ⚠ warning banner, not a standard checkbox, excluded from
                           completion math
- item.returnPath       → true = show gold RETURN badge before the item text
- item.spoiler          → true = blur text until per-chapter spoiler toggle is on
- region.spoilerRegion  → true = entire chapter is late-game; respect in UI labels if needed
- boss.spoiler          → true = hide name/tip/links behind spoiler toggle

━━━ THE IDOL — HOME SCREEN ━━━
The home screen shows ONE current chapter, not all 19.

Layout (top to bottom):
  1. SiteNav: logo (Noto Serif JP, gold) | progress ring (SVG animated) | ☰ drawer trigger
  2. Greeting: time-based (IST) "Good [morning/afternoon/evening/night], Pam." in Noto Serif JP
     + one random motivational line from content.motivationalLines (pick once on mount, stable
     for the session)
  3. CurrentChapterCard: large card using chapter.theme.bg as gradient background,
     chapter.theme.accent for border/button/bar colours. Shows chapter number, name (Noto Serif JP
     20px), blurb, progress bar, and "Begin →" or "Continue →" button. Entire card is tappable.
  4. LastCompletedCard (conditional): small jade-coloured card below, showing the 完 seal and
     the name of the most recently completed chapter. Only shown if at least one chapter is done.
     Tapping it opens that chapter's page.
  5. AllDoneScreen (when all 19 chapters complete): replace cards with a centred 完 seal (48px,
     gold), a Noto Serif JP heading "Dragon's Homecoming", and a two-line congratulations for Pam.

Current chapter = first chapter in order where isChapterDone() returns false.
isChapterDone(region, completedIds) = region.checklist.filter(i => !i.isNavCue).every(i =>
  completedIds.includes(i.id))

━━━ CHAPTER DRAWER ━━━
The ☰ icon in the nav opens a slide-out drawer from the right.
- Drawer width: 280px desktop, 85vw mobile (min 260px, max 320px)
- Slides in with transform: translateX(100%) → 0, 220ms cubic-bezier(.4,0,.2,1)
- Semi-transparent dark overlay covers the rest of the screen; tapping it closes the drawer
- Header: "ALL CHAPTERS" title (Noto Serif JP, gold) + ✕ close button
- Each row: coloured dot (chapter.theme.accent) | "01" number | chapter name | badge
  - Done chapters: 完 badge (jade), 70% opacity row
  - Current chapter: gold left border, gold "NOW" badge, full opacity
  - Future chapters with partial progress: show "XX%" in muted text
  - Future chapters with no progress: no badge
- Tapping a row navigates to that chapter AND closes the drawer
- Rows are min-height 44px for mobile tap targets
- The chapter list is internally scrollable (all 19 chapters must be reachable by scroll)

━━━ CHAPTER PAGE ━━━
Route: /chapter/[slug] — generateStaticParams from Object.keys of regions in JSON.

Layout:
  Hero area (atmospheric gradient from theme.bg):
    - Chapter eyebrow: "CHAPTER XX OF 19" in theme.accent colour
    - Chapter title in Noto Serif JP 22px
    - Blurb in muted Inter 11px
    - Progress bar (theme.accent fill)
    - Top-right: [← Home] button + [👁 Spoilers / 🙈 Hide] toggle
    - Bottom-right: [‹ Ch.N] and [Ch.N ›] prev/next buttons

  Body (desktop: 2 columns; mobile: stacked, checklist first):
    Left/top: Checklist
    Right/bottom: Boss cards

Checklist item rendering by type:
  1. Regular item (no flags): checkbox row. Checked state: jade checkmark, strikethrough.
     If item.spoiler && spoilersOff: blur text with CSS filter:blur(4px). Tapping blurred item
     reveals just that item (local state toggle), does NOT enable global spoilers.
  2. isNavCue: amber banner. background rgba(212,134,10,0.09), border 1px solid rgba(212,134,10,0.38),
     border-radius 6px, padding 8px 11px, flex row with ⚠ icon + italic amber text + its own
     small checkbox on the right. EXCLUDED from completion math. Never blurred (routing info).
  3. returnPath: same as regular but prepend a small gold "RETURN" badge (pill, 7.5px).

Boss card:
  - Header: name (Noto Serif JP) | type badge (BOSS = vermilion, MINI-BOSS = gold)
  - Tip: italic muted 9.5px
  - Links: two small pill links "▶ Label" opening YouTube in new tab
  - If boss.spoiler && spoilersOff: hide name (show "??? — Boss"), hide tip, hide links.
    Show "Toggle spoilers to reveal." in muted italic.
  - Boss cards with spoiler:true AND no non-spoiler bosses → show a placeholder message
    "Spoiler bosses in this chapter — toggle above to reveal."

Spoiler toggle:
  - State: localStorage key `sculptor:spoilers:${slug}` (boolean) — per-chapter, persists locally
  - Default: false (spoilers hidden)
  - Button: eye icon + "Spoilers" text on desktop, icon only on mobile < 480px
  - When toggled on: clear all blur immediately (CSS class on parent removes filter)

━━━ FRAMER MOTION ━━━
All wrapped in AnimatePresence. Page transitions: opacity 0→1 + y 8→0, duration 0.2s.
Drawer: custom translateX transition (see above).
ChecklistRow checked state: ink-brush SVG path (draw animation, 150ms).
완 seal stamp: scale 1.8→1 + opacity 0→1, 350ms ease-out. Only plays once (on first completion,
  not on every re-render). Use a ref to track whether it has played.
Scroll reveals on chapter page: whileInView with stagger 0.04s per row, y 6→0 + opacity.
ALL motions: check useReducedMotion() — if true, set duration to 0 and remove y offset.

━━━ MOBILE RESPONSIVE ━━━
Every screen must work at 375px width (iPhone SE). Key rules:
- Chapter page body: grid-template-columns: 1fr on mobile (stacked), 1fr 210px on desktop (≥640px)
- Boss column on mobile: max-height none, shows fully below checklist
- Drawer: 85vw, never 100vw (home card peeks on the left as visual affordance)
- All tap targets: min 44×44px (checklist rows, boss cards, drawer rows, nav buttons)
- Nav: logo truncates on narrow screens; keep ring + drawer icon always visible
- Prev/Next buttons on chapter page: text labels on ≥480px, arrows only on <480px
- Font sizes: never below 11px. Scale headings down 2px on mobile.
- The site must be fully operable one-handed on mobile

━━━ BUILD ORDER ━━━
Build and commit in phases. Use "feat: " prefix for each commit.

Phase 1 — Scaffold
  Create Next.js 15 project. Install all deps. Set up Tailwind v4. Load + type sekiro-content.json
  in lib/content.ts. Set CSS variables for design tokens. Google Fonts via next/font. Paper-grain
  overlay in layout.tsx. Show me the blank dark page before proceeding.

Phase 2 — Auth
  iron-session config. Login page (/login). API routes. Middleware. Show me the login screen.

Phase 3 — The Idol home screen
  SiteNav (logo + ring + ☰ button). Greeting + motivational line. CurrentChapterCard.
  LastCompletedCard. AllDoneScreen. Wire with mocked useState progress. Show me the home screen.

Phase 4 — Chapter drawer
  ChapterDrawer component, overlay, all 19 rows, slide animation, close on overlay tap.
  Show me the drawer open on the home screen.

Phase 5 — Chapter pages
  /chapter/[slug]. ChapterHero with theme colours. Checklist with all three item types.
  BossCard with spoiler gate. SpoilerToggle (localStorage). Prev/Next nav. ← Home button.
  Show me a chapter page (use Ashina Castle Pt.2 — it has all three item types).

Phase 6 — Upstash
  lib/redis.ts. lib/progress.ts. GET and POST API routes. Wire home + chapter pages to real
  Redis instead of mocked state. Checkbox toggle → POST /api/progress → re-derive completion.

Phase 7 — Motion + polish
  Page transitions, drawer animation, ink-brush checkbox, 完 seal stamp, scroll stagger.
  Verify prefers-reduced-motion degrades gracefully.

Phase 8 — Mobile pass
  At each breakpoint (375, 480, 640, 1024px): verify layout, tap targets, drawer width, stacking.
  Fix any overflow, font size, or spacing issues.

Phase 9 — Final
  Build passes TypeScript strict. No console errors. Lighthouse mobile score ≥ 85.
  Push to GitHub. Vercel deploy. Document any env var that's missing.
```

---

## After pasting the prompt

1. Claude Code will ask you to confirm the phase before starting. Say "proceed" or "yes, go ahead."
2. After Phase 3 (home screen), review it before saying "continue to Phase 4."
3. After Phase 6 (Upstash), test on two devices before saying "continue."
4. If Claude Code gets confused about any data shape, point it to `data/sekiro-content.json` directly.
