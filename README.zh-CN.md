# Agent Aura

[![npm version](https://badge.fury.io/js/agent-aura.svg)](https://www.npmjs.com/package/agent-aura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[English](README.md) | 中文**

给 Agent UI 用的零依赖 WebGL2 特效库：

- **motion** — AI 流光遮罩
- **border** — 卡片周围的神经光场
- **fire** — 沿 DOM 边框燃烧
- **burning** — 超频 / 燃烧生命态

✨ **[在线演示](https://wangmiaozero.github.io/agent-aura/)**

## 安装

```bash
npm install agent-aura
```

Node.js 18+（Node 24 可用）。浏览器需要 WebGL2。

## 快速开始

```ts
import { aura } from 'agent-aura'

aura.fire('#card')
aura.burning('#agent')
aura.border('#card')
aura.motion('#hero')
```

只传选择器或 `HTMLElement`。Canvas 会自动挂上并开始播放。

Script / CDN：

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

`npm run build` 之后，本地 demo 直接引入压缩文件：

```html
<script type="module">
    import { aura } from './build/index.js'

    aura.fire('#card')
</script>
```

## 可选微调

```ts
aura.fire('#card', { particleCount: 800 })

aura.burning('#agent', { smokeCount: 300, glow: true })

aura.border('#card', { glowWidth: 90, speed: 1.2 })

aura.motion('#hero', { mode: 'dark', borderRadius: 16 })
```

返回实例仍可 `pause()` / `start()` / `dispose()`。

```ts
const fx = aura.fire('#card')
fx.pause()
fx.dispose()
```

只有需要把 canvas 放到某个容器里，而不是 `document.body` 时才传 `container`：

```ts
aura.fire('#card', { container: '#stage' })
```

## Class API

也可以自己接管 DOM：

```ts
import { BurningFire, FireBorder, Motion, MotionBorder } from 'agent-aura'

FireBorder.attach('#card')
MotionBorder.attach('#card')
```

## 系统要求

- WebGL2
- 现代浏览器
- 无运行时依赖

## 开发

```bash
npm install
npm run build  # 压缩 ESM + IIFE + 类型
npm start      # 用 ./build/*.js 打开 index.html
```

`index.html` 就是效果画廊，构建后引入 `./build/index.js`，不需要再打开独立 demo 页。

## 发布

```bash
npm run build
npm publish --access public
```

GitHub Pages 会把 `index.html` 和压缩后的 `build/*.js` 复制到 `build-demo/`。

## 许可证

[MIT](./LICENSE)

作者：[wangmiao](https://github.com/wangmiaozero)

`Motion` 流光引擎改编自 Simon 的 [ai-motion](https://github.com/gaomeng1900/ai-motion)。
