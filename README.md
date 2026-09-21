# Agent Aura

[![npm version](https://badge.fury.io/js/agent-aura.svg)](https://www.npmjs.com/package/agent-aura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**English | [中文](README.zh-CN.md)**

Zero-dependency effects for Agent UIs.

| API            | Effect                                    | Typical use                       |
| -------------- | ----------------------------------------- | --------------------------------- |
| `aura.glow`    | Stream glow mask                          | Workspace, dialog, card highlight |
| `aura.border`  | Neural energy field around a rounded rect | Thinking / reasoning / active     |
| `aura.fire`    | Fire along a DOM border                   | Danger / executing / ignition     |
| `aura.burning` | Heavy fire + smoke + heat haze            | Overclock / burning-life          |
| `aura.shape`   | Shape-aware WebGL2 ribbon aura            | Circle / pill / polygon           |
| `aura.water`   | Shape-aware WebGL2 water field            | Streaming / thinking / liquid     |
| `aura.cultivation` | Shape-aware WebGL2 golden mist         | Immortal UI / character panels    |
| `aura.demonic` | Shape-aware WebGL2 purple-black mist      | Overdrive / forbidden / overload  |
| `aura.thunder`  | Shape-aware thunder / tribulation arcs    | Ultra-thinking / tribulation      |
| `aura.void`     | Shape-aware void / blackhole ribbon       | Abyss / overload / event horizon  |
| `aura.glitch`   | Shape-aware RGB tear / collapse glitch    | Crash / retry / system error      |

✨ **[Live Demo](https://wangmiaozero.github.io/agent-aura/)** · **[API Reference](./docs/api.md)**

Demo and API pages default to English. Switch with `?lang=en` or `?lang=zh`.

## Install

```bash
npm install agent-aura
```

Requires Node.js 18+ (Node 24 works). `glow` / `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` need WebGL2. ESM only (`"type": "module"`); CDN IIFE is also provided.

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
aura.shape('#avatar')
aura.water('#stream')
aura.cultivation('#dao')
aura.demonic('#mo')
aura.thunder('#jie')
aura.void('#hole')
aura.glitch('#crash')
```

CDN:

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

Same file on jsDelivr: `https://cdn.jsdelivr.net/npm/agent-aura/build/agent-aura.min.js`

## Prompts for AI

The eleven demo cards and the API page have an editable **Copy AI prompt**. Change the selector / area, then paste into Cursor / Claude so it will:

1. `npm install agent-aura`
2. Wire it into this project
3. Attach the effect to the UI area you specify

Full prompts: [API → Prompts for AI](./docs/api.md#prompts-for-ai)

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

aura.shape('#avatar', {
    container: '#stage',
    offset: 5,
    auraWidth: 33,
    outerGlowWidth: 86,
    dustCount: 75,
    speed: 1,
})

aura.water('#stream', {
    container: '#stage',
    offset: 7,
    fieldCount: 180,
    detailCount: 110,
    speed: 1,
})

aura.cultivation('#dao', {
    container: '#stage',
    offset: 7,
    fieldCount: 180,
    detailCount: 110,
    speed: 1,
})

aura.demonic('#mo', {
    container: '#stage',
    offset: 7,
    fieldCount: 180,
    detailCount: 110,
    speed: 1,
})

aura.thunder('#jie', {
    container: '#stage',
    offset: 8,
    particleCount: 90,
    maxBranches: 16,
})

aura.void('#hole', {
    container: '#stage',
    offset: 6,
    mistCount: 190,
    sparkCount: 95,
})

aura.glitch('#crash', {
    container: '#stage',
    offset: 5,
    fragmentCount: 130,
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
- `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` — canvas overlays the target; pass `container` so it lives in your wrapper instead of `document.body`

```ts
aura.fire('#card', { container: '#stage' })
aura.shape('#avatar', { container: '#stage' })
aura.water('#stream', { container: '#stage' })
aura.cultivation('#dao', { container: '#stage' })
aura.demonic('#mo', { container: '#stage' })
aura.thunder('#jie', { container: '#stage' })
aura.void('#hole', { container: '#stage' })
aura.glitch('#crash', { container: '#stage' })
```

Pass `container` for `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` when the card is inside overflow / transform / a scrolling pane. Details in [API → Mounting](./docs/api.md#mounting).

## Class API

Same effects if you want to wire DOM yourself. `attach()` still handles mount + start. `new Glow()` / `new FireBorder()` does **not**.

```ts
import { BurningFire, CultivationAura, DemonicAura, FireBorder, GlitchAura, Glow, MotionBorder, ShapeAura, ThunderAura, VoidAura, WaterAura } from 'agent-aura'

const fx = FireBorder.attach('#card', { particleCount: 800 })
MotionBorder.attach('#card', { container: '#stage' })
ShapeAura.attach('#avatar')
WaterAura.attach('#stream')
CultivationAura.attach('#dao', { container: '#stage' })
DemonicAura.attach('#mo')
ThunderAura.attach('#jie', { container: '#stage' })
VoidAura.attach('#hole', { container: '#stage' })
GlitchAura.attach('#crash', { container: '#stage' })
```

`Glow` also has `resize`, `autoResize`, `fadeIn`, `fadeOut`.

## Requirements

- `glow` / `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch`: WebGL2
- Modern Chromium / Firefox / Safari
- No runtime dependencies

Selector must match an `HTMLElement` (first match only). Missing target throws `agent-aura: target not found`.

## Performance

Fire cost scales with `particleCount` / `smokeCount`. Drop them on laptops. `water` / `cultivation` / `demonic` share the ShapeField WebGL2 engine — keep `fieldCount` / `detailCount` modest. Pause off-screen instances. Do not stack many `burning` effects on weak GPUs.

## Development

```bash
npm install
npm run build  # minified ESM + IIFE + types
npm start      # serve index.html with ./build/*.js
```

`index.html` is the catalog. Each effect has its own page (`glow.html`, `shape.html`, …) that imports `./build/index.js` after build.

## Publish

```bash
npm publish
```

`prepublishOnly` runs `build`. GitHub Pages copies gallery HTML + `build/*.js` into `build-demo/`.

## License

[MIT](./LICENSE)

Author: [wangmiao](https://github.com/wangmiaozero)

The `Glow` engine is adapted from [ai-motion](https://github.com/gaomeng1900/ai-motion) by Simon.
