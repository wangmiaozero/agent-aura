# Contributing

## Env

- Node.js 18+
- Chrome / Firefox / Safari with WebGL2

## Setup

```bash
git clone https://github.com/wangmiaozero/agent-aura.git
cd agent-aura
npm install
npm run build
npm start
```

## Scripts

- `npm run build` — minified ESM (`build/index.js`) + IIFE (`build/agent-aura.min.js`) + d.ts
- `npm start` — serve `index.html`, which imports `./build/index.js`
- `npm run build:demo` — copy HTML + compressed JS for GitHub Pages
- `npm run typecheck`
- `npm run lint`

## Pull Requests

1. Fork and create a feature branch
2. Verify Motion / FireBorder / BurningFire in the browser
3. Use conventional commits (`feat:`, `fix:`, `docs:`)
4. Fill out the PR template

## Issues

**Bug reports:** browser, WebGL2 status, minimal repro
**Feature requests:** use case and proposed API
