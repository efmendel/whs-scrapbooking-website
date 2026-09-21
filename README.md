# WHS Scrapbooking Club website

The website for the Westfield High School Scrapbooking Club. It's a two-page scrapbook-style site (the home page at `/` and a Meet the Team page at `/team`) built with [Astro](https://astro.build) and animated with [GSAP](https://gsap.com). There's no backend: `npm run build` produces plain static files you can host for free.

## Run it locally

You need **Node.js 22.12 or newer**.

```bash
npm install
npm run dev        # http://localhost:4321, reloads as you edit
npm run build      # outputs the finished site to ./dist
npm run preview    # serves ./dist to double-check the build
```

## Updating the site (no coding needed)

### Club info: `src/data/club.json`

The class code, Classroom link, meeting days/time/room, next meeting date, supplies note, advisor and photo captions all live in this one file. Replace anything in `[brackets]` and save.

```json
"classroom": { "code": "abc1234", "link": "https://classroom.google.com/c/..." },
"meetings": { "days": "Tuesdays", "time": "3:15 PM", "room": "204", "nextDate": "Oct 7" }
```

### Photos: `src/assets/gallery/`

1. Drop a photo into `src/assets/gallery/`, for example `zine-day.jpg`.
2. In `club.json`, set `"image": "zine-day.jpg"` on one of the `gallery` (or `heroPhotos`) entries and write its caption.

Square-ish photos look best. Astro resizes and compresses them automatically, and any entry without an image shows a patterned placeholder.

### Meet the team: `src/data/club.json` → `team`

Each officer has a `name`, `role`, `grade`, `image` and `bio`. Put officer photos in `src/assets/team/` and set `"image"` to the file name. Entries with `"featured": true` (the co-presidents) get their own row of bigger cards at the top. Add or remove entries and the page adjusts. The advisor card uses `advisor.name`, `advisor.email` and `advisor.image`. Leave `email` as `""` to hide it (the card then just points people to the room), and without an `image` the card shows the advisor's initials.

You can do all of this in GitHub's website editor. Once the site is hosted (below), each save redeploys it in about a minute.

## Deploying

The site is fully static, so any of these free hosts work. Connect the GitHub repo and use these settings:

| Host | Build command | Output folder |
|---|---|---|
| Netlify | `npm run build` | `dist` |
| Vercel | auto-detected (Astro) | auto |
| Cloudflare Pages | `npm run build` | `dist` |

After it's live, set `site` in `astro.config.mjs` to the real URL.

## How it's put together

```
src/
  data/club.json          ← all editable club info
  assets/gallery/         ← club photos
  assets/team/            ← officer and advisor photos
  pages/index.astro       ← home page (stacks the sections below)
  pages/team.astro        ← Meet the Team page
  layouts/Base.astro      ← <head>, fonts, meta tags
  components/
    Nav, Hero, Purpose, Gallery, GetInvolved, Footer   ← page sections
    Polaroid, TornLabel, Sticker, Stamp, MemberCard    ← scrapbook pieces
    MotionLayer           ← tape progress bar, stitched thread, sticker layer
  scripts/
    motion.ts             ← all scroll/entrance animations (GSAP + ScrollTrigger)
    cursor.ts             ← scissors cursor + click-to-add stickers
  styles/global.css       ← palette, fonts, shared scrapbook styles
  lib/paper.ts            ← torn-paper edge shapes
public/cursors/           ← scissors cursor images
```

### Palette (Strawberry Butter)

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FBF5E9` | page background |
| `--paper` | `#F4EAD7` | purpose band |
| `--card` | `#FFFCF5` | polaroids, notes |
| `--blush` | `#F5C6CF` | buttons, tape, footer |
| `--rose` | `#D46F87` | accents, squiggles |
| `--apricot` | `#F2C4A6` | accents |
| `--butter` | `#F6E2A0` | labels, code box |
| `--honey` | `#E9C766` | button shadow, star |
| `--cocoa` | `#4A3530` | text (instead of black) |

Fonts are self-hosted: Cherry Bomb One (headings and buttons), Gaegu (handwriting), Special Elite (labels) and Nunito (the class code) come from Fontsource; Fraunces (body text) is bundled in `src/assets/fonts/`.

### Motion

- **On load:** the torn label and headline pop in, the squiggle draws itself, polaroids drop in and get taped down, and stickers slap on.
- **On scroll:** a washi-tape progress bar grows along the top, and a stitched thread sews down the left side on wide screens. Section labels tear in, the purpose notes flutter in, and gallery photos "develop" and drift at different speeds. The steps get ticked off, the class code gets stamped on, and the ticket slides out and gets punched.
- **Cursor:** on a mouse or trackpad, the cursor is scissors that snip over links. Clicking an empty spot adds a sticker (up to 12, and each fades after about 9 seconds). Touch devices keep normal behavior.
- **Reduced motion:** if the visitor's device has "reduce motion" turned on, every animation is skipped and the page is static. If the script ever fails, the hero pieces still appear after 3 seconds.
