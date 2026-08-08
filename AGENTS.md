# AGENTS.md

Website for Bhopal Shooting Range.

## Stack

Vite + React + TypeScript + Tailwind + pnpm
Fully responsive is a hard requirement.

Tailwind v4 (via `@tailwindcss/vite`), with all tokens in the `@theme` block of `src/styles/app.css`. No per-component CSS files, no UI kits. `motion/react` and GSAP ScrollTrigger are approved but not yet installed.

## Layout

- `Containerfile` — Node + pnpm toolchain, everything version-pinned
- `.devcontainer/devcontainer.json`
- `src/`, `public/`, `index.html` — the Vite app
- `src/styles/app.css` — the only stylesheet: Tailwind import, `@theme` tokens,
  light/dark overrides, base layer, keyframes
- `pnpm-workspace.yaml` — pnpm settings (pnpm 11 reads them here, not `.npmrc`)

## Dev container

All build/dev commands are run inside the dev container if it's set up. If the user has the development toolchain installed on their host machine, then the commands are run directly there.

## Conventions

- Default to no comment
- Clean up after yourself. No dead code, commented-out blocks, unused imports, unused deps, orphaned CSS classes, or scratch files left behind. If a change makes something redundant, delete it in the same change.
- Pin versions. Bump deliberately, never with `latest`.
- Keep responses and docs as short as possible and to the point — no filler, no restating the request back, no over-explaining. Answer, then stop.

## Content source

- `src/data/content.ts` is the single source for visible copy, SEO metadata, structured-data values and machine-readable content.
- Vite's `transformIndexHtml` hook injects homepage metadata during development and build. `scripts/prerender.mjs` applies route-specific metadata and JSON-LD, then generates `sitemap.xml` and `llms.txt` in `dist`.
- Keep `index.html` content-free. `CNAME`, `robots.txt` and `site.webmanifest` remain deployment configuration in `public/`.

## Checks

`pnpm check` builds and then runs `scripts/check.mjs` over `dist`: internal links, every `srcset` and preload candidate, page metadata, JSON-LD, heading order, accessible names, sitemap, robots, manifest and orphaned assets. Run it before claiming a change is safe. It reads only the built output, so it verifies the artifact rather than the source it came from.

## Go-live checklist

- `TODO.md` is the production-readiness checklist.
- Before stating that the project is ready to go live, verify that every item in `TODO.md` is resolved. If anything remains unresolved, explicitly tell the user which items are still pending.
