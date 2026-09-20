# Agent Aura

[![npm version](https://badge.fury.io/js/agent-aura.svg)](https://www.npmjs.com/package/agent-aura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English | [中文](README.zh-CN.md)**

Zero-dependency WebGL2 effects for Agent UIs.

| API            | Effect                                    | Typical use                       |
| -------------- | ----------------------------------------- | --------------------------------- |
| `aura.glow`    | Stream glow mask                          | Workspace, dialog, card highlight |
| `aura.border`  | Neural energy field around a rounded rect | Thinking / reasoning / active     |
| `aura.fire`    | Fire along a DOM border                   | Danger / executing / ignition     |
| `aura.burning` | Heavy fire + smoke + heat haze            | Overclock / burning-life          |

✨ **[Live Demo](https://wangmiaozero.github.io/agent-aura/)** · **[API Reference](./docs/api.md)**

Demo and API pages switch English / 中文 (`?lang=en` or `?lang=zh`).

## Install

```bash
npm install agent-aura
```

Requires Node.js 18+ (Node 24 works). Browser needs WebGL2. ESM only (`"type": "module"`); CDN IIFE is also provided.

```ts
import { aura } from 'agent-aura'
```

## Quick Start

Pass a selector or `HTMLElement`. Canvas is mounted and the animation starts immediately.

```ts
import { aura } from 'agent-aura'

aura.glow('#hero')
aura.border('#card')
aura.fire('#card')
aura.burning('#agent')
```

CDN:

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

Same file on jsDelivr: `https://cdn.jsdelivr.net/npm/agent-aura/build/agent-aura.min.js`

## Options

```ts
aura.glow('#hero', {
    mode: 'dark',
    borderRadius: 16,
    borderWidth: 6,
    glowWidth: 140,
    colors: ['rgb(57, 182, 255)', 'rgb(189, 69, 251)', 'rgb(255, 87, 51)', 'rgb(255, 214, 0)'],
})

aura.border('#card', {
    container: '#stage',
    glowWidth: 90,
    borderRadius: 22,
    speed: 1.2,
})

aura.fire('#card', {
    container: '#stage',
    particleCount: 800,
})

aura.burning('#agent', {
    container: '#stage',
    smokeCount: 300,
    glow: true,
})
```

Full option tables: [docs/api.md](./docs/api.md).

## Lifecycle

```ts
const fx = aura.fire('#card')
fx.pause()
fx.start()
fx.dispose()
```

`attach()` already calls `start()`. Call `dispose()` on unmount or WebGL / rAF leak.

### React

```tsx
useEffect(() => {
    const fx = aura.border(el)
    return () => fx.dispose()
}, [])
```

### Vue 3

```ts
onMounted(() => {
    fx = aura.fire(card.value)
})
onBeforeUnmount(() => fx?.dispose())
```

## Canvas mounting

- `glow` — canvas is a child of the target (`position: absolute; inset: 0`)
- `border` / `fire` / `burning` — canvas overlays the target; pass `container` so it lives in your wrapper instead of `document.body`

```ts
aura.fire('#card', { container: '#stage' })
```

Needed when the card is inside overflow / transform / a scrolling pane. Details in [API → Canvas mounting](./docs/api.md#canvas-mounting).

## Class API

Same effects if you want to wire DOM yourself. `attach()` still handles mount + start. `new Glow()` / `new FireBorder()` does **not**.

```ts
import { BurningFire, FireBorder, Glow, MotionBorder } from 'agent-aura'

const fx = FireBorder.attach('#card', { particleCount: 800 })
MotionBorder.attach('#card', { container: '#stage' })
```

`Glow` also has `resize`, `autoResize`, `fadeIn`, `fadeOut`.

## Requirements

- WebGL2
- Modern Chromium / Firefox / Safari
- No runtime dependencies

Selector must match an `HTMLElement` (first match only). Missing target throws `agent-aura: target not found`.

## Performance

Fire cost scales with `particleCount` / `smokeCount`. Drop them on laptops. Pause off-screen instances. Do not stack many `burning` effects on weak GPUs.

## Development

```bash
npm install
npm run build  # minified ESM + IIFE + types
npm start      # serve index.html with ./build/*.js
```

`index.html` is the live gallery. It imports `./build/index.js` after build.

## Publish

```bash
npm publish
```

`prepublishOnly` runs `build`. GitHub Pages copies gallery HTML + `build/*.js` into `build-demo/`.

## License

[MIT](./LICENSE)

Author: [wangmiao](https://github.com/wangmiaozero)

The `Glow` engine is adapted from [ai-motion](https://github.com/gaomeng1900/ai-motion) by Simon.
