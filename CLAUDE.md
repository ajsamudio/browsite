# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **Dragonflybar Studio**, a home-based lash and eyebrow beauty studio in La Palma, CA. No build tools, package managers, or server-side code — pure HTML/CSS/JS served via GitHub Pages.

## Development

Open `index.html` directly in a browser or use any static file server. No build or install step required.

Deployed via **GitHub Pages** on the `main` branch.

## Architecture

Single-page site with three files:

- **index.html** — All page sections: nav, hero carousel, services pricing, gallery, testimonials, Calendly booking embed, footer
- **styles.css** — Full styling with CSS custom properties (`:root` design tokens for colors, shadows, radii), flexbox/grid layouts, and responsive breakpoints at 1024px, 768px, 480px
- **script.js** — Intersection Observer fade-in animations, navbar scroll effect, mobile hamburger toggle, canvas-based sparkle cursor trail

## External Dependencies (all CDN)

- **Bootstrap 4.3.1** — Used only for the hero carousel component
- **jQuery 3.3.1 slim** — Bootstrap dependency
- **Google Fonts** — Playfair Display (headings), Lora (body)
- **Calendly widget** — Embedded booking calendar (`antsamudio99/30min`)

## Design System

Colors defined as CSS custom properties in `:root`:
- Primary: sage greens (`--sage`, `--sage-light`, `--sage-pale`)
- Accents: terracotta (`--terracotta`), gold (`--gold`)
- Neutrals: cream (`--cream`), warm beige (`--warm-beige`), charcoal (`--charcoal`)

Typography: Playfair Display (serif) for headings, Lora for body text. Elegant & professional tone with earthy/natural palette.

## Key Patterns

- Sections use `.fade-in` class — Intersection Observer in script.js adds `.visible` on scroll
- Service pricing uses `.price-list` with flexbox `justify-content: space-between` for label/price alignment
- Gallery uses CSS Grid with hover overlays
- Navigation collapses to hamburger menu on mobile (`.nav-toggle` / `.nav-links.open`)
- Sparkle effect renders on a fixed full-screen `<canvas>` with `pointer-events: none`

## Images

All images in `img/` directory. Several are large (3-4MB). The `lRoom.jpg` file is currently unused.
