# Taha Kommah — Portfolio

An anime-inspired personal portfolio for **Taha Kommah**, Senior Full Stack
Engineer. Built as static pages — no build step, no dependencies — and deployed
to GitHub Pages. It ships in **two editions** you can switch between:

- **⚡ Cyber Edition** (`index.html`) — a dark cyberpunk/anime look
- **☠ One Piece Edition** (`one-piece.html`) — a pirate / Grand Line adventure

## Highlights

**Cyber Edition** — falling sakura petals, neon background, scanlines, glitch
hero title, typing role effect, custom glowing cursor, HUD avatar with orbiting
rings, animated counters and skill power-bars.

**One Piece Edition** — animated ocean with drifting clouds and a sailing ship,
falling gold coins, a spinning-compass loader, a swaying "WANTED" poster with a
counting bounty, Devil-Fruit skill cards, a Grand Line voyage timeline, treasure
chests and a Den Den Mushi contact section.

Both are fully responsive with a `prefers-reduced-motion` fallback.

## Tech

Plain HTML, CSS and vanilla JavaScript. Fonts via Google Fonts (Orbitron,
Rajdhani, Outfit, Noto Sans JP, Pirata One, Cinzel, Special Elite).

## Structure

```
index.html                  Cyber Edition markup
one-piece.html              One Piece Edition markup
assets/css/style.css        Cyber visual system
assets/css/one-piece.css    One Piece visual system
assets/js/main.js           Cyber interactions
assets/js/one-piece.js      One Piece interactions
assets/Taha_Kommah_Resume.pdf
.github/workflows/          GitHub Pages deployment
```

## Deployment

Pushing to the site branch triggers `.github/workflows/deploy.yml`, which
publishes the site to GitHub Pages automatically.

To run locally, just open `index.html` — or serve the folder:

```bash
python3 -m http.server 8000
```
