# Import Strategy

**English** | [中文](./imports.zh-CN.md)

Agent Aura supports three import modes. Production apps should only pay for effects they actually use.

Recommended order:

1. **Subpath import** for production
2. **Lazy import** for rare / error-state effects
3. **Full `aura` API** for demos and prototypes

## Subpath import

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

`void` is a reserved word, so the subpath function is `voidAura()`. `aura.void()` on the full API is unchanged.

Each subpath is its own ESM entry. Importing `agent-aura/fire` does not pull water, thunder, void, or glitch.

`fire` and `burning` share `FireEngine` and live in the same entry. `water` / `cultivation` / `demonic` share `ShapeFieldAura` via a Rollup chunk — importing two of them does not duplicate the engine.

## Lazy import

```ts
const { glitch } = await import('agent-aura/glitch')
const fx = glitch('#crash')
```

Use this for crash / retry / overlay states that most users never see. The glitch chunk stays out of the initial bundle.

## Full API

```ts
import { aura } from 'agent-aura'

aura.fire('#agent')
aura.water('#stream')
aura.void('#hole')
aura.glitch('#crash')
```

CDN IIFE is still the full bundle:

```html
<script src="https://unpkg.com/agent-aura/build/agent-aura.min.js"></script>
<script>
    AgentAura.aura.fire('#card')
</script>
```

Class APIs (`FireBorder.attach`, `Glow.attach`, …) remain available from both the root package and the matching subpath.

See also: [API reference](./api.md).
