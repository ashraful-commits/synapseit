# Synapse IT — Next.js Website

A premium software engineering agency website built with:
- **Next.js 14** (App Router)
- **Three.js** — Interactive particle field background with mouse parallax
- **GSAP + ScrollTrigger** — Scroll-driven animations and entrance effects
- **Emotion.js** — CSS-in-JS styling with styled components

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with Google Fonts
│   ├── page.tsx          # Main page composition
│   └── globals.css       # CSS variables and resets
└── components/
    ├── CustomCursor.tsx  # GSAP-animated custom cursor
    ├── ParticleField.tsx # Three.js WebGL particle system
    ├── Navbar.tsx        # Animated fixed navigation
    ├── Hero.tsx          # Hero with GSAP text reveals
    ├── Stats.tsx         # Animated counters (ScrollTrigger)
    ├── Services.tsx      # Services grid with hover effects
    ├── Process.tsx       # Process steps with timeline
    ├── Work.tsx          # Portfolio grid
    └── Footer.tsx        # Footer with links
```

## Key Features

### Three.js Particle Field
- 1800 glowing particles with custom GLSL shaders
- Sinusoidal floating animation driven by vertex shader
- Mouse parallax camera movement
- Transparent background blending with CSS

### GSAP Animations
- Hero text lines reveal with `translateY` clip
- Staggered entrance for service cards via `ScrollTrigger`
- Counter animation for stats on scroll
- Navbar fade-in on mount

### Emotion.js
- All styles as typed, co-located styled components
- Dynamic props for conditional styles
- CSS variables integration for theming
- `@emotion/styled` + `css` helper

## Customization

Update CSS variables in `globals.css`:
```css
:root {
  --green: #3d8c5e;      /* Brand accent */
  --bg: #0a0f0d;          /* Background */
  --text: #e8e4dc;        /* Primary text */
}
```

## Build

```bash
npm run build
npm start
```
