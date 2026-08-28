# Md. Zahidul Islam Mehedi — Portfolio Website

A single-page, animated, responsive personal portfolio for a Backend Developer & AI Researcher. Built with plain HTML5, CSS3, and vanilla JavaScript — no build tools, no framework, no backend.

## File Structure

```
portfolio-site/
├── index.html          # Markup + <head> SEO/social metadata
├── style.css            # All styles (dark/light theme via CSS variables)
├── script.js             # All behavior (theme, nav, animations, filters, contact form)
├── README.md             # This file
└── assets/
    └── image/            # Place project thumbnails, avatar photo, and og-preview.png here
```

## Sections

- **Hero** — animated typewriter intro, avatar with rotating gradient rings, animated stat counters
- **About** — professional summary, stat grid, personal info panel with live Bangladesh time
- **Projects** — filterable grid (All / Backend / AI-Research / Hardware / Graphics) with show more/less
- **Skills** — categorized tag grid
- **Education / Credentials** — academic history, certifications, strengths, languages, volunteer work
- **Contact** — direct contact links, functional message form (see setup below), floating quick-contact menu


## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, Grid, Flexbox, keyframe animations) |
| Behavior | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6.5.0 (CDN) |
| Fonts | Google Fonts — Outfit, JetBrains Mono (CDN) |
| 3D | Three.js r128 (CDN, `unpkg.com/three@0.128.0`) — hero avatar wireframe scene only |
| Form backend | Formspree (no server code required) |
| Storage | Browser `localStorage` (theme preference only) |


Full color, typography, layout, and motion guidelines are documented separately in the project's design specification.

---

© 2026 Md. Zahidul Islam Mehedi