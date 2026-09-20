# Agent Aura

[![npm version](https://badge.fury.io/js/agent-aura.svg)](https://www.npmjs.com/package/agent-aura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English | [中文](README.zh-CN.md)**

Zero-dependency WebGL2 effects for Agent UIs:

- **motion** — AI-style glow mask
- **border** — neural energy field around a card
- **fire** — fire along a DOM border
- **burning** — overclock / burning-life fire

✨ **[Live Demo](https://wangmiaozero.github.io/agent-aura/)**

## Install

```bash
npm install agent-aura
```

Requires Node.js 18+ (Node 24 works). Browser needs WebGL2.

## Quick Start

```ts
import { aura } from 'agent-aura'

aura.fire('#card')
aura.burning('#agent')
aura.border('#card')
aura.motion('#hero')
```

That's it. Pass a selector or an `HTMLElement`. Canvas is mounted and the animation starts automatically.

Script tag / CDN:

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

After `npm run build`, local demos import the compressed file:

```html
<script type="module">
    import { aura } from './build/index.js'

    aura.fire('#card')
</script>
```

## Optional tweaks

```ts
aura.fire('#card', { particleCount: 800 })

aura.burning('#agent', { smokeCount: 300, glow: true })

aura.border('#card', { glowWidth: 90, speed: 1.2 })

aura.motion('#hero', { mode: 'dark', borderRadius: 16 })
```

Returned instance still has `pause()` / `start()` / `dispose()`.

```ts
const fx = aura.fire('#card')
fx.pause()
fx.dispose()
```

`container` is only needed when the canvas should live inside a wrapper instead of `document.body`:

```ts
aura.fire('#card', { container: '#stage' })
```

## Class API

Same effects, if you want to wire DOM yourself:

```ts
import { BurningFire, FireBorder, Motion, MotionBorder } from 'agent-aura'

FireBorder.attach('#card')
MotionBorder.attach('#card')
```

## Requirements

- WebGL2
- Modern browsers
- No runtime dependencies

## Development

```bash
npm install
npm run build  # minified ESM + IIFE + types
npm start      # serve index.html with ./build/*.js
```

`index.html` is the live gallery. It imports `./build/index.js` after build — no extra demo pages required.

## Publish

```bash
npm run build
npm publish --access public
```

GitHub Pages copies `index.html` + the compressed `build/*.js` into `build-demo/`.

## License

[MIT](./LICENSE)

Author: [wangmiao](https://github.com/wangmiaozero)

The `Motion` glow engine is adapted from [ai-motion](https://github.com/gaomeng1900/ai-motion) by Simon.
