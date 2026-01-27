# <a href="https://pixelkit.vercel.app" target="_blank">PixelKit Icons - Pixel-perfect SVG Icons</a>

PixelKit Icons is a lightweight, client-first SVG icon browser and toolbox. Browse an icon index on a CDN, inline icons into the page, and quickly search, resize, recolor, and copy pixel-perfect SVG markup — all in the browser with no uploads. Ideal for developers and designers who want fast access to SVG assets, easy styling via `currentColor`, and a small, accessible UI.

<p align="left">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-9B72FF.svg?style=flat" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/Repository%20Status-Maintained-9B72FF.svg?style=flat" alt="Status" />
  <img src="https://img.shields.io/badge/Website%20Status-Online-9B72FF.svg?style=flat" alt="Website" />
  <a href="https://github.com/byllzz">
    <img src="https://img.shields.io/badge/Author-Bilal%20Malik-9B72FF.svg?style=flat" alt="Author" />
  </a>
  <a href="https://github.com/byllzz/pixelkit-icons/releases">
    <img src="https://img.shields.io/badge/Latest%20Release-Jan%209%2C%202026-9B72FF.svg" alt="Latest Release" />
  </a>
</p>

<br>

[![Visit PixelKit Icons](https://img.shields.io/badge/View-PixelKit-Icons-9B72FF?style=flat)](https://pixelkit.vercel.app)

<img width="100%" alt="PixelKit Icons preview" src="./assets/previews/pixelkit-preview.png" />

⭐ Star the repo on GitHub — it helps!

---

## ✨ What is PixelKit?

PixelKit is a small, dependency-light web app that:
- Loads an SVG index from a CDN (jsDelivr) and inlines icons into a responsive grid.
- Lets you **search** icons by name, **resize** them, **recolor** them via a color picker, and **copy** SVG markup to the clipboard.
- Persists user preferences (theme, color, size, search) locally using `localStorage`.
- Includes graceful fallbacks (small bundled list) if the CDN index cannot be fetched.
- Focuses on accessibility, keyboard support, and fast UI updates (batch loading).

---

## ✨ Features

- ✔️ Fast, client-first icon browser
- ✔️ Search and client-side filtering (persisted)
- ✔️ Live recolor using CSS `currentColor` + color picker
- ✔️ Size slider that updates `--icon-size` (inline SVG sizing)
- ✔️ Per-icon **Copy SVG** button (Clipboard API + textarea fallback)
- ✔️ “Download All” opens CDN index for bulk access
- ✔️ Batch loading for progressive rendering and smooth UX
- ✔️ LocalStorage persistence for theme, color, size, search
- ✔️ Small offline fallback icon set when CDN is unreachable
- ✔️ Accessible controls and keyboard-friendly interactions
- ✔️ Debug surface: `window._pixelIcons` for runtime inspection

---


## Installation

Clone the repository and open locally, or host static files (Netlify / Vercel / GitHub Pages):

```bash
# clone
git clone https://github.com/byllzz/pixelkit-icons.git
cd pixelkit-icons

# open index.html in your browser (or use Live Server)
# e.g. in VSCode use Live Server extension, or host with a static server:
# npx serve .   or   npx http-server .
