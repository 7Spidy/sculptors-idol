# Sculptor's Idol — Final Build Spec

> **Rest. Remember. Resurrect.**
> A spoiler-aware Sekiro companion site for Pam, built around the Return / Dragon's Homecoming ending.
> 19 chapters, The Idol home screen, password auth, Upstash Redis, fully mobile responsive.

---

## 1. Name & tagline

**Sculptor's Idol** — tagline: *Rest. Remember. Resurrect.*

The Sculptor's Idol is Sekiro's rest/save/resurrect checkpoint — exactly what this site is for Pam.

---

## 2. What it does

1. **Time-based greeting** for Pam (IST) + a random Sekiro-spirit motivational line on each load.
2. **The Idol home screen** — one focused "Continue" card for the current active chapter, plus a small "Last Completed" card below it. All 19 chapters stay hidden unless Pam opens the chapter map.
3. **Slide-out chapter drawer** — triggered by a ☰ icon in the nav. Shows all 19 chapters as a compact dot-list (coloured dot → chapter number → name → NOW / 完 / % badge). A semi-transparent overlay closes it on outside tap. Fully scrollable, no chapter limit.
4. **19 chapter pages** at `/chapter/[slug]` — each gets its own atmospheric colour theme. Checklist, boss cards, spoiler toggle, prev/next navigation.
5. **Three checklist item types** (see §8). Regular items, amber nav-cue banners (route warnings), and gold RETURN PATH items.
6. **Boss cards** — two verified YouTube guide links each. Spoiler bosses hidden behind the toggle.
7. **Spoiler system** — hidden by default. Per-chapter "Show Spoilers" toggle. Per-item reveal on tap. Whole spoiler-zone chapters veiled in the drawer until the user starts them.
8. **Cross-device progress** via Upstash Redis. One key per site, JSON payload.
9. **Password-only auth** — one shared password, `iron-session` signed cookie. No email, no magic link.
10. **No audio anywhere.**
11. **Fully mobile responsive** — works on phone while Pam plays on PC.

---

