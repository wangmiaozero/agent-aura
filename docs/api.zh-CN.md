# Agent Aura API

[English](./api.md) | **中文**

零依赖 WebGL2 特效。浏览器需要 WebGL2；运行时无 npm 依赖。

- Demo：https://wangmiaozero.github.io/agent-aura/
- npm：https://www.npmjs.com/package/agent-aura

## 目录

- [安装](#安装)
- [入口](#入口)
- [aura](#aura)
- [共用类型](#共用类型)
- [实例生命周期](#实例生命周期)
- [Canvas 挂载](#canvas-挂载)
- [aura.glow / Glow](#auraglow--glow)
- [aura.border / MotionBorder](#auraborder--motionborder)
- [aura.fire / FireBorder](#aurafire--fireborder)
- [aura.burning / BurningFire](#auraburning--burningfire)
- [框架用法](#框架用法)
- [错误](#错误)
- [性能](#性能)

## 安装

```bash
npm install agent-aura
```

ESM：

```ts
import { aura } from 'agent-aura'
```

CDN（IIFE，全局 `AgentAura`）：

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    const fx = AgentAura.aura.fire('#card')
</script>
```

jsDelivr：`https://cdn.jsdelivr.net/npm/agent-aura/build/agent-aura.min.js`

包是 `"type": "module"`，只提供 ESM + 浏览器 IIFE，没有 CJS。

## 入口

| 导出                                                                               | 说明                                                 |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `aura`                                                                             | 一句话 API，推荐                                     |
| `default`                                                                          | 同 `aura`                                            |
| `Glow`                                                                             | 流光遮罩 class                                       |
| `MotionBorder`                                                                     | 神经光场边框 class                                   |
| `FireBorder`                                                                       | 火焰边框 class                                       |
| `BurningFire`                                                                      | 超频燃烧 class                                       |
| `TargetRef`                                                                        | `string \| HTMLElement`                              |
| `AttachOptions<T>`                                                                 | 去掉 `target`/`container` 后，`container` 可传选择器 |
| `GlowOptions` / `MotionBorderOptions` / `FireBorderOptions` / `BurningFireOptions` | 各效果配置                                           |

`aura.x(target, options)` 等价于 `X.attach(target, options)`。

## aura

```ts
aura.glow(target, options?: GlowOptions): Glow
aura.border(target, options?: AttachOptions<MotionBorderOptions>): MotionBorder
aura.fire(target, options?: AttachOptions<FireBorderOptions>): FireBorder
aura.burning(target, options?: AttachOptions<BurningFireOptions>): BurningFire
```

`target`：CSS 选择器或 `HTMLElement`。找不到节点会抛错。

## 共用类型

```ts
type TargetRef = string | HTMLElement

type AttachOptions<T> = Omit<T, 'target' | 'container'> & {
    container?: TargetRef
}
```

`attach()` / `aura.*` 里不要传 `target` 字段，第一个参数就是 target。`container` 可以是选择器。

class 构造函数仍可直接传 `target?: HTMLElement` 和 `container?: HTMLElement`（必须是元素，不是选择器），且不会自动 `append` / `start`。

## 实例生命周期

四种实例都支持：

| 方法        | 说明                                                   |
| ----------- | ------------------------------------------------------ |
| `start()`   | 开始 rAF 循环。`attach()` 已调用，一般不用再调         |
| `pause()`   | 停动画，canvas 留着                                    |
| `dispose()` | 停循环、释放 WebGL、卸 ResizeObserver、删 canvas。幂等 |

`dispose()` 之后再 `start()` / `pause()` 会抛错。

```ts
const fx = aura.fire('#card')
fx.pause()
fx.start()
fx.dispose()
```

只读字段：

- `Glow.element`：canvas（`HTMLElement`）
- 其余：`element` 为 `HTMLCanvasElement`

组件卸载时必须 `dispose()`，否则 WebGL 上下文和 rAF 会泄漏。

## Canvas 挂载

| API                | canvas 挂到哪                                            | 定位                                              | 跟随方式                       |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------- | ------------------------------ |
| `glow`             | **target 内部**                                          | `absolute; inset: 0`                              | 跟 target 尺寸                 |
| `border`           | `container`，否则非 body 的 parent，否则 `document.body` | container 内 `absolute`，否则 `fixed`             | 按 target 矩形 + `glowPadding` |
| `fire` / `burning` | `container` 或 `document.body`                           | container 内铺满 `absolute`，否则铺满视口 `fixed` | 粒子沿 target 边框采样         |

`attach()` 会把 `position: static` 的挂载父级改成 `relative`。

滚动容器、overflow 裁剪、需要特效跟着卡片走时，把 canvas 放进同一层：

```ts
aura.border('#card', { container: '#stage' })
aura.fire('#card', { container: '#stage' })
```

`#stage` 必须是定位上下文（`relative` / `absolute` / `fixed`），且盖得住卡片。

## aura.glow / Glow

流光遮罩。canvas **插在 target 里面**，铺满。适合工作台、对话框、卡片高亮。

```ts
const fx = aura.glow('#hero', {
    mode: 'dark',
    borderRadius: 16,
    borderWidth: 6,
    glowWidth: 140,
})
```

### GlowOptions

| 字段           | 类型                           | 默认               | 说明                                                               |
| -------------- | ------------------------------ | ------------------ | ------------------------------------------------------------------ |
| `width`        | `number`                       | `600`              | 逻辑宽。`attach()` 后被 ResizeObserver 覆盖                        |
| `height`       | `number`                       | `600`              | 逻辑高                                                             |
| `ratio`        | `number`                       | `devicePixelRatio` | 可以 `< 1` 降分辨率                                                |
| `mode`         | `'dark' \| 'light'`            | `'light'`          | 背景色模式。暗底用 `dark`，亮底用 `light`。没有两全的样式          |
| `colors`       | 四元组 `rgb(...)`              | 见下               | 必须恰好 4 个 `rgb(r, g, b)` 字符串                                |
| `borderWidth`  | `number`                       | `8`                | 实线边宽                                                           |
| `glowWidth`    | `number`                       | `200`              | 光晕宽                                                             |
| `borderRadius` | `number`                       | `8`                | 圆角                                                               |
| `classNames`   | `string`                       | —                  | canvas class                                                       |
| `styles`       | `Partial<CSSStyleDeclaration>` | —                  | 合进 canvas style。`attach()` 会先设 `position/inset/width/height` |
| `skipGreeting` | `boolean`                      | `false`            | 关掉 console 欢迎信息（不推荐）                                    |

默认颜色：

```ts
;['rgb(57, 182, 255)', 'rgb(189, 69, 251)', 'rgb(255, 87, 51)', 'rgb(255, 214, 0)']
```

颜色必须是 `rgb(r, g, b)`，不支持 hex / hsl。格式不对会抛 `Invalid color format`。

`glow` **没有** `container`。canvas 始终是 target 的子节点。

### Glow 方法

| 方法                                | 说明                                                  |
| ----------------------------------- | ----------------------------------------------------- |
| `Glow.attach(target, options?)`     | 解析节点、插入 canvas、`autoResize`、`start`          |
| `start()` / `pause()` / `dispose()` | 生命周期                                              |
| `resize(width, height, ratio?)`     | 改缓冲和几何。未 `start` 只记 options                 |
| `autoResize(sourceElement)`         | `ResizeObserver` 跟元素尺寸                           |
| `fadeIn()`                          | 300ms opacity 0→1 + scale 1.2→1，返回 `Promise<void>` |
| `fadeOut()`                         | 反向，返回 `Promise<void>`                            |

帧率锁在约 32fps。

## aura.border / MotionBorder

连续 shader 光场绕圆角边框流动，光向外溢。适合思考中 / 推理中 / Agent 活跃态。

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

| 字段           | 类型                           | 默认     | 说明                                |
| -------------- | ------------------------------ | -------- | ----------------------------------- |
| `glowPadding`  | `number`                       | `110`    | canvas 相对 target 外扩，给光晕留空 |
| `borderWidth`  | `number`                       | `2.2`    | 光带宽度                            |
| `glowWidth`    | `number`                       | `115`    | 外溢宽度                            |
| `borderRadius` | `number`                       | `28`     | 跟卡片圆角对齐                      |
| `speed`        | `number`                       | `1`      | 时间倍率                            |
| `zIndex`       | `number`                       | `10`     | canvas z-index                      |
| `classNames`   | `string`                       | —        |                                     |
| `styles`       | `Partial<CSSStyleDeclaration>` | —        |                                     |
| `skipGreeting` | `boolean`                      | `false`  |                                     |
| `container`    | `TargetRef`                    | 见挂载表 | 仅 `attach` / `aura.border`         |

DPR 上限 2。

### MotionBorder 方法

| 方法                                    | 说明                          |
| --------------------------------------- | ----------------------------- |
| `MotionBorder.attach(target, options?)` | 挂载并 `start`                |
| `setTarget(el)`                         | 换跟随目标                    |
| `setContainer(el)`                      | 换父级，改 `absolute`/`fixed` |
| `start()` / `pause()` / `dispose()`     | 生命周期                      |

监听 `resize`、捕获阶段 `scroll`、target/container 的 ResizeObserver。

## aura.fire / FireBorder

火焰沿 DOM 边框烧，带核心、外焰、火星。适合危险 / 执行中 / 点火态。

内部 `preset: 'border'`，强制 `smokeCount: 0`、`glow: false`。

```ts
aura.fire('#fire-card', {
    container: '#fire-preview',
    particleCount: 800,
    padding: 1,
})
```

### FireBorderOptions

| 字段            | 类型                           | 默认            | 说明                         |
| --------------- | ------------------------------ | --------------- | ---------------------------- |
| `particleCount` | `number`                       | `1300`          | 火焰粒子。越大越密、越吃 GPU |
| `padding`       | `number`                       | `1`             | 采样边框相对 target 的内缩   |
| `zIndex`        | `number`                       | `10`            |                              |
| `classNames`    | `string`                       | —               |                              |
| `styles`        | `Partial<CSSStyleDeclaration>` | —               |                              |
| `skipGreeting`  | `boolean`                      | `false`         |                              |
| `onFrame`       | `(time: number) => void`       | —               | 每帧回调，`time` 为秒        |
| `container`     | `TargetRef`                    | `document.body` | 仅 `attach` / `aura.fire`    |

没有 `smokeCount` / `glow`。要烟雾和热浪用 `burning`。

### FireBorder 方法

`attach` / `setTarget` / `setContainer` / `start` / `pause` / `dispose`。

无 container 时 canvas 铺满窗口；粒子坐标按 target 相对视口计算。页面滚动会更新边框。

## aura.burning / BurningFire

更猛的火 + 烟 + 背景热浪。适合超频 / 燃烧寿命硬扛推理。

内部 `preset: 'burning'`。

```ts
aura.burning('#burn-card', {
    container: '#burn-preview',
    particleCount: 1800,
    smokeCount: 300,
    glow: true,
})
```

### BurningFireOptions

| 字段            | 类型                           | 默认            | 说明                         |
| --------------- | ------------------------------ | --------------- | ---------------------------- |
| `particleCount` | `number`                       | `2200`          | 火焰粒子                     |
| `smokeCount`    | `number`                       | `520`           | `0` 关烟                     |
| `glow`          | `boolean`                      | `true`          | 背景热浪 quad                |
| `padding`       | `number`                       | `2`             | 边框采样内缩                 |
| `zIndex`        | `number`                       | `10`            |                              |
| `classNames`    | `string`                       | —               |                              |
| `styles`        | `Partial<CSSStyleDeclaration>` | —               |                              |
| `skipGreeting`  | `boolean`                      | `false`         |                              |
| `onFrame`       | `(time: number) => void`       | —               |                              |
| `container`     | `TargetRef`                    | `document.body` | 仅 `attach` / `aura.burning` |

`smokeCount > 0` 才创建烟层。

方法与 `FireBorder` 相同。

## 框架用法

卸载务必 `dispose()`。

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

列表项用元素 ref，不要复用同一个选择器挂多次。

## 错误

| 条件                                          | 信息                                    |
| --------------------------------------------- | --------------------------------------- |
| 选择器没命中 HTMLElement                      | `agent-aura: target not found: ...`     |
| container 找不到                              | `agent-aura: container not found: ...`  |
| 无 WebGL2                                     | `WebGL2 is required but not available.` |
| Glow 颜色非法                                 | `Invalid color format: ...`             |
| dispose 后再 `start`/`pause`/`resize`/`fade*` | `... instance has been disposed.`       |

`querySelector` 只取第一个匹配。

## 性能

- 无运行时依赖，产物约 30KB gzip 前
- 火焰粒子是主要开销：笔记本可把 `particleCount` 降到 600–1000，`smokeCount` 降到 150–300
- Glow 内部限 ~32fps；border/fire 跟 rAF
- 离屏或不可见时 `pause()`，回来再 `start()`
- 同一页 4 个全开可以，低端机不要叠太多 `burning`
- DPR 在 fire/border 上 capped 到 2
