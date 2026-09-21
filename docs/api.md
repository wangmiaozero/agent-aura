# Agent Aura API

**English** | [中文](./api.zh-CN.md)

Zero-dependency effects. `glow` / `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` need WebGL2. No runtime npm dependencies.

- Demo: https://wangmiaozero.github.io/agent-aura/
- npm: https://www.npmjs.com/package/agent-aura

## Contents

- [Install](#install)
- [Prompts for AI](#prompts-for-ai)
- [Entry](#entry)
- [aura](#aura)
- [Shared types](#shared-types)
- [Instance lifecycle](#instance-lifecycle)
- [Mounting](#mounting)
- [aura.glow / Glow](#auraglow--glow)
- [aura.border / MotionBorder](#auraborder--motionborder)
- [aura.fire / FireBorder](#aurafire--fireborder)
- [aura.burning / BurningFire](#auraburning--burningfire)
- [aura.shape / ShapeAura](#aurashape--shapeaura)
- [aura.water / WaterAura](#aurawater--wateraura)
- [aura.cultivation / CultivationAura](#auracultivation--cultivationaura)
- [aura.demonic / DemonicAura](#aurademonic--demonicaura)
- [aura.thunder / ThunderAura](#aurathunder--thunderaura)
- [aura.void / VoidAura](#auravoid--voidaura)
- [aura.glitch / GlitchAura](#auraglitch--glitchaura)
- [Framework usage](#framework-usage)
- [Errors](#errors)
- [Performance](#performance)

## Install

```bash
npm install agent-aura
```

ESM:

```ts
import { aura } from 'agent-aura'
```

CDN (IIFE, global `AgentAura`):

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    const fx = AgentAura.aura.fire('#card')
</script>
```

jsDelivr: `https://cdn.jsdelivr.net/npm/agent-aura/build/agent-aura.min.js`

The package is `"type": "module"`: ESM + browser IIFE only. No CJS.

## Prompts for AI

Copy the whole block for one effect into Cursor / Claude. It should `npm install agent-aura`, wire it into this project, and attach the effect to the UI area you specify. The live demo and API pages let you edit the prompt, then copy it.

### Glow

```
Install the npm package agent-aura in this project and attach the Glow stream-mask effect to the UI area I specified (the component or element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, browser needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it up with the project's real framework. Edit the current area in place. Do not create an unrelated demo page.

const fx = aura.glow(target, {
  mode: 'dark', // 'dark' on dark bg, 'light' on light bg; no style works on both
  borderRadius: 16, // match the target radius
  borderWidth: 6,
  glowWidth: 140,
})

Rules
1. target is a CSS selector or HTMLElement. Missing node throws agent-aura: target not found
2. Glow inserts a canvas INSIDE the target (position:absolute; inset:0). Make static targets relative. Glow has NO container option
3. Do not new Glow() unless you manually append + start. Prefer aura.glow() or Glow.attach()
4. Always fx.dispose() on unmount or WebGL / rAF leaks. React: effect cleanup. Vue: onBeforeUnmount
5. Off-screen: pause() / start()
6. Custom colors must be exactly 4 rgb(r, g, b) strings; no hex / hsl
7. Docs: https://www.npmjs.com/package/agent-aura
```

### Border

```
Install the npm package agent-aura in this project and attach the Motion Border neural energy field to the UI area I specified (the card or container currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, browser needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it up with the project's real framework. Edit the current area in place. Do not create an unrelated demo page.

const fx = aura.border(target, {
  container: stage, // required when the card is in overflow / transform / a scrolling pane
  glowPadding: 64,
  glowWidth: 90,
  borderWidth: 2,
  borderRadius: 22, // match the card radius
  speed: 1.2,
})

Rules
1. Canvas sits outside the target; glow spills outward. Mount order: container → non-body parent → document.body
2. If the card lives in overflow / transform / a scrolling pane, pass container. It must cover the card and be a positioning context (relative / absolute / fixed)
3. Do not new MotionBorder(). Use aura.border() or MotionBorder.attach()
4. Always fx.dispose() on unmount. React: effect cleanup. Vue: onBeforeUnmount
5. Off-screen: pause() / start(). setTarget / setContainer can retarget live
6. Docs: https://www.npmjs.com/package/agent-aura
```

### Fire

```
Install the npm package agent-aura in this project and attach the Fire burning-border effect to the UI area I specified (the component or element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, browser needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it up with the project's real framework. Edit the current area in place. Do not create an unrelated demo page.

const fx = aura.fire(target, {
  container: stage, // required in overflow / transform / scrolling panes
  particleCount: 800, // 600–1000 on laptops
})

Rules
1. Fire burns along the target border. Smoke and heat haze are forced off; use aura.burning for those
2. Canvas mounts on container or document.body and fills that box / the viewport; particles sample the target border
3. Pass container when the card is in overflow / transform / a scrolling pane
4. Do not new FireBorder(). Use aura.fire() or FireBorder.attach()
5. Always fx.dispose() on unmount. React: effect cleanup. Vue: onBeforeUnmount
6. Off-screen: pause(). Do not stack many fire instances
7. Docs: https://www.npmjs.com/package/agent-aura
```

### Burning

```
Install the npm package agent-aura in this project and attach the Burning overclock-life effect to the UI area I specified (the component or element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, browser needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it up with the project's real framework. Edit the current area in place. Do not create an unrelated demo page.

const fx = aura.burning(target, {
  container: stage, // required in overflow / transform / scrolling panes
  particleCount: 1800, // 600–1000 on laptops
  smokeCount: 300, // 150–300 on laptops; 0 disables smoke
  glow: true, // background heat haze
})

Rules
1. Heavier fire + smoke + heat haze. More GPU than aura.fire
2. Canvas mounts on container or document.body and fills that box / the viewport; particles sample the target border
3. Pass container when the card is in overflow / transform / a scrolling pane
4. Do not new BurningFire(). Use aura.burning() or BurningFire.attach()
5. Always fx.dispose() on unmount. React: effect cleanup. Vue: onBeforeUnmount
6. Off-screen: pause(). Do not stack multiple burning instances on weak GPUs
7. Docs: https://www.npmjs.com/package/agent-aura
```

### Shape

```
Install agent-aura and attach the shape-aware aura to the UI element I specify.

- Install: npm install agent-aura
- Import: import { aura } from 'agent-aura'
- Use aura.shape(target, { container: stage, offset: 5, auraWidth: 33, dustCount: 75, speed: 1 })
- Read the target border-radius and clip-path automatically; support circles, pills, rounded rectangles, and polygons
- Always fx.dispose() on unmount; pause() off-screen and start() when visible
- Edit the current project directly; do not create an unrelated demo page
```

### Water

```
Install agent-aura and attach the liquid Water Aura to the UI element I specify.

- Install: npm install agent-aura
- Import: import { aura } from 'agent-aura'
- Use aura.water(target, { waterSize: 10, dropCount: 9, speed: 6, drops: true })
- Read the target border-radius and clip-path automatically; SVG distortion, no WebGL2 required
- Always fx.dispose() on unmount; pause() off-screen and start() when visible
- Edit the current project directly; do not create an unrelated demo page
```

## Entry

| Export                                                                                                                       | Role                                                                |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `aura`                                                                                                                       | One-call API. Prefer this.                                          |
| `default`                                                                                                                    | Same as `aura`                                                      |
| `Glow`                                                                                                                       | Glow-mask class                                                     |
| `MotionBorder`                                                                                                               | Neural energy-border class                                          |
| `FireBorder`                                                                                                                 | Fire-along-border class                                             |
| `BurningFire`                                                                                                                | Overclock / burning-life class                                      |
| `ShapeAura`                                                                                                                  | Shape-aware WebGL2 ribbon aura class                                |
| `WaterAura`                                                                                                                  | Shape-aware liquid water class                                      |
| `CultivationAura`                                                                                                           | Shape-aware golden cultivation class                               |
| `DemonicAura`                                                                                                               | Shape-aware purple-black demonic class                             |
| `ThunderAura`                                                                                                               | Shape-aware thunder / tribulation class                            |
| `VoidAura`                                                                                                                  | Shape-aware void / blackhole ribbon class                          |
| `GlitchAura`                                                                                                                | Shape-aware RGB tear / collapse class                              |
| `TargetRef`                                                                                                                  | `string \| HTMLElement`                                             |
| `AttachOptions<T>`                                                                                                           | Options without `target`/`container`; `container` may be a selector |
| `GlowOptions` / `MotionBorderOptions` / `FireBorderOptions` / `BurningFireOptions` / `ShapeAuraOptions` / `WaterAuraOptions` / `CultivationAuraOptions` / `DemonicAuraOptions` / `ThunderAuraOptions` / `VoidAuraOptions` / `GlitchAuraOptions` | Per-effect options                                                  |

`aura.x(target, options)` is `X.attach(target, options)`.

## aura

```ts
aura.glow(target, options?: GlowOptions): Glow
aura.border(target, options?: AttachOptions<MotionBorderOptions>): MotionBorder
aura.fire(target, options?: AttachOptions<FireBorderOptions>): FireBorder
aura.burning(target, options?: AttachOptions<BurningFireOptions>): BurningFire
aura.shape(target, options?: AttachOptions<ShapeAuraOptions>): ShapeAura
aura.water(target, options?: AttachOptions<WaterAuraOptions>): WaterAura
aura.cultivation(target, options?: AttachOptions<CultivationAuraOptions>): CultivationAura
aura.demonic(target, options?: AttachOptions<DemonicAuraOptions>): DemonicAura
aura.thunder(target, options?: AttachOptions<ThunderAuraOptions>): ThunderAura
aura.void(target, options?: AttachOptions<VoidAuraOptions>): VoidAura
aura.glitch(target, options?: AttachOptions<GlitchAuraOptions>): GlitchAura
```

`target` is a CSS selector or `HTMLElement`. Missing node throws.

## Shared types

```ts
type TargetRef = string | HTMLElement

type AttachOptions<T> = Omit<T, 'target' | 'container'> & {
    container?: TargetRef
}
```

Do not pass `target` into `attach()` / `aura.*` — the first argument is the target. `container` may be a selector.

Class constructors still take `target?: HTMLElement` and `container?: HTMLElement` (elements only, not selectors) and do **not** auto-append or `start()`.

## Instance lifecycle

All six instances expose:

| Method      | Behavior                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------- |
| `start()`   | Starts the rAF loop. `attach()` already calls this                                        |
| `pause()`   | Stops animation; canvas / wrapper stays                                                   |
| `dispose()` | Stops loop, frees resources, disconnects observers, removes canvas or wrapper. Idempotent |

`start()` / `pause()` after `dispose()` throw.

```ts
const fx = aura.fire('#card')
fx.pause()
fx.start()
fx.dispose()
```

Readonly:

- `Glow.element` — the canvas (`HTMLElement`)
- `ShapeAura` / `WaterAura` / `CultivationAura` / `DemonicAura` / `ThunderAura` / `VoidAura` / `GlitchAura` — `element` is `HTMLCanvasElement`
- others — `element` is `HTMLCanvasElement`

Always `dispose()` on unmount or you leak WebGL / rAF.

## Mounting

| API                | Parent                                                  | Positioning                                        | Follow                             |
| ------------------ | ------------------------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| `glow`             | **inside target**                                       | `absolute; inset: 0`                               | target size                        |
| `border`           | `container`, else non-body parent, else `document.body` | `absolute` in container, else `fixed`              | target rect + `glowPadding`        |
| `fire` / `burning` | `container` or `document.body`                          | fills container (`absolute`) or viewport (`fixed`) | particles sampled on target border |
| `thunder`          | `container` or `document.body`                          | fills container (`absolute`) or viewport (`fixed`) | lightning follows target outline   |
| `void`             | `container` or `document.body`                          | fills container (`absolute`) or viewport (`fixed`) | void ribbon follows target outline |
| `glitch`           | `container` or `document.body`                          | fills container (`absolute`) or viewport (`fixed`) | glitch ribbon follows target outline |
| `shape` / `water` / `cultivation` / `demonic` | `container` or `document.body`     | fills container (`absolute`) or viewport (`fixed`) | field follows target outline       |

`attach()` sets a static mount parent to `position: relative`.

For scroll containers, overflow clip, or keeping the effect with the card, pass `container` for `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch`:

```ts
aura.border('#card', { container: '#stage' })
aura.fire('#card', { container: '#stage' })
aura.shape('#avatar', { container: '#stage' })
aura.thunder('#card', { container: '#stage' })
aura.void('#hole', { container: '#stage' })
aura.glitch('#crash', { container: '#stage' })
```

`#stage` must be a positioning context and cover the card.

## aura.glow / Glow

Stream glow mask. Canvas is **inserted into the target** and fills it. Use for workspaces, dialogs, card highlight.

```ts
const fx = aura.glow('#hero', {
    mode: 'dark',
    borderRadius: 16,
    borderWidth: 6,
    glowWidth: 140,
})
```

### GlowOptions

| Field          | Type                           | Default            | Notes                                                                |
| -------------- | ------------------------------ | ------------------ | -------------------------------------------------------------------- |
| `width`        | `number`                       | `600`              | CSS pixels. Overridden by ResizeObserver after `attach()`            |
| `height`       | `number`                       | `600`              | CSS pixels                                                           |
| `ratio`        | `number`                       | `devicePixelRatio` | May be `< 1` to lower resolution                                     |
| `mode`         | `'dark' \| 'light'`            | `'light'`          | Dark bg → `dark`, light bg → `light`. No style works on both         |
| `colors`       | 4-tuple of `rgb(...)`          | see below          | Exactly 4 CSS `rgb(r, g, b)` strings                                 |
| `borderWidth`  | `number`                       | `8`                | Solid stroke                                                         |
| `glowWidth`    | `number`                       | `200`              | Glow falloff width                                                   |
| `borderRadius` | `number`                       | `8`                | Corner radius                                                        |
| `classNames`   | `string`                       | —                  | Canvas class                                                         |
| `styles`       | `Partial<CSSStyleDeclaration>` | —                  | Merged onto canvas. `attach()` presets `position/inset/width/height` |
| `skipGreeting` | `boolean`                      | `false`            | Suppress console greeting (discouraged)                              |

Default colors:

```ts
;['rgb(57, 182, 255)', 'rgb(189, 69, 251)', 'rgb(255, 87, 51)', 'rgb(255, 214, 0)']
```

Colors must be `rgb(r, g, b)`. Hex / hsl throw `Invalid color format`.

`glow` has **no** `container`. Canvas is always a child of the target.

### Glow methods

| Method                              | Notes                                                    |
| ----------------------------------- | -------------------------------------------------------- |
| `Glow.attach(target, options?)`     | Resolve node, append canvas, `autoResize`, `start`       |
| `start()` / `pause()` / `dispose()` | Lifecycle                                                |
| `resize(width, height, ratio?)`     | Rebuild buffers. If not started, only stores options     |
| `autoResize(sourceElement)`         | `ResizeObserver` on that element                         |
| `fadeIn()`                          | 300ms opacity 0→1 + scale 1.2→1. Returns `Promise<void>` |
| `fadeOut()`                         | Inverse. Returns `Promise<void>`                         |

Internal cap ~32fps.

## aura.border / MotionBorder

Continuous shader energy field around a rounded rect, glow spilling outward. Use for thinking / reasoning / agent-active states.

```ts
aura.border('#neural-card', {
    container: '#neural-preview',
    glowPadding: 64,
    glowWidth: 90,
    borderWidth: 2,
    borderRadius: 22,
    speed: 1.2,
})
```

### MotionBorderOptions

| Field          | Type                           | Default            | Notes                          |
| -------------- | ------------------------------ | ------------------ | ------------------------------ |
| `glowPadding`  | `number`                       | `110`              | Extra canvas around the target |
| `borderWidth`  | `number`                       | `2.2`              | Core band                      |
| `glowWidth`    | `number`                       | `115`              | Outer spill                    |
| `borderRadius` | `number`                       | `28`               | Match the card radius          |
| `speed`        | `number`                       | `1`                | Time scale                     |
| `zIndex`       | `number`                       | `10`               | Canvas z-index                 |
| `classNames`   | `string`                       | —                  |                                |
| `styles`       | `Partial<CSSStyleDeclaration>` | —                  |                                |
| `skipGreeting` | `boolean`                      | `false`            |                                |
| `container`    | `TargetRef`                    | see mounting table | `attach` / `aura.border` only  |

DPR is capped at 2.

### MotionBorder methods

| Method                                  | Notes                                 |
| --------------------------------------- | ------------------------------------- |
| `MotionBorder.attach(target, options?)` | Mount and `start`                     |
| `setTarget(el)`                         | Follow a different node               |
| `setContainer(el)`                      | Reparent; switches `absolute`/`fixed` |
| `start()` / `pause()` / `dispose()`     | Lifecycle                             |

Listens to `resize`, capture-phase `scroll`, and ResizeObserver on target/container.

## aura.fire / FireBorder

Fire along a DOM border: core, outer flame, sparks. Use for danger / executing / ignition.

Internally `preset: 'border'`. Forces `smokeCount: 0`, `glow: false`.

```ts
aura.fire('#fire-card', {
    container: '#fire-preview',
    particleCount: 800,
    padding: 1,
})
```

### FireBorderOptions

| Field           | Type                           | Default         | Notes                                      |
| --------------- | ------------------------------ | --------------- | ------------------------------------------ |
| `particleCount` | `number`                       | `1300`          | Flame particles. Higher = denser, more GPU |
| `padding`       | `number`                       | `1`             | Inset of the sampled border vs target box  |
| `zIndex`        | `number`                       | `10`            |                                            |
| `classNames`    | `string`                       | —               |                                            |
| `styles`        | `Partial<CSSStyleDeclaration>` | —               |                                            |
| `skipGreeting`  | `boolean`                      | `false`         |                                            |
| `onFrame`       | `(time: number) => void`       | —               | Per-frame hook; `time` in seconds          |
| `container`     | `TargetRef`                    | `document.body` | `attach` / `aura.fire` only                |

No `smokeCount` / `glow`. Use `burning` for smoke and heat haze.

### FireBorder methods

`attach` / `setTarget` / `setContainer` / `start` / `pause` / `dispose`.

Without `container`, canvas covers the viewport; particle space is target-relative to that view. Scroll updates the border.

## aura.burning / BurningFire

Heavier fire + smoke + background heat. Use for overclock / burning-life inference.

Internally `preset: 'burning'`.

```ts
aura.burning('#burn-card', {
    container: '#burn-preview',
    particleCount: 1800,
    smokeCount: 300,
    glow: true,
})
```

### BurningFireOptions

| Field           | Type                           | Default         | Notes                          |
| --------------- | ------------------------------ | --------------- | ------------------------------ |
| `particleCount` | `number`                       | `2200`          | Flame particles                |
| `smokeCount`    | `number`                       | `520`           | `0` disables smoke             |
| `glow`          | `boolean`                      | `true`          | Background heat-haze quad      |
| `padding`       | `number`                       | `2`             | Border sample inset            |
| `zIndex`        | `number`                       | `10`            |                                |
| `classNames`    | `string`                       | —               |                                |
| `styles`        | `Partial<CSSStyleDeclaration>` | —               |                                |
| `skipGreeting`  | `boolean`                      | `false`         |                                |
| `onFrame`       | `(time: number) => void`       | —               |                                |
| `container`     | `TargetRef`                    | `document.body` | `attach` / `aura.burning` only |

Smoke layer is created only if `smokeCount > 0`.

Methods match `FireBorder`.

## aura.shape / ShapeAura

A shape-aware AI aura. Ported from the Three.js shape-aware-ai-aura demo into zero-dependency WebGL2: width-aware ribbon + outer halo + energy dust. Reads the target `border-radius` and `clip-path`.

```ts
const fx = aura.shape('#agent', {
    container: '#stage',
    offset: 5,
    auraWidth: 33,
    outerGlowWidth: 86,
    dustCount: 75,
    pathSamples: 500,
    speed: 1,
})
```

### ShapeAuraOptions

| Field            | Type                           | Default | Notes                           |
| ---------------- | ------------------------------ | ------- | ------------------------------- |
| `container`      | `HTMLElement`                  | —       | Positioning host for the canvas |
| `offset`         | `number`                       | `5`     | Outward offset of the ribbon    |
| `auraWidth`      | `number`                       | `33`    | Main ribbon half-width in px    |
| `outerGlowWidth` | `number`                       | `86`    | Outer halo half-width in px     |
| `dustCount`      | `number`                       | `75`    | Energy-dust particle count      |
| `pathSamples`    | `number`                       | `500`   | Outline sample count            |
| `speed`          | `number`                       | `1`     | Global time scale               |
| `cornerSegments` | `number`                       | `24`    | Corner sampling segments        |
| `zIndex`         | `number`                       | `20`    | Canvas z-index                  |
| `classNames`     | `string`                       | —       | Canvas class                    |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | Canvas inline styles            |
| `skipGreeting`   | `boolean`                      | `false` | Disable console greeting        |

Canvas mounts on `container` or `document.body` and fills that view. Supports `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`.

## aura.water / WaterAura

A shape-aware liquid aura. Ported from the Three.js shape-aura demo into zero-dependency WebGL2 (theme: `water`): contour bands + mist field + droplet particles. Reads the target `border-radius` and `clip-path`.

```ts
const fx = aura.water('#agent', {
    container: '#stage',
    offset: 7,
    fieldCount: 180,
    detailCount: 110,
    pathSamples: 420,
    speed: 1,
})
```

### WaterAuraOptions

| Field            | Type                           | Default | Notes                           |
| ---------------- | ------------------------------ | ------- | ------------------------------- |
| `container`      | `HTMLElement`                  | —       | Positioning host for the canvas |
| `offset`         | `number`                       | `7`     | Outward offset of the water ring|
| `fieldCount`     | `number`                       | `180`   | Outer mist particle count       |
| `detailCount`    | `number`                       | `110`   | Droplets along the outline      |
| `pathSamples`    | `number`                       | `420`   | Outline sample count            |
| `speed`          | `number`                       | `1`     | Global time scale               |
| `cornerSegments` | `number`                       | `20`    | Corner sampling segments        |
| `zIndex`         | `number`                       | `20`    | Canvas z-index                  |
| `classNames`     | `string`                       | —       | Canvas class                    |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | Canvas inline styles            |
| `skipGreeting`   | `boolean`                      | `false` | Disable console greeting        |

Canvas mounts on `container` or `document.body` and fills that view. Supports `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`.


## aura.cultivation / CultivationAura

A shape-aware golden cultivation aura. Same ShapeField engine as water / demonic (theme: `immortal`): spirit veins + mist field + spirit motes. Reads the target `border-radius` and `clip-path`.

```ts
const fx = aura.cultivation('#agent', {
    container: '#stage',
    offset: 7,
    fieldCount: 180,
    detailCount: 110,
    pathSamples: 420,
    speed: 1,
})
```

### CultivationAuraOptions

| Field            | Type                           | Default | Notes                                      |
| ---------------- | ------------------------------ | ------- | ------------------------------------------ |
| `container`      | `HTMLElement`                  | —       | Positioning host for the canvas            |
| `offset`         | `number`                       | `7`     | Outward offset of the spirit ring          |
| `fieldCount`     | `number`                       | `180`   | Outer mist particle count                  |
| `detailCount`    | `number`                       | `110`   | Spirit motes along the outline             |
| `pathSamples`    | `number`                       | `420`   | Outline sample count                       |
| `speed`          | `number`                       | `1`     | Global time scale                          |
| `cornerSegments` | `number`                       | `20`    | Corner sampling segments                   |
| `mistCount`      | `number`                       | —       | Deprecated alias of `fieldCount`           |
| `spiritCount`    | `number`                       | —       | Deprecated alias of `detailCount`          |
| `auraSamples`    | `number`                       | —       | Deprecated alias of `pathSamples`          |
| `zIndex`         | `number`                       | `20`    | Canvas z-index                             |
| `classNames`     | `string`                       | —       | Canvas class                               |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | Canvas inline styles                       |
| `skipGreeting`   | `boolean`                      | `false` | Disable console greeting                   |

Canvas mounts on `container` or `document.body` and fills that view. Supports `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`.


## aura.demonic / DemonicAura

A shape-aware purple-black demonic aura. Same ShapeField engine as water / cultivation (theme: `demonic`): violet veins + mist field + ember particles. Reads the target `border-radius` and `clip-path`.

```ts
const fx = aura.demonic('#agent', {
    container: '#stage',
    offset: 7,
    fieldCount: 180,
    detailCount: 110,
    pathSamples: 420,
    speed: 1,
})
```

### DemonicAuraOptions

| Field            | Type                           | Default | Notes                           |
| ---------------- | ------------------------------ | ------- | ------------------------------- |
| `container`      | `HTMLElement`                  | —       | Positioning host for the canvas |
| `offset`         | `number`                       | `7`     | Outward offset of the demonic ring |
| `fieldCount`     | `number`                       | `180`   | Outer mist particle count       |
| `detailCount`    | `number`                       | `110`   | Ember particles along the outline |
| `pathSamples`    | `number`                       | `420`   | Outline sample count            |
| `speed`          | `number`                       | `1`     | Global time scale               |
| `cornerSegments` | `number`                       | `20`    | Corner sampling segments        |
| `zIndex`         | `number`                       | `20`    | Canvas z-index                  |
| `classNames`     | `string`                       | —       | Canvas class                    |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | Canvas inline styles            |
| `skipGreeting`   | `boolean`                      | `false` | Disable console greeting        |

Canvas mounts on `container` or `document.body` and fills that view. Supports `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`.


## aura.thunder / ThunderAura

A shape-aware thunder aura. Ported from the Three.js thunder demo into zero-dependency WebGL2: lightning border + energy particles + outward arcs. Reads the target `border-radius` and `clip-path`.

```ts
const fx = aura.thunder('#agent', {
    container: '#stage',
    offset: 8,
    particleCount: 90,
    maxBranches: 16,
    branchInterval: 85,
})
```

### ThunderAuraOptions

| Field            | Type                           | Default | Notes                              |
| ---------------- | ------------------------------ | ------- | ---------------------------------- |
| `container`      | `HTMLElement`                  | —       | Positioning host for the canvas    |
| `offset`         | `number`                       | `8`     | Outward offset of the lightning ring |
| `particleCount`  | `number`                       | `90`    | Energy particles along the outline |
| `maxBranches`    | `number`                       | `16`    | Max simultaneous outward arcs      |
| `branchInterval` | `number`                       | `85`    | Branch spawn interval baseline (ms)|
| `cornerSegments` | `number`                       | `12`    | Corner sampling segments           |
| `zIndex`         | `number`                       | `20`    | Canvas z-index                     |
| `classNames`     | `string`                       | —       | Canvas class                       |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | Canvas inline styles               |
| `skipGreeting`   | `boolean`                      | `false` | Disable console greeting           |

Canvas mounts on `container` or `document.body` and fills that view. Supports `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`.

## aura.void / VoidAura

A shape-aware void / blackhole aura. Ported from the Three.js void-blackhole demo into zero-dependency WebGL2: dark shadow ribbon + event horizon + violet highlights + void mist + sparks. Reads the target `border-radius` and `clip-path`.

```ts
const fx = aura.void('#agent', {
    container: '#stage',
    offset: 6,
    shadowWidth: 78,
    horizonWidth: 30,
    highlightWidth: 12,
    mistCount: 190,
    sparkCount: 95,
})
```

### VoidAuraOptions

| Field            | Type                           | Default | Notes                              |
| ---------------- | ------------------------------ | ------- | ---------------------------------- |
| `container`      | `HTMLElement`                  | —       | Positioning host for the canvas    |
| `offset`         | `number`                       | `6`     | Outward offset of the ring in px   |
| `shadowWidth`    | `number`                       | `78`    | Shadow ribbon half-width in px     |
| `horizonWidth`   | `number`                       | `30`    | Event-horizon ribbon half-width    |
| `highlightWidth` | `number`                       | `12`    | Highlight ribbon half-width        |
| `mistCount`      | `number`                       | `190`   | Void mist particle count           |
| `sparkCount`     | `number`                       | `95`    | Spark particle count               |
| `pathSamples`    | `number`                       | `520`   | Outline sample count               |
| `speed`          | `number`                       | `1`     | Global time scale                  |
| `cornerSegments` | `number`                       | `24`    | Corner sampling segments           |
| `zIndex`         | `number`                       | `20`    | Canvas z-index                     |
| `classNames`     | `string`                       | —       | Canvas class                       |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | Canvas inline styles               |
| `skipGreeting`   | `boolean`                      | `false` | Disable console greeting           |

Canvas mounts on `container` or `document.body` and fills that view. Supports `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`.

## aura.glitch / GlitchAura

A shape-aware glitch / collapse aura. Ported from the Three.js glitch-collapse demo into zero-dependency WebGL2: RGB split + digital tears + edge dropouts + square data fragments. Reads the target `border-radius` and `clip-path`.

```ts
const fx = aura.glitch('#agent', {
    container: '#stage',
    offset: 5,
    outerWidth: 45,
    rgbWidth: 11,
    fragmentCount: 130,
})
```

### GlitchAuraOptions

| Field               | Type                           | Default | Notes                              |
| ------------------- | ------------------------------ | ------- | ---------------------------------- |
| `container`         | `HTMLElement`                  | —       | Positioning host for the canvas    |
| `offset`            | `number`                       | `5`     | Outward offset of the ring in px   |
| `outerWidth`        | `number`                       | `45`    | Outer noise ribbon half-width      |
| `rgbWidth`          | `number`                       | `11`    | RGB-split ribbon half-width        |
| `fragmentCount`     | `number`                       | `130`   | Data-fragment particle count       |
| `burstIntervalMin`  | `number`                       | `900`   | Min burst interval in ms           |
| `burstIntervalMax`  | `number`                       | `2600`  | Max burst interval in ms           |
| `burstDuration`     | `number`                       | `140`   | Burst duration in ms               |
| `pathSamples`       | `number`                       | `500`   | Outline sample count               |
| `speed`             | `number`                       | `1`     | Global time scale                  |
| `cornerSegments`    | `number`                       | `22`    | Corner sampling segments           |
| `zIndex`            | `number`                       | `20`    | Canvas z-index                     |
| `classNames`        | `string`                       | —       | Canvas class                       |
| `styles`            | `Partial<CSSStyleDeclaration>` | —       | Canvas inline styles               |
| `skipGreeting`      | `boolean`                      | `false` | Disable console greeting           |

Canvas mounts on `container` or `document.body` and fills that view. Supports `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`.

## Framework usage

Always `dispose()` on unmount.

### React

```tsx
import { aura } from 'agent-aura'
import { useEffect, useRef } from 'react'

export function FireCard() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return
        const fx = aura.fire(ref.current)
        return () => fx.dispose()
    }, [])

    return <div ref={ref}>running</div>
}
```

### Vue 3

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { aura } from 'agent-aura'

const card = ref<HTMLElement | null>(null)
let fx: ReturnType<typeof aura.border> | undefined

onMounted(() => {
    if (card.value) fx = aura.border(card.value)
})
onBeforeUnmount(() => fx?.dispose())
</script>

<template>
    <div ref="card">thinking</div>
</template>
```

In lists, attach per element ref. Do not reuse one selector on many nodes.

## Errors

| Condition                                      | Message                                 |
| ---------------------------------------------- | --------------------------------------- |
| Selector missed an HTMLElement                 | `agent-aura: target not found: ...`     |
| Missing container                              | `agent-aura: container not found: ...`  |
| No WebGL2                                      | `WebGL2 is required but not available.` |
| Bad Glow color                                 | `Invalid color format: ...`             |
| `start`/`pause`/`resize`/`fade*` after dispose | `... instance has been disposed.`       |

`querySelector` uses the first match only.

## Performance

- No runtime deps; tarball ~30KB unpacked ~119KB
- Fire particles dominate: on laptops try `particleCount` 600–1000 and `smokeCount` 150–300
- Glow is capped ~32fps; border/fire/shape/water/cultivation/demonic/thunder/void/glitch follow rAF
- `water` / `cultivation` / `demonic` share the ShapeField WebGL2 engine; keep `fieldCount` / `detailCount` modest on weak GPUs
- `pause()` when off-screen; `start()` when visible
- Eleven effects on one page is fine; do not stack many `burning` instances on low-end GPUs
- Fire/border DPR is capped at 2
