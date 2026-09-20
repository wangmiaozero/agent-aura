# Agent Aura API

**English** | [中文](./api.zh-CN.md)

Zero-dependency WebGL2 effects. Browser needs WebGL2. No runtime npm dependencies.

- Demo: https://wangmiaozero.github.io/agent-aura/
- npm: https://www.npmjs.com/package/agent-aura

## Contents

- [Install](#install)
- [Entry](#entry)
- [aura](#aura)
- [Shared types](#shared-types)
- [Instance lifecycle](#instance-lifecycle)
- [Canvas mounting](#canvas-mounting)
- [aura.glow / Glow](#auraglow--glow)
- [aura.border / MotionBorder](#auraborder--motionborder)
- [aura.fire / FireBorder](#aurafire--fireborder)
- [aura.burning / BurningFire](#auraburning--burningfire)
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

## Entry

| Export                                                                             | Role                                                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `aura`                                                                             | One-call API. Prefer this.                                          |
| `default`                                                                          | Same as `aura`                                                      |
| `Glow`                                                                             | Glow-mask class                                                     |
| `MotionBorder`                                                                     | Neural energy-border class                                          |
| `FireBorder`                                                                       | Fire-along-border class                                             |
| `BurningFire`                                                                      | Overclock / burning-life class                                      |
| `TargetRef`                                                                        | `string \| HTMLElement`                                             |
| `AttachOptions<T>`                                                                 | Options without `target`/`container`; `container` may be a selector |
| `GlowOptions` / `MotionBorderOptions` / `FireBorderOptions` / `BurningFireOptions` | Per-effect options                                                  |

`aura.x(target, options)` is `X.attach(target, options)`.

## aura

```ts
aura.glow(target, options?: GlowOptions): Glow
aura.border(target, options?: AttachOptions<MotionBorderOptions>): MotionBorder
aura.fire(target, options?: AttachOptions<FireBorderOptions>): FireBorder
aura.burning(target, options?: AttachOptions<BurningFireOptions>): BurningFire
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

All four instances expose:

| Method      | Behavior                                                                   |
| ----------- | -------------------------------------------------------------------------- |
| `start()`   | Starts the rAF loop. `attach()` already calls this                         |
| `pause()`   | Stops animation; canvas stays                                              |
| `dispose()` | Stops loop, frees WebGL, disconnects observers, removes canvas. Idempotent |

`start()` / `pause()` after `dispose()` throw.

```ts
const fx = aura.fire('#card')
fx.pause()
fx.start()
fx.dispose()
```

Readonly:

- `Glow.element` — the canvas (`HTMLElement`)
- others — `element` is `HTMLCanvasElement`

Always `dispose()` on unmount or you leak WebGL contexts and rAF.

## Canvas mounting

| API                | Canvas parent                                           | Positioning                                        | Follow                             |
| ------------------ | ------------------------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| `glow`             | **inside target**                                       | `absolute; inset: 0`                               | target size                        |
| `border`           | `container`, else non-body parent, else `document.body` | `absolute` in container, else `fixed`              | target rect + `glowPadding`        |
| `fire` / `burning` | `container` or `document.body`                          | fills container (`absolute`) or viewport (`fixed`) | particles sampled on target border |

`attach()` sets a static mount parent to `position: relative`.

For scroll containers, overflow clip, or keeping the effect with the card, mount into the same wrapper:

```ts
aura.border('#card', { container: '#stage' })
aura.fire('#card', { container: '#stage' })
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
- Glow is capped ~32fps; border/fire follow rAF
- `pause()` when off-screen; `start()` when visible
- Four effects on one page is fine; do not stack many `burning` instances on low-end GPUs
- Fire/border DPR is capped at 2
