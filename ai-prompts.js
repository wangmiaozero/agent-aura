import { detectLang, t } from './i18n.js'

export const aiPrompts = {
	zh: {
		glow: `请在当前项目安装 npm 包 agent-aura，并把 Glow 流光遮罩特效挂到我指定的 UI 区域（当前正在编辑、选中或提到的那个组件 / 元素）。

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

请直接改我指出的那个区域。`,
		border: `请在当前项目安装 npm 包 agent-aura，并把 Motion Border 神经光场边框挂到我指定的 UI 区域（当前正在编辑、选中或提到的那张卡片 / 容器）。

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

请直接挂到我指出的那个区域。`,
		fire: `请在当前项目安装 npm 包 agent-aura，并把 Fire 火焰燃烧框挂到我指定的 UI 区域（当前正在编辑、选中或提到的那个组件 / 元素）。

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

请直接挂到我指出的那个区域。`,
		burning: `请在当前项目安装 npm 包 agent-aura，并把 Burning 超频燃烧生命态挂到我指定的 UI 区域（当前正在编辑、选中或提到的那个组件 / 元素）。

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

请直接挂到我指出的那个区域。`,
		shape: `请在当前项目安装 npm 包 agent-aura，并把 Shape Aura 自适应形状光环挂到我指定的 UI 元素（当前正在编辑、选中或提到的元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.shape(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  offset: 5,
  auraWidth: 33,
  outerGlowWidth: 86,
  dustCount: 75,
  pathSamples: 500,
  speed: 1,
})

约束
1. Shape Aura 自动读取 target 的 border-radius 和 clip-path，沿轮廓生成有宽度的光带
2. canvas 挂到 container 或 document.body，铺满容器或视口
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new ShapeAura()。用 aura.shape() 或 ShapeAura.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机可降低 dustCount / pathSamples
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个元素。`,
		water: `请在当前项目安装 npm 包 agent-aura，并把 Water Aura 液态水流特效挂到我指定的 UI 元素（当前正在编辑、选中或提到的元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.water(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  offset: 7,
  fieldCount: 180,
  detailCount: 110,
  pathSamples: 420,
  speed: 1,
})

约束
1. Water Aura 自动读取 target 的 border-radius 和 clip-path，水流沿轮廓流转
2. canvas 挂到 container 或 document.body，铺满容器或视口
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new WaterAura()。用 aura.water() 或 WaterAura.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机可降低 fieldCount / detailCount
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个元素。`,
		cultivation: `请在当前项目安装 npm 包 agent-aura，并把 Cultivation Aura 金色修仙灵气挂到我指定的 UI 元素（当前正在编辑、选中或提到的元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.cultivation(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  offset: 7,
  fieldCount: 180,
  detailCount: 110,
  pathSamples: 420,
  speed: 1,
})

约束
1. Cultivation Aura 自动读取 target 的 border-radius 和 clip-path，金色灵气沿轮廓流转
2. canvas 挂到 container 或 document.body，铺满容器或视口
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new CultivationAura()。用 aura.cultivation() 或 CultivationAura.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机可降低 fieldCount / detailCount
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个元素。`,
		demonic: `请在当前项目安装 npm 包 agent-aura，并把 Demonic Aura 紫黑魔气挂到我指定的 UI 元素（当前正在编辑、选中或提到的元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.demonic(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  offset: 7,
  fieldCount: 180,
  detailCount: 110,
  pathSamples: 420,
  speed: 1,
})

约束
1. Demonic Aura 自动读取 target 的 border-radius 和 clip-path，紫黑魔气沿轮廓流转
2. canvas 挂到 container 或 document.body，铺满容器或视口
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new DemonicAura()。用 aura.demonic() 或 DemonicAura.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机可降低 fieldCount / detailCount
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个元素。`,
		thunder: `请在当前项目安装 npm 包 agent-aura，并把 Thunder Aura 雷劫电弧挂到我指定的 UI 元素（当前正在编辑、选中或提到的元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.thunder(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  offset: 8,
  particleCount: 90,
  maxBranches: 16,
  branchInterval: 85,
})

约束
1. Thunder Aura 自动读取 target 的 border-radius 和 clip-path，雷电沿轮廓游走并随机外放电弧
2. canvas 挂到 container 或 document.body，铺满容器或视口
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new ThunderAura()。用 aura.thunder() 或 ThunderAura.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机可降低 particleCount / maxBranches
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个元素。`,
		void: `请在当前项目安装 npm 包 agent-aura，并把 Void Aura 黑洞虚空挂到我指定的 UI 元素（当前正在编辑、选中或提到的元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.void(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  offset: 6,
  shadowWidth: 78,
  horizonWidth: 30,
  highlightWidth: 12,
  mistCount: 190,
  sparkCount: 95,
})

约束
1. Void Aura 自动读取 target 的 border-radius 和 clip-path，暗影光带 + 事件视界 + 星屑沿轮廓流转
2. canvas 挂到 container 或 document.body，铺满容器或视口
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new VoidAura()。用 aura.void() 或 VoidAura.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机可降低 mistCount / sparkCount
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个元素。`,
		glitch: `请在当前项目安装 npm 包 agent-aura，并把 Glitch Aura 故障崩坏挂到我指定的 UI 元素（当前正在编辑、选中或提到的元素）。

目标
- 安装：npm install agent-aura
- 包是 ESM only（无 CJS），零运行时依赖，浏览器需要 WebGL2
- 入口：import { aura } from 'agent-aura'

接入（按项目实际框架写，不要另起无关示例页）：

const fx = aura.glitch(target, {
  container: stage, // overflow / transform / 滚动容器里必须传
  offset: 5,
  outerWidth: 45,
  rgbWidth: 11,
  fragmentCount: 130,
})

约束
1. Glitch Aura 自动读取 target 的 border-radius 和 clip-path，RGB 错位 + 数字撕裂 + 数据碎片沿轮廓发生
2. canvas 挂到 container 或 document.body，铺满容器或视口
3. 卡片在 overflow / transform / 滚动容器里必须传 container
4. 不要 new GlitchAura()。用 aura.glitch() 或 GlitchAura.attach()
5. 卸载必须 fx.dispose()。React useEffect cleanup；Vue onBeforeUnmount
6. 离屏 pause()。低端机可降低 fragmentCount
7. 文档：https://www.npmjs.com/package/agent-aura

请直接挂到我指出的那个元素。`,
	},
	en: {
		glow: `Install the npm package agent-aura in this project and attach the Glow stream-mask effect to the UI area I specified (the component or element currently selected, edited, or mentioned).

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
7. Docs: https://www.npmjs.com/package/agent-aura`,
		border: `Install the npm package agent-aura in this project and attach the Motion Border neural energy field to the UI area I specified (the card or container currently selected, edited, or mentioned).

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
6. Docs: https://www.npmjs.com/package/agent-aura`,
		fire: `Install the npm package agent-aura in this project and attach the Fire burning-border effect to the UI area I specified (the component or element currently selected, edited, or mentioned).

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
7. Docs: https://www.npmjs.com/package/agent-aura`,
		burning: `Install the npm package agent-aura in this project and attach the Burning overclock-life effect to the UI area I specified (the component or element currently selected, edited, or mentioned).

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
7. Docs: https://www.npmjs.com/package/agent-aura`,
		shape: `Install the npm package agent-aura and attach the shape-aware aura to the UI element I specified (the element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it into the project's real framework. Edit the current area in place; do not create an unrelated demo page.

const fx = aura.shape(target, {
  container: stage, // required inside overflow / transform / scrolling panes
  offset: 5,
  auraWidth: 33,
  outerGlowWidth: 86,
  dustCount: 75,
  pathSamples: 500,
  speed: 1,
})

Rules
1. Shape Aura reads the target's border-radius and clip-path; it draws a width-aware ribbon along the outline
2. Canvas mounts on container or document.body and fills that view
3. Pass container when the card sits in overflow / transform / scrolling panes
4. Do not new ShapeAura(). Use aura.shape() or ShapeAura.attach()
5. Always fx.dispose() on unmount
6. Off-screen: pause(). On weak GPUs lower dustCount / pathSamples
7. Docs: https://www.npmjs.com/package/agent-aura`,
		water: `Install the npm package agent-aura and attach the liquid Water Aura to the UI element I specified (the element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it into the project's real framework. Edit the current area in place; do not create an unrelated demo page.

const fx = aura.water(target, {
  container: stage, // required inside overflow / transform / scrolling panes
  offset: 7,
  fieldCount: 180,
  detailCount: 110,
  pathSamples: 420,
  speed: 1,
})

Rules
1. Water Aura reads the target's border-radius and clip-path; water flows along the outline
2. Canvas mounts on container or document.body and fills that view
3. Pass container when the card sits in overflow / transform / scrolling panes
4. Do not new WaterAura(). Use aura.water() or WaterAura.attach()
5. Always fx.dispose() on unmount
6. Off-screen: pause(). On weak GPUs lower fieldCount / detailCount
7. Docs: https://www.npmjs.com/package/agent-aura`,
		cultivation: `Install the npm package agent-aura and attach the golden Cultivation Aura to the UI element I specified (the element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it into the project's real framework. Edit the current area in place; do not create an unrelated demo page.

const fx = aura.cultivation(target, {
  container: stage, // required inside overflow / transform / scrolling panes
  offset: 7,
  fieldCount: 180,
  detailCount: 110,
  pathSamples: 420,
  speed: 1,
})

Rules
1. Cultivation Aura reads the target's border-radius and clip-path; golden spirit flows along the outline
2. Canvas mounts on container or document.body and fills that view
3. Pass container when the card sits in overflow / transform / scrolling panes
4. Do not new CultivationAura(). Use aura.cultivation() or CultivationAura.attach()
5. Always fx.dispose() on unmount
6. Off-screen: pause(). On weak GPUs lower fieldCount / detailCount
7. Docs: https://www.npmjs.com/package/agent-aura`,
		demonic: `Install the npm package agent-aura and attach the purple-black Demonic Aura to the UI element I specified (the element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it into the project's real framework. Edit the current area in place; do not create an unrelated demo page.

const fx = aura.demonic(target, {
  container: stage, // required inside overflow / transform / scrolling panes
  offset: 7,
  fieldCount: 180,
  detailCount: 110,
  pathSamples: 420,
  speed: 1,
})

Rules
1. Demonic Aura reads the target's border-radius and clip-path; purple-black mist flows along the outline
2. Canvas mounts on container or document.body and fills that view
3. Pass container when the card sits in overflow / transform / scrolling panes
4. Do not new DemonicAura(). Use aura.demonic() or DemonicAura.attach()
5. Always fx.dispose() on unmount
6. Off-screen: pause(). On weak GPUs lower fieldCount / detailCount
7. Docs: https://www.npmjs.com/package/agent-aura`,
		thunder: `Install the npm package agent-aura and attach the Thunder Aura tribulation arcs to the UI element I specified (the element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it into the project's real framework. Edit the current area in place; do not create an unrelated demo page.

const fx = aura.thunder(target, {
  container: stage, // required inside overflow / transform / scrolling panes
  offset: 8,
  particleCount: 90,
  maxBranches: 16,
  branchInterval: 85,
})

Rules
1. Thunder Aura reads the target's border-radius and clip-path; lightning rides the outline and spawns outward arcs
2. Canvas mounts on container or document.body and fills that view
3. Pass container when the card sits in overflow / transform / scrolling panes
4. Do not new ThunderAura(). Use aura.thunder() or ThunderAura.attach()
5. Always fx.dispose() on unmount
6. Off-screen: pause(). On weak GPUs lower particleCount / maxBranches
7. Docs: https://www.npmjs.com/package/agent-aura`,
		void: `Install the npm package agent-aura and attach the Void Aura blackhole ribbon to the UI element I specified (the element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it into the project's real framework. Edit the current area in place; do not create an unrelated demo page.

const fx = aura.void(target, {
  container: stage, // required inside overflow / transform / scrolling panes
  offset: 6,
  shadowWidth: 78,
  horizonWidth: 30,
  highlightWidth: 12,
  mistCount: 190,
  sparkCount: 95,
})

Rules
1. Void Aura reads the target's border-radius and clip-path; a dark event-horizon ribbon, mist, and sparks follow the outline
2. Canvas mounts on container or document.body and fills that view
3. Pass container when the card sits in overflow / transform / scrolling panes
4. Do not new VoidAura(). Use aura.void() or VoidAura.attach()
5. Always fx.dispose() on unmount
6. Off-screen: pause(). On weak GPUs lower mistCount / sparkCount
7. Docs: https://www.npmjs.com/package/agent-aura`,
		glitch: `Install the npm package agent-aura and attach the Glitch Aura collapse tears to the UI element I specified (the element currently selected, edited, or mentioned).

Goal
- Install: npm install agent-aura
- ESM only (no CJS), zero runtime deps, needs WebGL2
- Import: import { aura } from 'agent-aura'

Wire it into the project's real framework. Edit the current area in place; do not create an unrelated demo page.

const fx = aura.glitch(target, {
  container: stage, // required inside overflow / transform / scrolling panes
  offset: 5,
  outerWidth: 45,
  rgbWidth: 11,
  fragmentCount: 130,
})

Rules
1. Glitch Aura reads the target's border-radius and clip-path; RGB split, digital tears, and data fragments follow the outline
2. Canvas mounts on container or document.body and fills that view
3. Pass container when the card sits in overflow / transform / scrolling panes
4. Do not new GlitchAura(). Use aura.glitch() or GlitchAura.attach()
5. Always fx.dispose() on unmount
6. Off-screen: pause(). On weak GPUs lower fragmentCount
7. Docs: https://www.npmjs.com/package/agent-aura`,
	},
}

