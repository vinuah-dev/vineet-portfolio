# vineet-portfolio

Personal site of **Vineet Rohit Shah**: Computer Science Engineering student, AI/ML and full-stack developer.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4 and Motion.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Structure

```
app/
  layout.tsx            fonts (Geist, Geist Mono, Instrument Serif), metadata, global chrome
  page.tsx              section composition
  template.tsx          CSS page-enter transition
  not-found.tsx         custom 404
  opengraph-image.tsx   generated social card
  icon.svg              monogram favicon
components/
  sections/             hero, about, work, lab, experience, stack, activity, contact
  project-media.tsx     real screenshots: tabs, 3D tilt, lightbox, in-view video
  project-visuals.tsx   code-built visual for projects without screenshots (CIPHER)
  evac-sim.tsx          playable SAFEX evacuation sim (hazard-aware A*)
  jarvis.tsx            in-browser Jarvis: voice/text intent router that drives the page
  command-palette.tsx   ⌘K / Ctrl K palette
  talk-menu.tsx         "Let's talk" menu (Gmail, LinkedIn, Instagram)
  portrait.tsx          halftone portrait with a reveal lens
  nav.tsx               sticky glass nav, active-section indicator, mobile menu
  cursor.tsx            desktop-only custom cursor (dot + ring + labels)
  magnetic.tsx          magnetic hover wrapper
  reveal.tsx            Reveal / SplitText / ScrollWords / SectionLabel primitives
  signal-field.tsx      cursor-reactive canvas background for the hero
lib/
  data.ts               ALL site content: edit this file to update copy
  github.ts             server-side GitHub API fetch (hourly ISR, fails soft)
```

## Assets

`public/work/` holds real project screenshots (SAFEX design views, SENTINEL-X dashboard in
its synthetic test mode, Revolution Gym pages, Jarvis HUD frames + a 20 s muted loop).
`public/milestones/` holds ANVESHAN / EFOS photos and `public/me/` the portrait. All WebP,
served through `next/image`.

## Content

Everything visible on the site (projects, achievements, timeline, stack, links) lives in
`lib/data.ts`. To add a live demo link to a project, set its `live` field.

## GitHub data

The Activity section fetches profile, repositories and public events from the GitHub REST API
on the server and revalidates hourly. If the API is unavailable it falls back to static
repository links and hides live numbers rather than showing invented ones. Optionally set
`GITHUB_TOKEN` (read-only, no scopes) to raise the rate limit.

Set `NEXT_PUBLIC_SITE_URL` to your production URL for correct Open Graph links (Vercel's
production URL is detected automatically).
