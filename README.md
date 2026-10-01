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
  sections/             hero, about, work, experience, stack, activity, contact
  project-visuals.tsx   code-built UI mockups for each project (no images)
  nav.tsx               sticky glass nav, active-section indicator, mobile menu
  cursor.tsx            desktop-only custom cursor (dot + ring + labels)
  magnetic.tsx          magnetic hover wrapper
  reveal.tsx            Reveal / SplitText / ScrollWords / SectionLabel primitives
  signal-field.tsx      cursor-reactive canvas background for the hero
lib/
  data.ts               ALL site content: edit this file to update copy
  github.ts             server-side GitHub API fetch (hourly ISR, fails soft)
```

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