export function getAiPrompt(kind, lang = detectLang()) {
	const dict = aiPrompts[lang] || aiPrompts.en
	return dict[kind] || ''
}

const STORE_PREFIX = 'agent-aura-prompt:'

function storeKey(kind, lang) {
	return `${STORE_PREFIX}${kind}:${lang}`
}

function readStored(kind, lang) {
	try {
		return sessionStorage.getItem(storeKey(kind, lang))
	} catch {
		return null
	}
}

function writeStored(kind, lang, text) {
	try {
		sessionStorage.setItem(storeKey(kind, lang), text)
	} catch {
		// private mode
	}
}

function clearStored(kind, lang) {
	try {
		sessionStorage.removeItem(storeKey(kind, lang))
	} catch {
		// private mode
	}
}

function editorValue(el) {
	return 'value' in el ? el.value : el.textContent || ''
}

function setEditorValue(el, text) {
	if ('value' in el) el.value = text
	else el.textContent = text
}

async function writeClipboard(text) {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text)
			return
		}
	} catch {
		// insecure context / unfocused document — fall back
	}
	const ta = document.createElement('textarea')
	ta.value = text
	ta.setAttribute('readonly', '')
	ta.style.position = 'fixed'
	ta.style.left = '-9999px'
	document.body.appendChild(ta)
	ta.select()
	const ok = document.execCommand('copy')
	ta.remove()
	if (!ok) throw new Error('copy failed')
}

