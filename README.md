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

## Running Locally

No build step required. Either:

1. Open `index.html` directly in a browser, **or**
2. Serve it locally to avoid any `file://` restrictions some browsers apply to relative asset paths:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```

## Deployment

Static hosting only — no server/database needed. Works as-is on:
- GitHub Pages
- Netlify
- Vercel
- Any static file host

Just upload the four files above plus the `assets/` folder.

## Required Manual Setup

### 1. Contact form (Formspree)

The message form in the Contact section posts to Formspree, a hosted form backend — keeping the site fully static with no server code.

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form; Formspree will give you a form ID like `xxxxxxxx`.
3. Confirm the form's notification email is set to `zimss75656@gmail.com`.
4. Open `script.js`, find this line near the top of the `/* ── CONTACT FORM ── */` block:
   ```javascript
   const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
   Replace `YOUR_FORM_ID` with your real Formspree endpoint. Until this is set, the form will show an error toast on submit instead of failing silently.
5. Free tier covers 50 submissions/month with basic spam filtering. A hidden honeypot field (`_gotcha`) in the form adds a second layer of bot protection.

### 2. Open Graph / social preview image

`index.html` references `./assets/image/og-preview.png` for link previews (Facebook, LinkedIn, Twitter/X, etc.), sized **1200×630px**. This file needs to be created manually — a clean screenshot or composition of the hero section on dark theme is recommended. Until it's added, social shares will show a broken image rather than a preview.

### 3. Domain placeholders

`index.html` has three placeholder URLs that should be updated once the site is deployed to a real domain:
- `<link rel="canonical" href="https://YOUR-DOMAIN-HERE.com/">`
- `<meta property="og:url" content="https://YOUR-DOMAIN-HERE.com/">`
- The `"url"` field inside the JSON-LD `<script type="application/ld+json">` block

### 4. Project/avatar images

Place the following in `assets/image/` (referenced throughout `index.html`, with graceful fallback icons if missing):
- `mypic.png` — favicon
- `mypic1.png` — hero avatar photo
- `YoutubeVideoThumbnail_LMS.webp`, `YoutubeVideoThumbnail_CDDS.png`, `YoutubeVideoThumbnail_EBMS.webp`, `YoutubeVideoThumbnail_RMRA(Rover).jpg`, `Employee Management System Civic Tech (Narayanganj City).png` — project thumbnails
- `og-preview.png` — social share image (see above)

### 5. Floating menu Facebook link

In `index.html`, the floating quick-contact menu's Facebook button currently points to a placeholder:
```html
onclick="window.open('https://www.facebook.com/yourusername','_blank')"
```
Update this to the real profile URL (`https://www.facebook.com/md.zahidul.islam.mehedi.2024`, matching the one already used elsewhere on the page) — this was flagged in the source as a known placeholder, left as-is here since replacing it wasn't part of the completed task list.

## Changes Applied in This Build

This version consolidates five completed maintenance passes:

| # | Change | Summary |
|---|---|---|
| 1 | **Deduplicated JS & CSS** | Removed a legacy `updateShowMore()` block that was double-firing on every Show More click and silently overwriting correct filtered counts with hardcoded values. Removed a dead `#float-contact` CSS block that referenced a non-existent element and was fully shadowed by the active floating-menu styles. |
| 2 | **Functional contact form** | Replaced the read-only display fields with a real Name/Email/Message form, wired to Formspree (see setup above), with client-side validation, a honeypot anti-spam field, and toast success/error feedback. |
| 3 | **SEO & social metadata** | Added `<meta name="description">`, canonical link, Open Graph tags, Twitter Card tags, and a JSON-LD `Person` structured-data block to `<head>`. |
| 4 | **Accessibility pass** | Added visible `:focus-visible` outlines on all interactive elements; `aria-label`/`aria-expanded`/`aria-controls` on icon-only buttons (theme toggle, hamburger, back-to-top, floating menu); `aria-hidden="true"` on decorative layers (`#cursor-glow`, `#particles-canvas`). |
| 5 | **Hardened external links** | Added `rel="noopener noreferrer"` to all 20 anchors using `target="_blank"`, across Hero, Projects, Contact, and the contact-form's alt-contact row. |
| 6 | **3D hero scene (Three.js)** | Added a `#hero3d` canvas orbiting the avatar: two nested wireframe icosahedra (colored from the existing `--accent`/`--cyan` tokens) plus a sparse particle shell, with subtle mouse-parallax rotation. Loaded via CDN (`unpkg.com/three@0.128.0`) — no build step. Colors re-sync automatically on theme toggle, rendering pauses when the hero scrolls out of view, and the whole feature no-ops silently if the CDN fails to load or `prefers-reduced-motion` is set. |

### Known open item

A contrast audit during the accessibility pass found `--text-dim` fails WCAG AA's 4.5:1 body-text threshold against both `--bg` and `--bg2`, in both themes (as low as 2.96:1 in dark mode). A fix was proposed but not applied, since it's a visual color change outside that task's stated scope:

| Theme | Current `--text-dim` | Proposed | New ratio (vs. `--bg2`) |
|---|---|---|---|
| Dark | `#5a5a8a` | `#8686b4` | 5.51:1 ✅ |
| Light | `#8888aa` | `#666690` | 4.93:1 ✅ |

To apply, update the two `--text-dim` values in the `:root` and `body.light` blocks in `style.css`.

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

## Design Tokens (for reference)

```css
:root {
  --bg: #09090f; --bg2: #0f0f1a; --bg3: #141424;
  --surface: #17172a; --border: #222240; --border2: #2d2d55;
  --accent: #6c63ff; --cyan: #00d4ff; --green: #00e5a0; --orange: #ff7b5a;
  --text: #c8c8e8; --text-dim: #5a5a8a; --text-bright: #eeeeff;
  --mono: 'JetBrains Mono', monospace;
  --sans: 'Outfit', sans-serif;
}
```

Full color, typography, layout, and motion guidelines are documented separately in the project's design specification.

---

© 2026 Md. Zahidul Islam Mehedi