## 3. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 — App Router, TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Auth | `iron-session` + `bcryptjs` — one shared password via env var |
| Persistence | Upstash Redis — REST API via `@upstash/redis` |
| Content | `data/sekiro-content.json` — maintained in Git, never in code |
| Fonts | Noto Serif JP (Sekiro's confirmed in-game UI font) + Inter |
| Hosting | Vercel |
| Source | GitHub |

---

## 4. Auth — password only

One shared password. Pam and Avi use the same one. No accounts, no email.

```
/login         — password field only. POST to /api/auth/login.
/api/auth/login   — bcryptjs.compareSync(input, SITE_PASSWORD_HASH). On match: iron-session cookie.
/api/auth/logout  — destroys session cookie.
```

All routes except `/login` redirect to `/login` if no session.

**Env vars:**
```
SITE_PASSWORD_HASH   # bcrypt hash of chosen password (generated in manual setup step 2)
SESSION_SECRET       # 32+ random chars (openssl rand -base64 32)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

---

## 5. Data model

### 5.1 Content — `data/sekiro-content.json` (in Git)

All game content lives here. Edit the JSON to change anything — no code changes needed.

```ts
type GuideUrl     = { label: string; url: string }
type ChecklistItem = {
  id: string; text: string; spoiler: boolean;
  isNavCue?: boolean;   // amber warning banner, not a standard checkbox
  returnPath?: boolean; // gold RETURN badge
}
type Boss = {
  id: string; name: string; type: 'miniboss' | 'boss';
  spoiler: boolean; tip: string; guideUrls: GuideUrl[]
}
type Region = {
  id: string; slug: string; name: string; order: number;
  spoilerRegion: boolean; blurb: string;
  checklist: ChecklistItem[]; bosses: Boss[]
}
```

### 5.2 Progress — Upstash Redis

Single key-value pair:
```
Key:   "sculptor:progress"
Value: JSON → { completedItemIds: string[] }
```

API routes:
- `GET  /api/progress` — fetch array (return `[]` if key missing)
- `POST /api/progress` — body `{ id: string, checked: boolean }` — add/remove id, upsert

**Completion is derived, never stored:**
```ts
const isChapterDone = (chapter: Region, completed: Set<string>) =>
  chapter.checklist
    .filter(i => !i.isNavCue)   // nav cues are navigation hints, not completion gates
    .every(i => completed.has(i.id))
```

> **Note:** `isNavCue` items ARE stored in `completedItemIds` when ticked, but they do NOT count toward chapter completion. They are purely navigational routing hints for Pam.

---

## 6. Routes

| Route | Purpose |
|---|---|
| `/` | The Idol home screen |
| `/login` | Password form |
| `/chapter/[slug]` | Chapter page (generateStaticParams from JSON) |
| `/api/auth/login` | POST — validate, set cookie |
| `/api/auth/logout` | POST — clear cookie |
| `/api/progress` | GET / POST — Upstash read/write |

Middleware: all routes except `/login` and `/api/auth/*` require a valid session.

---

## 7. The Idol — home screen spec

This is the primary screen. It shows one thing: the chapter Pam should do next.

```
┌──────────────────────────────────────┐
│ Sculptor's Idol  sub  [ring] [☰]    │  ← nav
├──────────────────────────────────────┤
│                                      │
│ Good evening, Pam.                   │  ← time-based greeting
│ "Posture over health..."             │  ← rotating motivational line
│                                      │
│ ┌────────────────────────────────┐   │
│ │ CHAPTER 08 OF 19 · CONTINUE   │   │  ← big current chapter card
│ │                                │   │    atmospheric colour gradient bg
│ │ Abandoned Dungeon              │   │    chapter name in Noto Serif JP
│ │ [blurb — 1–2 sentences]        │   │
│ │ ████░░░░░░░░░░  0%             │   │    progress bar, chapter accent colour
│ │ [Begin → / Continue →]         │   │
│ └────────────────────────────────┘   │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ 完  Last Completed · Ch.07    │   │  ← small completed card (tap to revisit)
│ │     Ashina Castle — Part 2    │   │
│ └────────────────────────────────┘   │
└──────────────────────────────────────┘
```

**Logic:**
- "Current chapter" = first chapter where `isChapterDone()` returns false.
- "Last completed" = the chapter with the highest `order` where `isChapterDone()` returns true. Hidden if no chapter is done yet.
- When all 19 chapters are done → show a Dragon's Homecoming completion screen (金 seal + congratulations for Pam).
- The big card uses the chapter's atmospheric colour theme for its gradient background, border, and button colour.

---

## 8. Checklist item types

Three types of checklist rows — each renders differently:

### A. Regular item
Standard checkbox. Counts toward chapter completion.
```jsx
<ChecklistRow item={item} checked={...} onToggle={...} spoilersOn={...} />
```
- Unchecked: ghost checkbox, full-opacity text (blurred if `spoiler:true` and spoilers off)
- Checked: jade green checkmark, strikethrough text, muted colour

### B. Nav cue (`isNavCue: true`)
Amber warning banner with a separate ticking checkbox. Does NOT count toward chapter completion.
```jsx
<NavCueRow item={item} ticked={...} onTick={...} />
```
- Rendered as a distinct amber-bordered card with ⚠ icon and italic text
- Ticking it just marks "I did this detour" — it doesn't unlock anything
- No blur regardless of spoilers (routing info is never spoiler-gated)
- Examples: "STOP — go to Abandoned Dungeon before Genichiro", "CRITICAL CHOICE — side with Kuro"

### C. Return Path item (`returnPath: true`)
Same as regular item but shows a gold `RETURN` badge before the text. Counts toward completion normally.

---

## 9. Chapter drawer spec

Activated by the ☰ icon in the nav. Slides in from the right.

```
             ┌──────────────────────┐
             │  ALL CHAPTERS    [✕] │
             │ ─────────────────────│
             │ ● 01  Ashina Reserv. │ ← coloured dot = chapter theme colour
             │ ● 02  Dilapidated T. │ ← done rows: 完 badge, 70% opacity
             │ ...                  │
             │ ► 08  Abandoned D.   │ ← current: gold border-left, NOW badge
             │ ○ 09  Senpou Temple  │ ← future: dim dot, no badge
             │ ...                  │
             └──────────────────────┘
```

- Width: 280px on desktop, 85vw on mobile (never full screen — home card peeks through)
- Semi-transparent overlay covers the home/chapter page. Click overlay → close drawer.
- Tapping a chapter row navigates to it AND closes the drawer.
- Drawer is scrollable internally (19 rows fit comfortably; natural scroll is correct UX here).
- Spoiler-zone chapters (order ≥ 10+, `spoilerRegion: true`) show their real name always in the drawer — the user chose to open the map.

---

## 10. Chapter page spec

```
┌──────────────────────────────────────┐
│ [← Home]      Ch.08 of 19  [Spoilers]│  ← nav strip (chapter-coloured)
├──────────────────────────────────────┤
│ CHAPTER 08 OF 19           [← Ch.07]│
│ Abandoned Dungeon      [Ch.09 →]    │
│ [blurb]                              │
│ ████░░░░░░░ 2/6 items · 33%         │  ← progress bar in chapter accent colour
├────────────────────┬─────────────────┤
│ CHECKLIST          │ BOSSES          │
│ □ Item 1           │ [Boss card]     │  ← desktop: side by side
│ □ Item 2           │ [Boss card]     │  ← mobile: stacked (checklist above bosses)
│ ⚠ [Nav cue]        │                 │
│ ☑ Item 3 (done)    │                 │
│ [RETURN] Item 4    │                 │
└────────────────────┴─────────────────┘
```

**Boss card:**
- Name (Noto Serif JP), BOSS or MINI-BOSS badge (vermilion or gold)
- One-line tip (muted, italic)
- Two YouTube guide links as small pills
- Spoiler bosses show "??? — Boss" until spoilers toggle is on

**Spoiler toggle:**
- Lives in the nav strip for that chapter
- Off by default. Per-chapter state stored in `localStorage` (not Redis — it's a UI preference, not progress)
- When off: spoiler text is blurred (CSS `filter: blur(4px)`) with "tap to reveal" on individual items
- When on: all blur cleared, hidden boss names and tips revealed

---

## 11. Per-chapter colour themes

Each chapter has an `accent` colour and a `bg` gradient used for:
- The chapter card gradient on the home screen
- The chapter page hero background
- The progress bar fill colour
- The chapter number eyebrow colour
- The current-chapter indicator dot in the drawer

```
Ch.01  Ashina Reservoir            accent #4A8AC4   bg: deep navy → midnight blue
Ch.02  Dilapidated Temple          accent #C4922A   bg: dark umber → warm amber
Ch.03  Ashina Outskirts            accent #C4602A   bg: char black → war orange
Ch.04  Hirata Estate               accent #C43A3A   bg: dark maroon → crimson
Ch.05  Ashina Castle               accent #6A8AA8   bg: midnight → castle slate
Ch.06  Ashina Reservoir — Pt.2     accent #2A8A8A   bg: dark teal → deep emerald
Ch.07  Ashina Castle — Pt.2        accent #A08A3A   bg: dark umber → aged gold
Ch.08  Abandoned Dungeon           accent #7A4AA8   bg: black → deep purple
Ch.09  Senpou Temple, Mt. Kongo    accent #3A8A5A   bg: forest black → jade green
Ch.10  Ashina Castle — Pt.3        accent #8A742A   bg: dark soil → old gold
Ch.11  Sunken Valley               accent #4A7AAA   bg: dark navy → ice blue
Ch.12  Sunken Valley Passage       accent #5A7A3A   bg: dark earth → moss green
Ch.13  Ashina Depths / Hidden Forest accent #2A5A3A  bg: pitch → dark forest
Ch.14  Mibu Village                accent #2A5A7A   bg: black → moonlit blue
Ch.15  Ashina Castle — Pt.4        accent #AA2A2A   bg: deep black → blood red
Ch.16  Hirata Estate — Pt.2        accent #8A1A2A   bg: void → dark crimson
Ch.17  Fountainhead Palace         accent #C4828A   bg: dark plum → blossom pink
Ch.18  Ashina Reservoir — Pt.5     accent #C4622A   bg: ash → ember orange
Ch.19  ENDINGS — The Return        accent #C9A227   bg: dark earth → transcendent gold
```

Exact hex values: live in `data/sekiro-content.json` under each region's `theme.accent` and `theme.bg` fields. Code always reads from JSON — never hardcoded.

---

## 12. Design system

### Colour tokens (global)
```
--ink         #0E0D0B   page background
--charcoal    #1A1815   cards / panels
--ash         #2A2724   borders, dividers
--bone        #E8E2D4   primary text
--mist        #9B9488   secondary / muted text
--gold        #C9A227   global accent, progress, links
--vermilion   #B23A2E   boss badge, spoiler markers
--jade        #4A7A6A   completion colour (完 seal)
--amber       #D4860A   nav cue banners
```

### Typography
- **Display / headings:** `Noto Serif JP` — weight 400 / 500 (Sekiro's confirmed in-game UI font)
- **Body / UI:** `Inter` — weight 300 / 400 / 500
- **Japanese accents:** 完, 帰 use system `serif` fallback for correct glyph rendering

### Texture
- Paper-grain overlay: SVG `feTurbulence` noise at 3% opacity on the ink-black background
- Chapter page hero: atmospheric gradient from `theme.bg`, with subtle top-vignette

### Motion (Framer Motion — all respect `prefers-reduced-motion`)
- Home → chapter page: fade + 8px Y rise (200ms ease-out)
- Drawer: `translateX(100%) → 0` (220ms cubic-bezier .4,0,.2,1)
- Checkbox tick: ink brush-stroke SVG path animates from 0 to full (150ms)
- Chapter completion: 完 seal stamps with scale 1.8 → 1 (350ms ease-out)
- Progress bar: CSS `transition: width 400ms ease`
- Chapter card on home: Framer Motion `whileHover` lift 3px
- Scroll reveals on chapter page: `whileInView` stagger on checklist rows (40ms each)
- Reduced motion: all above degrade to instant (no duration)

---

## 13. Mobile responsiveness

Pam will open this on her phone while playing on PC. Every interaction must feel native on mobile.

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px – 1024px
- **Desktop:** > 1024px

### Mobile-specific layout changes

**Home screen:**
- Chapter card: full width, min-height 200px, larger tap target
- Font: greeting 20px → 18px, chapter name 20px, blurb 11px
- Completed card below: full width

**Chapter drawer:**
- Width: 85vw (not fixed 280px)
- Each drawer row: min-height 44px (iOS tap target minimum)
- Close button: 36×36px minimum

**Chapter page:**
- Checklist + bosses: stacked vertically (not side-by-side grid)
- Checklist first, bosses below with a horizontal divider between them
- Boss col max-height removed — shows fully on mobile
- Checklist row: min-height 40px, tap area full width
- Nav cue banners: full width with larger padding

**Nav strip:**
- Logo text truncates gracefully
- Spoiler toggle becomes an icon-only button (eye icon) on mobile < 480px
- Prev/Next chapter buttons become ‹ › arrows without text labels

**Touch:**
- All tap targets minimum 44×44px
- No hover-only interactions (hover states are additive, not required)
- Drawer closes on swipe-right gesture (optional enhancement)

**Typography on mobile:**
- Minimum font size: 11px (never below)
- Line height: 1.6 for readability on small screens
- Noto Serif JP loads efficiently (subset: only weights 400, 500)

---

## 14. Component list

```
app/
  layout.tsx                   # Noto Serif JP + Inter fonts, grain overlay, SessionProvider, Framer layout
  page.tsx                     # Home — The Idol screen
  login/page.tsx               # Password form
  chapter/[slug]/page.tsx      # Chapter page (generateStaticParams from JSON slugs)
  api/auth/login/route.ts      # POST — bcrypt compare, set iron-session cookie
  api/auth/logout/route.ts     # POST — destroy cookie
  api/progress/route.ts        # GET → Upstash fetch | POST → Upstash upsert

components/
  home/
    Greeting.tsx               # Time-based greeting + rotating motivational line
    CurrentChapterCard.tsx     # The big "Continue" card with chapter theme colours
    LastCompletedCard.tsx      # Small jade completed chapter card
    AllDoneScreen.tsx          # Dragon's Homecoming completion state
  nav/
    SiteNav.tsx                # Logo + progress ring + drawer trigger
    ProgressRing.tsx           # SVG animated ring
    ChapterDrawer.tsx          # Slide-out drawer, overlay, 19 chapter rows
  chapter/
    ChapterHero.tsx            # Hero gradient + title + blurb + progress bar + prev/next
    Checklist.tsx              # Ordered list of all item types
    ChecklistRow.tsx           # Regular checkbox row with ink-brush animation
    NavCueRow.tsx              # Amber warning banner with its own checkbox
    BossCard.tsx               # Boss name / type / tip / guide links / spoiler gate
    SpoilerToggle.tsx          # Eye icon button, per-chapter state
  ui/
    SealStamp.tsx              # 完 Framer Motion stamp animation
    ReturnBadge.tsx            # Gold RETURN pill

lib/
  content.ts                   # Import and fully type sekiro-content.json
  redis.ts                     # @upstash/redis client singleton
  progress.ts                  # getProgress(), toggleItem(), deriveChapterState()
  session.ts                   # iron-session config (cookie name, password, ttl)
  greeting.ts                  # greetingFor(hour), randomLine()

data/
  sekiro-content.json          # All 19 chapters — maintained in Git, never in code

public/
  chapters/[slug].webp         # Optional: atmospheric hero art per chapter
                               # Falls back to CSS gradient from theme.bg if image missing
```

---

## 15. Build order for Claude Code

1. **Scaffold** — Next.js 15 + TS + Tailwind v4 + Framer Motion. Load, validate, and type `sekiro-content.json`. Set global design tokens and fonts via CSS variables. Paper-grain overlay.

2. **Auth** — `iron-session` + `bcryptjs`. Login page (password field only). `/api/auth/login` and `/api/auth/logout`. Middleware guard on all routes.

3. **The Idol home screen** — greeting, motivational line, `CurrentChapterCard`, `LastCompletedCard`, `AllDoneScreen`. Wire with mocked `useState` progress for now.

4. **Chapter drawer** — `ChapterDrawer`, overlay, all 19 chapter rows. Open/close animation. Navigation on row tap.

5. **Chapter pages** — `ChapterHero` with theme colours, `Checklist` with all three item types, `BossCard` with spoiler gate, `SpoilerToggle`, prev/next nav.

6. **Upstash** — wire `progress.ts`, replace mocked state with Redis. Persist checkbox → Redis on every toggle. Chapter completion is derived client-side from the fetched `completedItemIds`.

7. **Motion + polish** — page transitions, drawer slide, ink-brush checkbox, 完 seal, scroll-stagger on chapter page rows. All respect `prefers-reduced-motion`.

8. **Mobile pass** — verify every breakpoint. Test drawer on 375px. Ensure tap targets ≥ 44px. Stack layout on chapter page. Truncate nav gracefully.

9. **Ship** — push to GitHub → Vercel deploy → set env vars → smoke test cross-device.

---

## 16. Content note

All game content — region names, chapter order, checklist text, boss tips, YouTube guide URLs, spoiler flags, isNavCue flags, returnPath flags, theme colours, greeting text, and motivational lines — lives in `data/sekiro-content.json`. **Never hardcode game content in component files.** If a checklist item needs to change, edit the JSON and push. Vercel rebuilds automatically.

---

## 17. Acceptance criteria

- [ ] Opening the site greets Pam by name correctly for IST time of day, with a Sekiro-spirit line that varies per visit.
- [ ] The Idol home screen shows exactly one "Continue" chapter card (the current active chapter) and optionally one small completed card — nothing else.
- [ ] The ☰ icon slides out the drawer with all 19 chapters. Tapping any row navigates to that chapter and closes the drawer.
- [ ] Tapping the chapter card navigates to that chapter's page.
- [ ] Checking items persists across device reload and is synced between phone and laptop via Upstash Redis.
- [ ] `isNavCue` items render as amber banners (not standard checkboxes) and do not count toward chapter completion.
- [ ] `returnPath` items show a gold RETURN badge and count toward completion normally.
- [ ] Spoiler items are blurred by default. The per-chapter spoiler toggle clears all blur. Individual items can be tapped to reveal one at a time.
- [ ] Each of the 19 chapters has its own accent colour used in the card gradient, progress bar, eyebrow, and drawer dot.
- [ ] When every item in a chapter is checked, the 完 seal stamps on the chapter hero and the home screen advances to the next chapter.
- [ ] When all 19 chapters are done, the All-Done / Dragon's Homecoming completion screen appears.
- [ ] Password login works; session persists across browser restarts; logout clears session.
- [ ] The site is fully usable on a 375px mobile screen. Chapter page stacks checklist above bosses. Drawer is 85vw. All tap targets ≥ 44px.
- [ ] No audio anywhere. All Framer Motion animations respect `prefers-reduced-motion`.