export async function copyAiPrompt(kind, lang = detectLang(), text) {
	const value = (text ?? getAiPrompt(kind, lang)).trim()
	if (!value) return false
	await writeClipboard(value)
	return true
}

export function fillPromptPreviews(lang = detectLang()) {
	for (const el of document.querySelectorAll('[data-prompt-preview]')) {
		const kind = el.dataset.promptPreview
		setEditorValue(el, readStored(kind, lang) ?? getAiPrompt(kind, lang))
	}
}

function bindPromptEditors() {
	for (const el of document.querySelectorAll('[data-prompt-preview]')) {
		if (el.dataset.promptBound) continue
		el.dataset.promptBound = '1'
		el.addEventListener('input', () => {
			writeStored(el.dataset.promptPreview, detectLang(), editorValue(el))
		})
	}
}

function bindResetButtons() {
	for (const btn of document.querySelectorAll('[data-reset-prompt]')) {
		if (btn.dataset.resetBound) continue
		btn.dataset.resetBound = '1'
		btn.addEventListener('click', () => {
			const kind = btn.dataset.resetPrompt
			const lang = detectLang()
			const editor = btn.closest('.prompt-block')?.querySelector('[data-prompt-preview]')
			if (!editor) return
			clearStored(kind, lang)
			setEditorValue(editor, getAiPrompt(kind, lang))
			editor.focus()
		})
	}
}

export function initCopyPromptButtons() {
	fillPromptPreviews()
	bindPromptEditors()
	bindResetButtons()
	document.addEventListener('agent-aura:lang', (event) => {
		fillPromptPreviews(event.detail?.lang || detectLang())
	})

	for (const btn of document.querySelectorAll('[data-copy-prompt]')) {
		if (btn.dataset.copyBound) continue
		btn.dataset.copyBound = '1'
		btn.addEventListener('click', async () => {
			const kind = btn.dataset.copyPrompt
			const editor = btn.closest('.prompt-block')?.querySelector('[data-prompt-preview]')
			try {
				await copyAiPrompt(kind, detectLang(), editor ? editorValue(editor) : undefined)
			} catch (error) {
				console.error(error)
				return
			}
			const lang = detectLang()
			const done = t('copy.done', lang)
			const label = t('copy.prompt', lang)
			btn.classList.add('is-copied')
			const textEl = btn.querySelector('[data-copy-label]')
			if (textEl) textEl.textContent = done
			else btn.textContent = done
			window.setTimeout(() => {
				btn.classList.remove('is-copied')
				const restored = t('copy.prompt', detectLang())
				if (textEl) textEl.textContent = restored
				else btn.textContent = restored
			}, 1600)
		})
	}
}
