# Taha Kommah — Portfolio

An anime / cyberpunk-inspired personal portfolio for **Taha Kommah**, Senior Full
Stack Engineer. Built as a single-page static site — no build step, no
dependencies — and deployed to GitHub Pages.

## Highlights

- Falling sakura-petal canvas, animated neon background and scanline overlay
- Glitch hero title, typing role effect and a custom glowing cursor
- Animated stat counters, skill power-bars and scroll-reveal sections
- Anime-HUD avatar with orbiting tech rings
- Fully responsive with a `prefers-reduced-motion` fallback

## Tech

Plain HTML, CSS and vanilla JavaScript. Fonts via Google Fonts
(Orbitron, Rajdhani, Outfit, Noto Sans JP).

## Structure

```
index.html              markup
assets/css/style.css    visual system
assets/js/main.js       interactions
assets/Taha_Kommah_Resume.pdf
.github/workflows/      GitHub Pages deployment
```

## Deployment

Pushing to the site branch triggers `.github/workflows/deploy.yml`, which
publishes the site to GitHub Pages automatically.

To run locally, just open `index.html` — or serve the folder:

```bash
python3 -m http.server 8000
```
