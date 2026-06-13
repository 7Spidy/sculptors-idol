# Sculptor's Idol — Manual Setup Guide

These are the steps Claude Code and Cowork CANNOT do for you —
either because they require a browser, account creation, or a secret you must choose yourself.
Do all of these BEFORE running the Claude Code prompt.

Estimated time: 15–20 minutes.

---

## Step 1 — Create accounts (if you don't have them)

You need three accounts. You likely already have GitHub and Vercel.

**GitHub** — https://github.com
Used to host the code. Free.

**Upstash** — https://upstash.com
Used to store Pam's progress (which checkboxes she's ticked). Free tier is more than enough.
Sign up with Google — takes 30 seconds.

**Vercel** — https://vercel.com
Used to deploy the site. Free tier works. Connect it to your GitHub account during sign-up.

---

## Step 2 — Create the repo and add the data files

On GitHub, create a new repository: `7Spidy/sculptors-idol` (or whatever name you prefer).

Clone it locally:
```bash
git clone git@github.com:7Spidy/sculptors-idol.git
cd sculptors-idol
mkdir -p data
```

Copy the two handoff files into the repo:
```
HANDOFF_SPEC.md         → repo root
CLAUDE_CODE_PROMPT.md   → repo root
data/sekiro-content.json → data/sekiro-content.json
```

Commit and push them first — Claude Code needs them in the repo:
```bash
git add .
git commit -m "docs: add handoff spec, prompt, and sekiro content"
git push origin main
```

---

## Step 3 — Choose a password and generate its hash

This is the password Pam (and you) will use to log in. Choose something easy to remember but not obvious.

Once you've chosen the password, run this one-liner to get its bcrypt hash:

```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('YOUR_PASSWORD_HERE', 10))"
```

If bcryptjs isn't installed globally, run it from inside the project after Claude Code has scaffolded it (Phase 1), or install it temporarily:

```bash
npx -p bcryptjs node -e "const b=require('bcryptjs');console.log(b.hashSync('YOUR_PASSWORD_HERE', 10))"
```

The output will look like:
```
$2a$10$abc123xyz...
```

**Copy and save this hash.** You'll need it in Step 5.

---

## Step 4 — Create the Upstash Redis database

1. Log in at https://upstash.com
2. Click **Create Database**
3. Settings:
   - Name: `sculptors-idol` (or anything)
   - Type: **Regional**
   - Region: pick the closest to Mumbai — `ap-south-1` (Mumbai) if available, otherwise `ap-southeast-1` (Singapore)
   - TLS: **Enabled** (default)
4. Click **Create**
5. Once created, go to the database dashboard → **REST API** tab
6. Copy:
   - `UPSTASH_REDIS_REST_URL` — looks like `https://abc-123.upstash.io`
   - `UPSTASH_REDIS_REST_TOKEN` — a long token string

**Keep these safe.** They go into the env vars next.

---

## Step 5 — Create the `.env.local` file

Create this file in the repo root. Claude Code will need it when it runs Phase 6 (Upstash wiring):

```
# Auth
SITE_PASSWORD_HASH=$2a$10$...      ← paste your bcrypt hash from Step 3
SESSION_SECRET=...                  ← generate with: openssl rand -base64 32

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...  ← from Step 4
UPSTASH_REDIS_REST_TOKEN=...        ← from Step 4
```

To generate `SESSION_SECRET`:
```bash
openssl rand -base64 32
```

**Do NOT commit `.env.local` to Git.** Add it to `.gitignore` (Claude Code will do this in Phase 1, but double-check).

---

## Step 6 — Run Claude Code

Open Claude Code in the repo root:
```bash
claude
```

Paste the entire prompt from `CLAUDE_CODE_PROMPT.md`.

Let it build phase by phase. Review each phase before saying "continue."

Key moments to pause and check:
- **After Phase 3 (home screen):** Does it look like the mockup? Does the chapter card show the right chapter with the right colour?
- **After Phase 5 (chapter pages):** Open Ashina Castle Pt.2 — does it show the amber ⚠ STOP banner between items 7 and 8? Do spoiler items blur?
- **After Phase 6 (Upstash):** Tick a checkbox. Refresh the page. Is it still ticked?

---

## Step 7 — Deploy to Vercel

Option A — Vercel CLI (Claude Code can do this after Phase 9):
```bash
npx vercel
```
Follow the prompts: link to your GitHub repo, accept defaults for Next.js.

Option B — Vercel dashboard (browser, manual):
1. Go to https://vercel.com → New Project
2. Import the `sculptors-idol` GitHub repo
3. Framework preset: Next.js (auto-detected)
4. Click **Deploy**

---

## Step 8 — Set env vars on Vercel

This MUST be done in the Vercel dashboard — you cannot do it via CLI without interactive prompts.

1. Go to your deployed project on Vercel → **Settings → Environment Variables**
2. Add these four, one by one:

| Name | Value |
|---|---|
| `SITE_PASSWORD_HASH` | Your bcrypt hash from Step 3 |
| `SESSION_SECRET` | Your random string from Step 5 |
| `UPSTASH_REDIS_REST_URL` | From Step 4 |
| `UPSTASH_REDIS_REST_TOKEN` | From Step 4 |

3. After adding all four: go to **Deployments** → click the latest deployment → **Redeploy** (so the env vars take effect)

---

## Step 9 — Smoke test

**Cross-device sync test (the most important one):**
1. Open the deployed URL on your laptop → log in → check 3 items in Chapter 1
2. Open the same URL on your phone → log in with the same password
3. The same 3 items should be checked on the phone

**Spoiler test:**
1. Open any late chapter (e.g., Ch.15 Ashina Castle Pt.4)
2. Items should be blurred. The amber ⚠ nav cue should be fully visible (never blurred)
3. Tap the 👁 Spoilers button → all blur clears
4. Refresh → spoilers should still be on (localStorage persists)

**Mobile test:**
1. Open on your phone
2. Open the chapter drawer (☰) — it should be 85vw wide, the home card peeks on the left
3. Go into Chapter 9 (Senpou Temple) — checklist should be above bosses (stacked, not side-by-side)
4. All tap targets should feel comfortable to tap without zooming

---

## Step 10 — Optional: hero art for chapters

Each chapter in `sekiro-content.json` has a `heroPrompt` field — a ready-to-use image generation prompt for atmospheric, character-free art that's safe to deploy publicly.

Generate with Flux, DALL·E, Midjourney, or Stable Diffusion. Save as WebP:
```
public/chapters/ashina-reservoir-1.webp
public/chapters/dilapidated-temple.webp
public/chapters/ashina-outskirts.webp
public/chapters/hirata-estate-1.webp
... (one per slug, matching the id field in the JSON)
```

The site works perfectly without these — the CSS gradient fallback from `theme.bg` is intentional and looks good. Add the art whenever you're ready.

---

## Summary — what Claude Code does vs what you do manually

| Task | Claude Code ✓ | You manually ✓ |
|---|---|---|
| Scaffold Next.js + install deps | ✓ | |
| Write all components | ✓ | |
| Wire Upstash in code | ✓ | |
| Auth code (iron-session) | ✓ | |
| GitHub repo creation | | ✓ |
| Upstash database creation | | ✓ |
| Choose password + generate hash | | ✓ |
| Create `.env.local` | | ✓ |
| Vercel project creation | | ✓ |
| Set Vercel env vars | | ✓ |
| Cross-device smoke test | | ✓ |
| Generate hero art (optional) | | ✓ |
