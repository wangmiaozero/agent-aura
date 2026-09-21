# Agent Aura API

[English](./api.md) | **中文**

零依赖特效库。`glow` / `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` 需要 WebGL2。运行时无 npm 依赖。

- Demo：https://wangmiaozero.github.io/agent-aura/
- npm：https://www.npmjs.com/package/agent-aura

## 目录

- [安装](#安装)
- [导入策略](#导入策略)
- [给 AI 的提示词](#给-ai-的提示词)
- [入口](#入口)
- [aura](#aura)
- [共用类型](#共用类型)
- [实例生命周期](#实例生命周期)
- [挂载](#挂载)
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

## 导入策略

生产项目请用子路径：

```ts
import { fire } from 'agent-aura/fire'
import { voidAura } from 'agent-aura/void'

const fx = fire('#agent')
```

低频状态：

```ts
const { glitch } = await import('agent-aura/glitch')
```

Demo / 原型可以继续 `import { aura } from 'agent-aura'`。完整说明：[imports.zh-CN.md](./imports.zh-CN.md)。

`aura.void()` 保持不变。子路径函数叫 `voidAura()`，因为 `void` 是保留字。

## 给 AI 的提示词

把对应特效的**整段**复制给 Cursor / Claude，让它：`npm install agent-aura`，接入当前项目，并挂到你指定的 UI 区域。演示站和 API 页上的提示词可以直接改，再复制。

### Glow

```
请在当前项目安装 npm 包 agent-aura，并把 Glow 流光遮罩特效挂到我指定的 UI 区域（当前正在编辑、选中或提到的那个组件 / 元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页，不要乱加包装层）：

const fx = aura.glow(target, {
  mode: 'dark', // 暗底 dark，亮底 light；没有两全样式
  borderRadius: 16, // 对齐目标圆角
  borderWidth: 6,
  glowWidth: 140,
})

约束
1. target 是 CSS 选择器或 HTMLElement。找不到节点会抛 agent-aura: target not found
2. Glow 的 canvas 插在 target 内部：position:absolute; inset:0。target 若是 static 需变成 relative。Glow 没有 container 选项
3. 不要 new Glow()，除非你自己 append + start。推荐 aura.glow() 或 Glow.attach()
4. 组件卸载必须 fx.dispose()，否则 WebGL / rAF 泄漏。React 在 useEffect cleanup 里 dispose；Vue 在 onBeforeUnmount
5. 离屏 fx.pause()，回来 fx.start()
6. 自定义颜色必须恰好 4 个 rgb(r, g, b) 字符串，不支持 hex / hsl
7. 文档：https://www.npmjs.com/package/agent-aura

请直接改我指出的那个区域。
```

### Border

```
请在当前项目安装 npm 包 agent-aura，并把 Motion Border 神经光场边框挂到我指定的 UI 区域（当前正在编辑、选中或提到的那张卡片 / 容器）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.border(target, {
  container: stage, // 卡片在 overflow / transform / 滚动容器里时必须传
  glowPadding: 64,
  glowWidth: 90,
  borderWidth: 2,
  borderRadius: 22, // 对齐卡片圆角
  speed: 1.2,
})

约束
1. canvas 叠在 target 外面，光向外溢。挂载顺序：container → 非 body 的 parent → document.body
2. 卡片在 overflow / transform / 滚动容器里必须传 container；container 要能盖住卡片，并作为定位上下文（relative / absolute / fixed）
3. 不要 new MotionBorder()。用 aura.border() 或 MotionBorder.attach()
4. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
5. 离屏 pause() / start()。可用 setTarget / setContainer 热切换
6. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个区域。
```

### Fire

```
请在当前项目安装 npm 包 agent-aura，并把 Fire 火焰燃烧框挂到我指定的 UI 区域（当前正在编辑、选中或提到的那个组件 / 元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.fire(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  particleCount: 800, // 笔记本建议 600–1000
})

约束
1. 火焰沿 target 边框烧。内部强制无烟、无热浪；要烟雾和热浪用 aura.burning
2. canvas 挂到 container 或 document.body，铺满容器或视口；粒子沿 target 边框采样
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new FireBorder()。用 aura.fire() 或 FireBorder.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。不要叠太多火焰实例
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个区域。
```

### Burning

```
请在当前项目安装 npm 包 agent-aura，并把 Burning 超频燃烧生命态挂到我指定的 UI 区域（当前正在编辑、选中或提到的那个组件 / 元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.burning(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  particleCount: 1800, // 笔记本建议降到 600–1000
  smokeCount: 300, // 笔记本 150–300；0 关烟
  glow: true, // 背景热浪
})

约束
1. 大火 + 烟雾 + 背景热浪，比 aura.fire 更猛、更吃 GPU
2. canvas 挂到 container 或 document.body，铺满容器或视口；粒子沿 target 边框采样
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new BurningFire()。用 aura.burning() 或 BurningFire.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机不要叠多个 burning
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个区域。
```

### Shape

```
请在当前项目安装 npm 包 agent-aura，并把 Shape Aura 自适应形状光环挂到我指定的 UI 元素。

- 安装：npm install agent-aura
- 入口：import { aura } from 'agent-aura'
- 使用 aura.shape(target, { container: stage, offset: 5, auraWidth: 33, dustCount: 75, speed: 1 })
- 自动读取 target 的 border-radius 和 clip-path，沿轮廓生成有宽度光带
- 组件卸载必须 fx.dispose()；离屏时 pause()，回来 start()
- 请直接改当前项目，不要另建无关演示页
```

### Water

```
请在当前项目安装 npm 包 agent-aura，并把 Water Aura 液态水流挂到我指定的 UI 元素。

- 安装：npm install agent-aura
- 入口：import { aura } from 'agent-aura'
- 使用 aura.water(target, { waterSize: 10, dropCount: 9, speed: 6, drops: true })
- 自动读取 target 的 border-radius 和 clip-path；SVG 扰动滤镜，不需要 WebGL2
- 组件卸载必须 fx.dispose()；离屏时 pause()，回来 start()
- 请直接改当前项目，不要另建无关演示页
```

## 入口

| 导出                                                                                                                                                                                                                                            | 说明                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `aura`                                                                                                                                                                                                                                          | 一句话 API，适合 Demo；生产请用子路径                |
| `default`                                                                                                                                                                                                                                       | 同 `aura`                                            |
| `fire` / `burning` / `glow` / `border` / `shape` / `water` / `cultivation` / `demonic` / `thunder` / `voidAura` / `glitch`                                                                                                                      | 子路径函数，根包也会再导出                           |
| `Glow`                                                                                                                                                                                                                                          | 流光遮罩 class                                       |
| `MotionBorder`                                                                                                                                                                                                                                  | 神经光场边框 class                                   |
| `FireBorder`                                                                                                                                                                                                                                    | 火焰边框 class                                       |
| `BurningFire`                                                                                                                                                                                                                                   | 超频燃烧 class                                       |
| `ShapeAura`                                                                                                                                                                                                                                     | 自适应形状光环 class                                 |
| `WaterAura`                                                                                                                                                                                                                                     | 自适应液态水流 class                                 |
| `CultivationAura`                                                                                                                                                                                                                               | 形状感知金色修仙灵气 class                           |
| `DemonicAura`                                                                                                                                                                                                                                   | 形状感知紫黑魔气 class                               |
| `ThunderAura`                                                                                                                                                                                                                                   | 形状感知雷劫电弧 class                               |
| `VoidAura`                                                                                                                                                                                                                                      | 形状感知黑洞虚空 class                               |
| `GlitchAura`                                                                                                                                                                                                                                    | 形状感知故障崩坏 class                               |
| `TargetRef`                                                                                                                                                                                                                                     | `string \| HTMLElement`                              |
| `AttachOptions<T>`                                                                                                                                                                                                                              | 去掉 `target`/`container` 后，`container` 可传选择器 |
| `GlowOptions` / `MotionBorderOptions` / `FireBorderOptions` / `BurningFireOptions` / `ShapeAuraOptions` / `WaterAuraOptions` / `CultivationAuraOptions` / `DemonicAuraOptions` / `ThunderAuraOptions` / `VoidAuraOptions` / `GlitchAuraOptions` | 各效果配置                                           |

`aura.x(target, options)` 等价于 `X.attach(target, options)`。

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

十一种实例都支持：

| 方法        | 说明                                                      |
| ----------- | --------------------------------------------------------- |
| `start()`   | 开始 rAF 循环。`attach()` 已调用，一般不用再调            |
| `pause()`   | 停动画；canvas / wrapper 留着                             |
| `dispose()` | 停循环、释放资源、卸 Observer、删 canvas 或 wrapper。幂等 |

`dispose()` 之后再 `start()` / `pause()` 会抛错。

```ts
const fx = aura.fire('#card')
fx.pause()
fx.start()
fx.dispose()
```

只读字段：

- `Glow.element`：canvas（`HTMLElement`）
- `ShapeAura` / `WaterAura` / `CultivationAura` / `DemonicAura` / `ThunderAura` / `VoidAura` / `GlitchAura`：`element` 为 `HTMLCanvasElement`
- 其余：`element` 为 `HTMLCanvasElement`

组件卸载时必须 `dispose()`，否则 WebGL / rAF 会泄漏。

## 挂载

| API                                           | 挂到哪                                                   | 定位                                              | 跟随方式                       |
| --------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- | ------------------------------ |
| `glow`                                        | **target 内部**                                          | `absolute; inset: 0`                              | 跟 target 尺寸                 |
| `border`                                      | `container`，否则非 body 的 parent，否则 `document.body` | container 内 `absolute`，否则 `fixed`             | 按 target 矩形 + `glowPadding` |
| `fire` / `burning`                            | `container` 或 `document.body`                           | container 内铺满 `absolute`，否则铺满视口 `fixed` | 粒子沿 target 边框采样         |
| `thunder`                                     | `container` 或 `document.body`                           | container 内铺满 `absolute`，否则铺满视口 `fixed` | 雷电沿 target 轮廓             |
| `void`                                        | `container` 或 `document.body`                           | container 内铺满 `absolute`，否则铺满视口 `fixed` | 黑洞光带沿 target 轮廓         |
| `glitch`                                      | `container` 或 `document.body`                           | container 内铺满 `absolute`，否则铺满视口 `fixed` | 故障光带沿 target 轮廓         |
| `shape` / `water` / `cultivation` / `demonic` | `container` 或 `document.body`                           | container 内铺满 `absolute`，否则铺满视口 `fixed` | 气场沿 target 轮廓             |

`attach()` 会把 `position: static` 的挂载父级改成 `relative`。

滚动容器、overflow 裁剪、需要特效跟着卡片走时，`border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` 传 `container`：

```ts
aura.border('#card', { container: '#stage' })
aura.fire('#card', { container: '#stage' })
aura.shape('#avatar', { container: '#stage' })
aura.thunder('#card', { container: '#stage' })
aura.void('#hole', { container: '#stage' })
aura.glitch('#crash', { container: '#stage' })
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

## aura.shape / ShapeAura

形状感知 AI 光环。从 Three.js shape-aware-ai-aura demo 移植为零依赖 WebGL2：沿轮廓的有宽度 ribbon + 外层柔光 + 能量尘，自动读取目标的 `border-radius` 和 `clip-path`。

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

| 字段             | 类型                           | 默认    | 说明                       |
| ---------------- | ------------------------------ | ------- | -------------------------- |
| `container`      | `HTMLElement`                  | —       | 挂载 canvas 的定位容器     |
| `offset`         | `number`                       | `5`     | 光带中心相对元素外扩的像素 |
| `auraWidth`      | `number`                       | `33`    | 主光带半宽（像素）         |
| `outerGlowWidth` | `number`                       | `86`    | 外层柔光半宽（像素）       |
| `dustCount`      | `number`                       | `75`    | 能量尘粒子数量             |
| `pathSamples`    | `number`                       | `500`   | 轮廓采样点数               |
| `speed`          | `number`                       | `1`     | 整体时间倍率               |
| `cornerSegments` | `number`                       | `24`    | 圆角采样分段数             |
| `zIndex`         | `number`                       | `20`    | canvas 层级                |
| `classNames`     | `string`                       | —       | canvas class               |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | canvas 内联样式            |
| `skipGreeting`   | `boolean`                      | `false` | 关闭 console 欢迎信息      |

canvas 挂到 `container` 或 `document.body`，铺满容器或视口。支持 `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`。

## aura.water / WaterAura

形状感知液态水流。从 Three.js shape-aura demo 移植为零依赖 WebGL2（theme: `water`）：轮廓光带 + 水雾场 + 水珠粒子，自动读取目标的 `border-radius` 和 `clip-path`。

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

| 字段             | 类型                           | 默认    | 说明                       |
| ---------------- | ------------------------------ | ------- | -------------------------- |
| `container`      | `HTMLElement`                  | —       | 挂载 canvas 的定位容器     |
| `offset`         | `number`                       | `7`     | 水流光圈相对元素外扩的像素 |
| `fieldCount`     | `number`                       | `180`   | 外围水雾粒子数量           |
| `detailCount`    | `number`                       | `110`   | 沿轮廓的水珠粒子数量       |
| `pathSamples`    | `number`                       | `420`   | 轮廓采样点数               |
| `speed`          | `number`                       | `1`     | 整体时间倍率               |
| `cornerSegments` | `number`                       | `20`    | 圆角采样分段数             |
| `zIndex`         | `number`                       | `20`    | canvas 层级                |
| `classNames`     | `string`                       | —       | canvas class               |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | canvas 内联样式            |
| `skipGreeting`   | `boolean`                      | `false` | 关闭 console 欢迎信息      |

canvas 挂到 `container` 或 `document.body`，铺满容器或视口。支持 `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`。

## aura.cultivation / CultivationAura

形状感知金色修仙灵气。与 water / demonic 共用 ShapeField 引擎（theme: `immortal`）：金光脉 + 仙雾场 + 灵子，自动读取目标的 `border-radius` 和 `clip-path`。

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

| 字段             | 类型                           | 默认    | 说明                       |
| ---------------- | ------------------------------ | ------- | -------------------------- |
| `container`      | `HTMLElement`                  | —       | 挂载 canvas 的定位容器     |
| `offset`         | `number`                       | `7`     | 灵气光圈相对元素外扩的像素 |
| `fieldCount`     | `number`                       | `180`   | 外围仙雾粒子数量           |
| `detailCount`    | `number`                       | `110`   | 沿轮廓奔走的灵子数量       |
| `pathSamples`    | `number`                       | `420`   | 轮廓采样点数               |
| `speed`          | `number`                       | `1`     | 整体时间倍率               |
| `cornerSegments` | `number`                       | `20`    | 圆角采样分段数             |
| `mistCount`      | `number`                       | —       | 已弃用，等同 `fieldCount`  |
| `spiritCount`    | `number`                       | —       | 已弃用，等同 `detailCount` |
| `auraSamples`    | `number`                       | —       | 已弃用，等同 `pathSamples` |
| `zIndex`         | `number`                       | `20`    | canvas 层级                |
| `classNames`     | `string`                       | —       | canvas class               |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | canvas 内联样式            |
| `skipGreeting`   | `boolean`                      | `false` | 关闭 console 欢迎信息      |

canvas 挂到 `container` 或 `document.body`，铺满容器或视口。支持 `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`。

## aura.demonic / DemonicAura

形状感知紫黑魔气。与 water / cultivation 共用 ShapeField 引擎（theme: `demonic`）：魔光脉 + 魔雾场 + 魔焰粒子，自动读取目标的 `border-radius` 和 `clip-path`。

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

| 字段             | 类型                           | 默认    | 说明                       |
| ---------------- | ------------------------------ | ------- | -------------------------- |
| `container`      | `HTMLElement`                  | —       | 挂载 canvas 的定位容器     |
| `offset`         | `number`                       | `7`     | 魔气光圈相对元素外扩的像素 |
| `fieldCount`     | `number`                       | `180`   | 外围魔雾粒子数量           |
| `detailCount`    | `number`                       | `110`   | 沿轮廓的魔焰粒子数量       |
| `pathSamples`    | `number`                       | `420`   | 轮廓采样点数               |
| `speed`          | `number`                       | `1`     | 整体时间倍率               |
| `cornerSegments` | `number`                       | `20`    | 圆角采样分段数             |
| `zIndex`         | `number`                       | `20`    | canvas 层级                |
| `classNames`     | `string`                       | —       | canvas class               |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | canvas 内联样式            |
| `skipGreeting`   | `boolean`                      | `false` | 关闭 console 欢迎信息      |

canvas 挂到 `container` 或 `document.body`，铺满容器或视口。支持 `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`。

## aura.thunder / ThunderAura

形状感知雷劫电弧。从 Three.js 雷电场 demo 移植为零依赖 WebGL2：沿轮廓游走的雷霆边框 + 能量粒子 + 随机外放电弧，自动读取目标的 `border-radius` 和 `clip-path`。

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

| 字段             | 类型                           | 默认    | 说明                         |
| ---------------- | ------------------------------ | ------- | ---------------------------- |
| `container`      | `HTMLElement`                  | —       | 挂载 canvas 的定位容器       |
| `offset`         | `number`                       | `8`     | 雷电光圈相对元素外扩的像素   |
| `particleCount`  | `number`                       | `90`    | 沿轮廓奔走的能量粒子数量     |
| `maxBranches`    | `number`                       | `16`    | 同时存在的最大外放电弧数     |
| `branchInterval` | `number`                       | `85`    | 外放电弧生成间隔基准（毫秒） |
| `cornerSegments` | `number`                       | `12`    | 圆角采样分段数               |
| `zIndex`         | `number`                       | `20`    | canvas 层级                  |
| `classNames`     | `string`                       | —       | canvas class                 |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | canvas 内联样式              |
| `skipGreeting`   | `boolean`                      | `false` | 关闭 console 欢迎信息        |

canvas 挂到 `container` 或 `document.body`，铺满容器或视口。支持 `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`。

## aura.void / VoidAura

形状感知黑洞虚空。从 Three.js void-blackhole demo 移植为零依赖 WebGL2：暗影光带 + 事件视界 + 紫白高光 + 虚空雾 + 星屑，自动读取目标的 `border-radius` 和 `clip-path`。

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

| 字段             | 类型                           | 默认    | 说明                     |
| ---------------- | ------------------------------ | ------- | ------------------------ |
| `container`      | `HTMLElement`                  | —       | 挂载 canvas 的定位容器   |
| `offset`         | `number`                       | `6`     | 光圈相对元素外扩的像素   |
| `shadowWidth`    | `number`                       | `78`    | 暗影光带半宽（像素）     |
| `horizonWidth`   | `number`                       | `30`    | 事件视界光带半宽（像素） |
| `highlightWidth` | `number`                       | `12`    | 高光带半宽（像素）       |
| `mistCount`      | `number`                       | `190`   | 虚空雾粒子数量           |
| `sparkCount`     | `number`                       | `95`    | 星屑粒子数量             |
| `pathSamples`    | `number`                       | `520`   | 轮廓采样点数             |
| `speed`          | `number`                       | `1`     | 整体时间倍率             |
| `cornerSegments` | `number`                       | `24`    | 圆角采样分段数           |
| `zIndex`         | `number`                       | `20`    | canvas 层级              |
| `classNames`     | `string`                       | —       | canvas class             |
| `styles`         | `Partial<CSSStyleDeclaration>` | —       | canvas 内联样式          |
| `skipGreeting`   | `boolean`                      | `false` | 关闭 console 欢迎信息    |

canvas 挂到 `container` 或 `document.body`，铺满容器或视口。支持 `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`。

## aura.glitch / GlitchAura

形状感知故障崩坏。从 Three.js glitch-collapse demo 移植为零依赖 WebGL2：RGB 错位 + 数字撕裂 + 边缘断层 + 方形数据碎片，自动读取目标的 `border-radius` 和 `clip-path`。

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

| 字段               | 类型                           | 默认    | 说明                     |
| ------------------ | ------------------------------ | ------- | ------------------------ |
| `container`        | `HTMLElement`                  | —       | 挂载 canvas 的定位容器   |
| `offset`           | `number`                       | `5`     | 光圈相对元素外扩的像素   |
| `outerWidth`       | `number`                       | `45`    | 外层噪声光带半宽（像素） |
| `rgbWidth`         | `number`                       | `11`    | RGB 错位光带半宽（像素） |
| `fragmentCount`    | `number`                       | `130`   | 数据碎片数量             |
| `burstIntervalMin` | `number`                       | `900`   | 崩坏爆发最短间隔（毫秒） |
| `burstIntervalMax` | `number`                       | `2600`  | 崩坏爆发最长间隔（毫秒） |
| `burstDuration`    | `number`                       | `140`   | 单次爆发持续时间（毫秒） |
| `pathSamples`      | `number`                       | `500`   | 轮廓采样点数             |
| `speed`            | `number`                       | `1`     | 整体时间倍率             |
| `cornerSegments`   | `number`                       | `22`    | 圆角采样分段数           |
| `zIndex`           | `number`                       | `20`    | canvas 层级              |
| `classNames`       | `string`                       | —       | canvas class             |
| `styles`           | `Partial<CSSStyleDeclaration>` | —       | canvas 内联样式          |
| `skipGreeting`     | `boolean`                      | `false` | 关闭 console 欢迎信息    |

canvas 挂到 `container` 或 `document.body`，铺满容器或视口。支持 `start()` / `pause()` / `dispose()` / `setTarget` / `setContainer`。

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
- Glow 内部限 ~32fps；border/fire/shape/water/cultivation/demonic/thunder/void/glitch 跟 rAF
- `water` / `cultivation` / `demonic` 共用 ShapeField WebGL2 引擎；低端机降低 `fieldCount` / `detailCount`
- 离屏或不可见时 `pause()`，回来再 `start()`
- 同一页 6 个全开可以，低端机不要叠太多 `burning`
- DPR 在 fire/border 上 capped 到 2
