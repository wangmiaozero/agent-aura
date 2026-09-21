# Agent Aura

[![npm version](https://badge.fury.io/js/agent-aura.svg)](https://www.npmjs.com/package/agent-aura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

给 Agent UI 用的零依赖特效库。

| API                | 效果                 | 典型场景                   |
| ------------------ | -------------------- | -------------------------- |
| `aura.glow`        | 彩色流光遮罩         | 工作台、对话框、卡片高亮   |
| `aura.border`      | 圆角卡片外的神经光场 | 思考中 / 推理中 / 活跃态   |
| `aura.fire`        | 沿 DOM 边框燃烧      | 危险 / 执行中 / 点火态     |
| `aura.burning`     | 大火 + 烟雾 + 热浪   | 超频 / 燃烧寿命            |
| `aura.shape`       | WebGL2 形状感知光带  | 圆形 / 胶囊 / 多边形       |
| `aura.water`       | WebGL2 形状感知水流  | 流式输出 / 思考中 / 液态   |
| `aura.cultivation` | WebGL2 金色修仙灵气  | 修仙 UI / 角色面板 / 悟道  |
| `aura.demonic`     | WebGL2 紫黑魔气      | 暴走 / 禁术 / 危险过载     |
| `aura.thunder`     | 雷劫电弧             | 极限推理 / 渡劫 / 超频思考 |
| `aura.void`        | 黑洞虚空光带         | 深渊 / 过载 / 事件视界     |
| `aura.glitch`      | RGB 撕裂故障崩坏     | 崩溃 / 重试 / 系统异常     |

✨ **[在线演示](https://wangmiaozero.github.io/agent-aura/)** · **[API 文档](./docs/api.zh-CN.md)**

演示站和 API 页默认英文。可用 `?lang=zh` 或 `?lang=en` 切换。

## 安装

```bash
npm install agent-aura
```

Node.js 18+（Node 24 可用）。`glow` / `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` 需要 WebGL2。包是 ESM（`"type": "module"`），同时提供 CDN IIFE。

```ts
import { aura } from 'agent-aura'
```

## 推荐：只导入你用到的特效

生产项目请用子路径导入：

```ts
import { fire } from 'agent-aura/fire'

const fx = fire('#agent')
```

这样不会把 water / thunder / void / glitch 等无关特效打进业务包。详见 [导入策略](./docs/imports.zh-CN.md)。

全量便利 API 适合 Demo / 快速开发 / 对体积不敏感的项目：

```ts
import { aura } from 'agent-aura'

aura.fire('#agent')
```

低频状态可以动态加载：

```ts
const { glitch } = await import('agent-aura/glitch')
glitch('#crash')
```

## 快速开始

传选择器或 `HTMLElement`。Canvas 会挂上并立刻开播。

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

CDN：

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

jsDelivr：`https://cdn.jsdelivr.net/npm/agent-aura/build/agent-aura.min.js`

## 给 AI 的提示词

演示站六个特效卡片、API 页都有可编辑的「复制 AI 提示词」。改完选择器 / 区域后再复制给 Cursor / Claude，它会：

1. `npm install agent-aura`
2. 按当前项目框架接入
3. 挂到你指定的那个 UI 区域

完整六段提示词：[API → 给 AI 的提示词](./docs/api.zh-CN.md#给-ai-的提示词)

## 配置

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

完整字段表：[docs/api.zh-CN.md](./docs/api.zh-CN.md)。

## 生命周期

```ts
const fx = aura.fire('#card')
fx.pause()
fx.start()
fx.dispose()
```

`attach()` 已经调过 `start()`。组件卸载必须 `dispose()`，否则 WebGL / rAF 泄漏。

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

## Canvas 挂载

- `glow` — canvas 是 target 的子节点（`position: absolute; inset: 0`）
- `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` — canvas 叠在 target 上；传 `container` 挂到你的容器，而不是 `document.body`

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

卡片在 overflow / transform / 滚动容器里时，`border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch` 必须传 `container`。细节见 [API → 挂载](./docs/api.zh-CN.md#挂载)。

## Class API

也可以自己接管 DOM。`attach()` 仍负责挂载和启动。`new Glow()` / `new FireBorder()` **不会**。

```ts
import {
    BurningFire,
    CultivationAura,
    DemonicAura,
    FireBorder,
    GlitchAura,
    Glow,
    MotionBorder,
    ShapeAura,
    ThunderAura,
    VoidAura,
    WaterAura,
} from 'agent-aura'

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

`Glow` 额外有 `resize`、`autoResize`、`fadeIn`、`fadeOut`。

## 系统要求

- `glow` / `border` / `fire` / `burning` / `thunder` / `shape` / `water` / `cultivation` / `demonic` / `void` / `glitch`：WebGL2
- 现代 Chromium / Firefox / Safari
- 无运行时依赖

选择器必须命中 `HTMLElement`（只取第一个）。找不到会抛 `agent-aura: target not found`。

## 性能

火焰开销跟 `particleCount` / `smokeCount` 走，笔记本上调低。`water` / `cultivation` / `demonic` 共用 ShapeField WebGL2 引擎，低端机降低 `fieldCount` / `detailCount`。离屏实例 `pause()`。低端 GPU 不要叠很多 `burning`。

## 开发

```bash
npm install
npm run build  # 压缩 ESM + IIFE + 类型
npm start      # 用 ./build/*.js 打开 index.html
```

`index.html` 是目录页。每种特效单独一页（`glow.html`、`shape.html` 等），构建后引入 `./build/index.js`。子路径产物在 `build/fire/index.js`、`build/glitch/index.js` 等。

## 发布

```bash
npm publish
```

`prepublishOnly` 会先 build。GitHub Pages 把画廊 HTML 和压缩 JS 复制到 `build-demo/`。

## 许可证

[MIT](./LICENSE)

作者：[wangmiao](https://github.com/wangmiaozero)

`Glow` 流光引擎改编自 Simon 的 [ai-motion](https://github.com/gaomeng1900/ai-motion)。
