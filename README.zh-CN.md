# Agent Aura

[![npm version](https://badge.fury.io/js/agent-aura.svg)](https://www.npmjs.com/package/agent-aura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

给 Agent UI 用的零依赖 WebGL2 特效库。

| API            | 效果                 | 典型场景                 |
| -------------- | -------------------- | ------------------------ |
| `aura.glow`    | 彩色流光遮罩         | 工作台、对话框、卡片高亮 |
| `aura.border`  | 圆角卡片外的神经光场 | 思考中 / 推理中 / 活跃态 |
| `aura.fire`    | 沿 DOM 边框燃烧      | 危险 / 执行中 / 点火态   |
| `aura.burning` | 大火 + 烟雾 + 热浪   | 超频 / 燃烧寿命          |

✨ **[在线演示](https://wangmiaozero.github.io/agent-aura/)** · **[API 文档](./docs/api.zh-CN.md)**

演示站和 API 页可切换中文 / English（`?lang=zh` 或 `?lang=en`）。

## 安装

```bash
npm install agent-aura
```

Node.js 18+（Node 24 可用）。浏览器需要 WebGL2。包是 ESM（`"type": "module"`），同时提供 CDN IIFE。

```ts
import { aura } from 'agent-aura'
```

## 快速开始

传选择器或 `HTMLElement`。Canvas 会挂上并立刻开播。

```ts
import { aura } from 'agent-aura'

aura.glow('#hero')
aura.border('#card')
aura.fire('#card')
aura.burning('#agent')
```

CDN：

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

jsDelivr：`https://cdn.jsdelivr.net/npm/agent-aura/build/agent-aura.min.js`

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
- `border` / `fire` / `burning` — canvas 叠在 target 上；传 `container` 挂到你的容器，而不是 `document.body`

```ts
aura.fire('#card', { container: '#stage' })
```

卡片在 overflow / transform / 滚动容器里时必须传。细节见 [API → Canvas 挂载](./docs/api.zh-CN.md#canvas-挂载)。

## Class API

也可以自己接管 DOM。`attach()` 仍负责挂载和启动。`new Glow()` / `new FireBorder()` **不会**。

```ts
import { BurningFire, FireBorder, Glow, MotionBorder } from 'agent-aura'

const fx = FireBorder.attach('#card', { particleCount: 800 })
MotionBorder.attach('#card', { container: '#stage' })
```

`Glow` 额外有 `resize`、`autoResize`、`fadeIn`、`fadeOut`。

## 系统要求

- WebGL2
- 现代 Chromium / Firefox / Safari
- 无运行时依赖

选择器必须命中 `HTMLElement`（只取第一个）。找不到会抛 `agent-aura: target not found`。

## 性能

火焰开销跟 `particleCount` / `smokeCount` 走，笔记本上调低。离屏实例 `pause()`。低端 GPU 不要叠很多 `burning`。

## 开发

```bash
npm install
npm run build  # 压缩 ESM + IIFE + 类型
npm start      # 用 ./build/*.js 打开 index.html
```

`index.html` 就是效果画廊，构建后引入 `./build/index.js`。

## 发布

```bash
npm publish
```

`prepublishOnly` 会先 build。GitHub Pages 把画廊 HTML 和压缩 JS 复制到 `build-demo/`。

## 许可证

[MIT](./LICENSE)

作者：[wangmiao](https://github.com/wangmiaozero)

`Glow` 流光引擎改编自 Simon 的 [ai-motion](https://github.com/gaomeng1900/ai-motion)。
