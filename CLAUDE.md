# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:4321
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview production build locally
```

There are no tests. Lint/format is handled by Prettier (`.prettierrc`).

## Architecture

This is the **Atriva marketing + docs website** built with Astro 5, Tailwind CSS v4, and deployed to GitHub Pages at `atriva.ai`.

### Content Collections (`src/content/`)

Astro content collections power the CMS layer. Schemas are defined in `src/content/config.ts`:

- **`blog/`** — Blog posts (`.md`), frontmatter: `title`, `pubDate`, `author`, `tags`
- **`docs/`** — Technical documentation (`.md`), frontmatter: `title`, `description`, `order`
- **`pages/`** — Home, contact, benefits pages (`.md`) — rendered into `src/pages/[slug].astro`
- **`team/`** — Team member profiles (`.md`)

### Page Routing (`src/pages/`)

- `index.astro` — Home page; pulls copy from `src/content/pages/index.md`, composes section components
- `blog/[slug].astro` — Blog post template using `BlogLayout`
- `docs/[...slug].astro` — Docs page template using `DocsLayout` (sidebar + prose content)
- `products.astro`, `pricing.astro`, `about.astro`, `contact.astro` — Static pages

### Layouts (`src/layouts/`)

- **`Layout.astro`** — Base layout: SEO (astro-seo), Navbar, Footer, OG image at `/atriva-og.png`
- **`DocsLayout.astro`** — Wraps Layout; adds sticky sidebar (`Sidebar.astro`) and mobile sidebar
- **`BlogLayout.astro`** — Wraps Layout for blog posts

### Key Config Files

- **`src/config/products.ts`** — All product definitions (name, tagline, features, status). Status values: `"ready"`, `"coming-soon"`, `"planning"`. Edit here to add/update products shown on `/products`.
- **`src/config/docsSidebar.ts`** — Docs sidebar structure. Add new doc sections/links here when adding docs pages.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`). Brand color is `#48A18D` (teal). Global styles in `src/styles/global.css`.

### Icons

Uses `astro-icon` with Boxicons (`bx:` prefix, e.g., `bx:bx-store`) and Simple Icons (`simple-icons:`). Import via `import { Icon } from "astro-icon/components"`.

### Path Alias

`@/` resolves to `src/` (configured in `tsconfig.json`).

### Utility Scripts (`scripts/`)

One-off shell scripts for importing/normalizing external markdown docs. Not part of the Astro build.
