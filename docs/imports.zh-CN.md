# 导入策略

[English](./imports.md) | **中文**

Agent Aura 支持三种导入方式。生产项目只应为实际使用的特效支付体积。

推荐顺序：

1. **生产项目用 Subpath Import**
2. **低频 / 错误态用 Lazy Import**
3. **Demo / 快速原型用全量 `aura` API**

## Subpath Import

```ts
import { border } from 'agent-aura/border'
import { cultivation } from 'agent-aura/cultivation'
import { demonic } from 'agent-aura/demonic'
import { BurningFire, FireBorder, burning, fire } from 'agent-aura/fire'
import { glitch } from 'agent-aura/glitch'
import { glow } from 'agent-aura/glow'
import { shape } from 'agent-aura/shape'
import { thunder } from 'agent-aura/thunder'
import { voidAura } from 'agent-aura/void'
import { water } from 'agent-aura/water'

const fx = fire('#agent')
fx.pause()
fx.start()
fx.dispose()
```

`void` 是保留字，所以子路径函数叫 `voidAura()`。全量 API 上的 `aura.void()` 保持不变。

每个子路径都是独立 ESM 入口。`import { fire } from 'agent-aura/fire'` 不会带上 water / thunder / void / glitch。

`fire` 与 `burning` 共用 `FireEngine`，放在同一个入口。`water` / `cultivation` / `demonic` 通过 Rollup chunk 共用 `ShapeFieldAura`，同时导入其中两个不会复制两份引擎。

## Lazy Import

```ts
const { glitch } = await import('agent-aura/glitch')
const fx = glitch('#crash')
```

适合崩溃、重试、覆盖层等大多数用户看不到的状态。glitch chunk 不会进入首包。

## 全量 API

```ts
import { aura } from 'agent-aura'

aura.fire('#agent')
aura.water('#stream')
aura.void('#hole')
aura.glitch('#crash')
```

CDN IIFE 仍是全量包：

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

Class API（`FireBorder.attach`、`Glow.attach` 等）在根包和对应子路径上都可以用。

另见：[API 文档](./api.zh-CN.md)。
