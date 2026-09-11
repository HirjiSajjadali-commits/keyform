# KEYFORM — KF-TKL-01

A concept marketing site for a fictional CNC-machined mechanical keyboard, built around a
real-time 3D configurator. Portfolio piece by [Sajj Studio](https://sajjstudio.co.uk).

This is not a real product. There is no checkout. It's a demonstration of a working 3D
product configurator built entirely with free, open-source tools.

## Stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [react-three-fiber](https://r3f.docs.pmnd.rs/) + [drei](https://github.com/pmndrs/drei) — the 3D scene
- [three.js](https://threejs.org/)
- [GSAP](https://gsap.com/) + ScrollTrigger — animation and the scroll-driven assembly sequence
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- [Zustand](https://github.com/pmndrs/zustand) — configurator + theme state
- Fonts: [General Sans](https://www.fontshare.com/fonts/general-sans) (Fontshare) for display/body,
  [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (Google Fonts) for technical UI
- Deployed on [Vercel](https://vercel.com/)

## The procedural keyboard

The keyboard is not a modelled asset — it's generated from data. The ANSI TKL layout (87 keys)
is defined as rows of key descriptors (id, width in units, type), and the geometry is built by
looping over that layout: each key becomes its own `RoundedBox` mesh positioned from its running
offset in millimetres (1u = 19.05mm), so the same code produces the case footprint, the nav
cluster, and the arrow cluster. Colour, material and exploded-view offsets are all driven by the
same per-key data, which is what lets the configurator recolour every key group live.

More detail on the layout data and case/keycap geometry lands as the model is built out in
later phases — see the project spec for the full breakdown.

## Local setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Deployed to Vercel from this repository; pushes to `main` redeploy automatically.

## Status

Early scaffold — theme system, fonts and empty section shells are in place. The 3D keyboard,
configurator, scroll story and full marketing content land in the phases that follow (see
project history / commits for progress).
