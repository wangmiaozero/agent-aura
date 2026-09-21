const STORAGE_KEY = 'agent-aura-lang'

export const messages = {
	zh: {
		'home.title': 'Agent Aura — Make Agents Pretty',
		'home.meta':
			'给 Agent UI 用的零依赖特效：流光遮罩、神经光场、火焰燃烧、超频生命态、形状光环、液态水流、金色修仙灵气、紫黑魔气、雷劫电弧、黑洞虚空和故障崩坏。',
		'docs.title': 'Agent Aura — API',
		'docs.meta':
			'agent-aura API：aura.glow / border / fire / burning / shape / water / cultivation / demonic / thunder / void / glitch 完整参数与生命周期。',
		'nav.glow': 'Glow',
		'nav.border': 'Border',
		'nav.fire': 'Fire',
		'nav.burning': 'Burning',
		'nav.shape': 'Shape',
		'nav.water': 'Water',
		'nav.cultivation': 'Cultivation',
		'nav.demonic': 'Demonic',
		'nav.thunder': 'Thunder',
		'nav.void': 'Void',
		'nav.glitch': 'Glitch',
		'nav.demo': '演示',
		'nav.api': 'API',
		'nav.githubDocs': 'GitHub 文档',
		'home.lead':
			'给 Agent UI 用的零依赖特效库：流光遮罩、神经光场边框、火焰燃烧框、超频燃烧生命态、自适应形状光环、液态水流、金色修仙灵气、紫黑魔气、雷劫电弧、黑洞虚空和故障崩坏。',
		'home.glowTag': 'Stream · Mask',
		'home.glowTitle': 'GLOW',
		'home.glowDesc': 'WebGL2 彩色流光边框，适合 Agent 工作台、对话框、卡片高亮。',
		'home.borderTag': 'Neural · Field',
		'home.borderTitle': 'MOTION BORDER',
		'home.borderDesc':
			'连续 Shader 光场沿圆角边框流动，光向外溢出。适合思考中、推理中、Agent 活跃态。',
		'home.fireTag': 'Fire Border',
		'home.fireTitle': 'BURNING BORDER',
		'home.fireDesc':
			'火焰沿 UI 边框持续燃烧，带核心、外焰和火星飞溅。适合危险模式、执行中、点火态。',
		'home.burnTag': 'Agent Overclock',
		'home.burnTitle': 'AGENT BURNING',
		'home.burnDesc': '更猛的火焰 + 烟雾 + 背景热浪，像 Agent 正在燃烧寿命硬扛推理。',
		'home.shapeTag': 'Shape · Ribbon Aura',
		'home.shapeTitle': 'SHAPE AURA',
		'home.shapeDesc':
			'WebGL2 沿轮廓的有宽度光带 + 外层柔光 + 能量尘，自动跟随 border-radius / clip-path。适合圆形、胶囊、圆角卡片和多边形。',
		'home.waterTag': 'Liquid · Shape Field',
		'home.waterTitle': 'WATER AURA',
		'home.waterDesc':
			'WebGL2 轮廓水流 + 水雾场 + 水珠，自动跟随 border-radius / clip-path。适合流式输出、思考中、液态 Agent。',
		'home.cultivationTag': 'Immortal · Golden Mist',
		'home.cultivationTitle': 'CULTIVATION AURA',
		'home.cultivationDesc':
			'WebGL2 金光脉 + 仙雾场 + 灵子，自动跟随 border-radius / clip-path。适合修仙主题、角色面板、悟道状态。',
		'home.demonicTag': 'Forbidden · Dark Mist',
		'home.demonicTitle': 'DEMONIC AURA',
		'home.demonicDesc':
			'WebGL2 紫黑魔光 + 魔雾场 + 魔焰粒子，自动跟随 border-radius / clip-path。适合暴走、禁术、危险过载状态。',
		'home.thunderTag': 'Tribulation · Lightning',
		'home.thunderTitle': 'THUNDER AURA',
		'home.thunderDesc':
			'雷霆沿轮廓高速游走并随机外放电弧，自动跟随 border-radius / clip-path。适合极限推理、渡劫、超频思考。',
		'home.voidTag': 'Event Horizon · Void',
		'home.voidTitle': 'VOID AURA',
		'home.voidDesc':
			'WebGL2 暗影光带 + 事件视界 + 紫白高光 + 虚空雾 + 星屑，自动跟随 border-radius / clip-path。适合深渊、过载、禁域状态。',
		'home.glitchTag': 'System Collapse · RGB Tear',
		'home.glitchTitle': 'GLITCH AURA',
		'home.glitchDesc':
			'WebGL2 RGB 错位 + 数字撕裂 + 边缘断层 + 数据碎片，自动跟随 border-radius / clip-path。适合崩溃、重试、系统异常状态。',
		'home.buildHint': '请先运行 npm run build，再刷新页面',
		'home.open': '打开演示 →',
		'home.kicker': '零依赖 · WebGL2 · ESM',
		'home.gallery': '全部演示',
		'home.galleryLead': '十一种特效，各自一页。每页有多种状态和形状。',
		'home.stat1': '11 种特效',
		'home.stat2': '零运行时依赖',
		'home.stat3': 'WebGL2',
		'demo.thinking': '思考中',
		'demo.streaming': '流式输出',
		'demo.idle': '待命',
		'demo.danger': '危险',
		'demo.executing': '执行中',
		'demo.overclock': '超频',
		'demo.highlight': '高亮',
		'demo.light': '浅色底',
		'demo.circle': '圆形',
		'demo.pill': '胶囊',
		'demo.hex': '六边形',
		'demo.diamond': '菱形',
		'demo.card': '卡片',
		'demo.avatar': '头像',
		'demo.chip': '标签',
		'demo.shield': '盾形',
		'copy.prompt': '复制 AI 提示词',
		'copy.done': '已复制',
		'copy.reset': '重置',
		'copy.hint': '提示词可直接改选择器 / 区域 / 参数，再复制给 Cursor / Claude。',
		'copy.block.glow': 'Glow · 给 AI：安装并挂到指定区域',
		'copy.block.border': 'Border · 给 AI：安装并挂到指定区域',
		'copy.block.fire': 'Fire · 给 AI：安装并挂到指定区域',
		'copy.block.burning': 'Burning · 给 AI：安装并挂到指定区域',
		'copy.block.shape': 'Shape · 给 AI：安装并挂到指定元素',
		'copy.block.water': 'Water · 给 AI：安装并挂到指定元素',
		'copy.block.cultivation': 'Cultivation · 给 AI：安装并挂到指定元素',
		'copy.block.demonic': 'Demonic · 给 AI：安装并挂到指定元素',
		'copy.block.thunder': 'Thunder · 给 AI：安装并挂到指定元素',
		'copy.block.void': 'Void · 给 AI：安装并挂到指定元素',
		'copy.block.glitch': 'Glitch · 给 AI：安装并挂到指定元素',
		'docs.lead':
			'十一种特效同一套生命周期：<code>attach</code> 自动挂载并播放，<code>pause</code> / <code>start</code> 控制循环，卸载时 <code>dispose()</code>。完整 Markdown 版在仓库 <code>docs/api.zh-CN.md</code>。',
		'docs.toc.install': '安装',
		'docs.toc.aura': 'aura',
		'docs.toc.lifecycle': '生命周期',
		'docs.toc.mount': '挂载',
		'docs.toc.glow': 'glow',
		'docs.toc.border': 'border',
		'docs.toc.fire': 'fire',
		'docs.toc.burning': 'burning',
		'docs.toc.shape': 'shape',
		'docs.toc.water': 'water',
		'docs.toc.cultivation': 'cultivation',
		'docs.toc.demonic': 'demonic',
		'docs.toc.thunder': 'thunder',
		'docs.toc.void': 'void',
		'docs.toc.glitch': 'glitch',
		'docs.toc.framework': '框架',
		'docs.install': '安装',
		'docs.install.cdn':
			'CDN：<code>https://unpkg.com/agent-aura/build/agent-aura.min.js</code>，全局 <code>AgentAura</code>。包是 ESM，没有 CJS。<code>glow</code> / <code>border</code> / <code>fire</code> / <code>burning</code> / <code>thunder</code> / <code>shape</code> / <code>water</code> / <code>cultivation</code> / <code>demonic</code> / <code>void</code> / <code>glitch</code> 需要 WebGL2。',
		'docs.aura.p':
			'<code>target</code> 是选择器或 <code>HTMLElement</code>。等价于对应 class 的 <code>attach()</code>。找不到节点抛 <code>agent-aura: target not found</code>。',
		'docs.lifecycle': '生命周期',
		'docs.th.method': '方法',
		'docs.th.behavior': '行为',
		'docs.lifecycle.start': '<code>attach()</code> 已调用，一般不用再调',
		'docs.lifecycle.pause': '停 rAF；canvas / wrapper 留着',
		'docs.lifecycle.dispose':
			'释放资源 / Observer，删 canvas 或 wrapper，幂等。之后再 start/pause 会抛错',
		'docs.mount': '挂载',
		'docs.th.api': 'API',
		'docs.th.where': '挂到哪',
		'docs.th.pos': '定位',
		'docs.mount.glow': 'target 内部',
		'docs.mount.glowPos': '<code>absolute; inset: 0</code>',
		'docs.mount.border': '<code>container</code> → 非 body parent → <code>document.body</code>',
		'docs.mount.borderPos': '容器内 absolute，否则 fixed，外扩 <code>glowPadding</code>',
		'docs.mount.fire': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.firePos': '铺满容器或视口，粒子沿 target 边框',
		'docs.mount.shape': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.shapePos': '铺满容器或视口，光带沿 target 轮廓',
		'docs.mount.water': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.waterPos': '铺满容器或视口，水流沿 target 轮廓',
		'docs.mount.demonic': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.demonicPos': '铺满容器或视口，魔气沿 target 轮廓',
		'docs.mount.thunder': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.thunderPos': '铺满容器或视口，雷电沿 target 轮廓',
		'docs.mount.void': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.voidPos': '铺满容器或视口，黑洞光带沿 target 轮廓',
		'docs.mount.glitch': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.glitchPos': '铺满容器或视口，故障光带沿 target 轮廓',
		'docs.mount.note':
			'<code>border</code> / <code>fire</code> / <code>burning</code> / <code>thunder</code> / <code>shape</code> / <code>water</code> / <code>cultivation</code> / <code>demonic</code> / <code>void</code> / <code>glitch</code> 在 overflow / transform / 滚动容器里必须传 <code>container</code>。',
		'docs.glow.p': "流光遮罩。canvas 插在 target 里面。暗底用 <code>mode: 'dark'</code>。",
		'docs.th.field': '字段',
		'docs.th.default': '默认',
		'docs.th.note': '说明',
		'docs.glow.mode': "<code>'dark' | 'light'</code>，没有两全样式",
		'docs.glow.colors': '蓝 / 紫 / 橙 / 黄',
		'docs.glow.colorsNote': '必须 4 个 <code>rgb(r, g, b)</code>',
		'docs.glow.borderWidth': '实线边宽',
		'docs.glow.glowWidth': '光晕宽',
		'docs.glow.radius': '圆角',
		'docs.glow.ratio': '可 &lt; 1 降分辨率',
		'docs.glow.extra':
			'额外方法：<code>resize</code>、<code>autoResize</code>、<code>fadeIn()</code> / <code>fadeOut()</code>（300ms Promise）。内部约 32fps。没有 <code>container</code>。',
		'docs.border.p': '神经光场绕圆角边框流动。',
		'docs.border.pad': 'canvas 相对 target 外扩',
		'docs.border.bw': '光带宽度',
		'docs.border.gw': '外溢宽度',
		'docs.border.radius': '跟卡片圆角对齐',
		'docs.border.speed': '时间倍率',
		'docs.border.z': 'canvas 层级',
		'docs.border.extra': '<code>setTarget</code> / <code>setContainer</code> 可热切换跟随节点。',
		'docs.fire.p': '火焰沿边框烧。内部强制无烟、无热浪。',
		'docs.fire.count': '越大越密、越吃 GPU',
		'docs.fire.padding': '边框采样内缩',
		'docs.fire.frame': '<code>(time: number) =&gt; void</code>，秒',
		'docs.burning.p': '大火 + 烟雾 + 背景热浪。',
		'docs.burning.count': '火焰粒子',
		'docs.burning.smoke': '<code>0</code> 关烟',
		'docs.burning.glow': '背景热浪',
		'docs.burning.padding': '边框采样内缩',
		'docs.burning.note': '笔记本建议把粒子降到 600–1000，烟 150–300。离屏 <code>pause()</code>。',
		'docs.shape.p':
			'形状感知 AI 光环。WebGL2 沿轮廓的有宽度 ribbon + 外层柔光 + 能量尘，自动跟随 <code>border-radius</code> 和 <code>clip-path</code>。',
		'docs.shape.offset': '光带中心相对元素外扩的像素距离',
		'docs.shape.width': '主光带半宽（像素）',
		'docs.shape.outer': '外层柔光半宽（像素）',
		'docs.shape.dust': '能量尘粒子数量',
		'docs.shape.samples': '轮廓采样点数',
		'docs.shape.speed': '整体时间倍率',
		'docs.shape.corners': '圆角采样分段数',
		'docs.water.p':
			'形状感知液态水流。WebGL2 轮廓光带 + 水雾场 + 水珠粒子，自动跟随 <code>border-radius</code> 和 <code>clip-path</code>。与仙气 / 魔气共用 ShapeField 引擎。',
		'docs.water.offset': '水流光圈相对元素外扩的像素距离',
		'docs.water.field': '外围水雾粒子数量',
		'docs.water.detail': '沿轮廓的水珠粒子数量',
		'docs.water.samples': '轮廓采样点数',
		'docs.water.speed': '整体时间倍率',
		'docs.water.corners': '圆角采样分段数',
		'docs.cultivation.p':
			'形状感知金色修仙灵气。WebGL2 金光脉 + 仙雾场 + 灵子，自动跟随 <code>border-radius</code> 和 <code>clip-path</code>。与水 / 魔气共用 ShapeField 引擎。',
		'docs.cultivation.offset': '灵气光圈相对元素外扩的像素距离',
		'docs.cultivation.mist': '外围仙雾粒子数量（fieldCount）',
		'docs.cultivation.spirit': '沿轮廓奔走的灵子数量（detailCount）',
		'docs.cultivation.samples': '轮廓采样点数',
		'docs.cultivation.speed': '整体时间倍率',
		'docs.cultivation.corners': '圆角采样分段数',
		'docs.mount.cultivation': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.cultivationPos': '铺满容器或视口，灵气沿 target 轮廓',
		'docs.demonic.p':
			'形状感知紫黑魔气。WebGL2 魔光脉 + 魔雾场 + 魔焰粒子，自动跟随 <code>border-radius</code> 和 <code>clip-path</code>。与水 / 仙气共用 ShapeField 引擎。',
		'docs.demonic.offset': '魔气光圈相对元素外扩的像素距离',
		'docs.demonic.field': '外围魔雾粒子数量',
		'docs.demonic.detail': '沿轮廓的魔焰粒子数量',
		'docs.demonic.samples': '轮廓采样点数',
		'docs.demonic.speed': '整体时间倍率',
		'docs.demonic.corners': '圆角采样分段数',
		'docs.thunder.p':
			'形状感知雷劫电弧。WebGL2 沿轮廓游走的雷霆边框 + 能量粒子 + 随机外放电弧，自动跟随 <code>border-radius</code> 和 <code>clip-path</code>。',
		'docs.thunder.offset': '雷电光圈相对元素外扩的像素距离',
		'docs.thunder.particles': '沿轮廓奔走的能量粒子数量',
		'docs.thunder.branches': '同时存在的最大外放电弧数',
		'docs.thunder.interval': '外放电弧生成间隔（毫秒级基准）',
		'docs.thunder.corners': '圆角采样分段数',
		'docs.void.p':
			'形状感知黑洞虚空。WebGL2 暗影光带 + 事件视界 + 紫白高光 + 虚空雾 + 星屑，自动跟随 <code>border-radius</code> 和 <code>clip-path</code>。',
		'docs.void.offset': '光圈相对元素外扩的像素距离',
		'docs.void.shadow': '暗影光带半宽（像素）',
		'docs.void.horizon': '事件视界光带半宽（像素）',
		'docs.void.highlight': '高光带半宽（像素）',
		'docs.void.mist': '虚空雾粒子数量',
		'docs.void.sparks': '星屑粒子数量',
		'docs.void.samples': '轮廓采样点数',
		'docs.void.speed': '整体时间倍率',
		'docs.void.corners': '圆角采样分段数',
		'docs.glitch.p':
			'形状感知故障崩坏。WebGL2 RGB 错位 + 数字撕裂 + 边缘断层 + 方形数据碎片，自动跟随 <code>border-radius</code> 和 <code>clip-path</code>。',
		'docs.glitch.offset': '光圈相对元素外扩的像素距离',
		'docs.glitch.outer': '外层噪声光带半宽（像素）',
		'docs.glitch.rgb': 'RGB 错位光带半宽（像素）',
		'docs.glitch.fragments': '数据碎片数量',
		'docs.glitch.burstMin': '崩坏爆发最短间隔（毫秒）',
		'docs.glitch.burstMax': '崩坏爆发最长间隔（毫秒）',
		'docs.glitch.burstDur': '单次爆发持续时间（毫秒）',
		'docs.glitch.samples': '轮廓采样点数',
		'docs.glitch.speed': '整体时间倍率',
		'docs.glitch.corners': '圆角采样分段数',
		'docs.framework': '框架',
		'docs.framework.p':
			'class 导出：<code>Glow</code>、<code>MotionBorder</code>、<code>FireBorder</code>、<code>BurningFire</code>、<code>ShapeAura</code>、<code>WaterAura</code>、<code>CultivationAura</code>、<code>DemonicAura</code>、<code>ThunderAura</code>、<code>VoidAura</code>、<code>GlitchAura</code>。推荐使用 <code>aura.*</code> 或 <code>X.attach()</code>。',
	},
	en: {
		'home.title': 'Agent Aura — Make Agents Pretty',
		'home.meta':
			'Zero-dependency effects for Agent UIs: glow, neural borders, fire, overclock flames, shape auras, liquid water, golden cultivation mist, purple-black demonic aura, thunder tribulation arcs, void blackhole ribbons, and glitch collapse tears.',
		'docs.title': 'Agent Aura — API',
		'docs.meta':
			'agent-aura API: aura.glow / border / fire / burning / shape / water / cultivation / demonic / thunder / void / glitch options and lifecycle.',
		'nav.glow': 'Glow',
		'nav.border': 'Border',
		'nav.fire': 'Fire',
		'nav.burning': 'Burning',
		'nav.shape': 'Shape',
		'nav.water': 'Water',
		'nav.cultivation': 'Cultivation',
		'nav.demonic': 'Demonic',
		'nav.thunder': 'Thunder',
		'nav.void': 'Void',
		'nav.glitch': 'Glitch',
		'nav.demo': 'Demo',
		'nav.api': 'API',
		'nav.githubDocs': 'GitHub docs',
		'home.lead':
			'Zero-dependency effects for Agent UIs: stream glow, neural borders, fire frames, overclock flames, shape-aware auras, liquid water, golden cultivation mist, purple-black demonic aura, thunder tribulation arcs, void blackhole ribbons, and glitch collapse tears.',
		'home.glowTag': 'Stream · Mask',
		'home.glowTitle': 'GLOW',
		'home.glowDesc':
			'WebGL2 color stream glow. Use for agent workspaces, dialogs, and card highlight.',
		'home.borderTag': 'Neural · Field',
		'home.borderTitle': 'MOTION BORDER',
		'home.borderDesc':
			'A continuous shader field flows around a rounded card and spills outward. Use for thinking / reasoning / agent-active states.',
		'home.fireTag': 'Fire Border',
		'home.fireTitle': 'BURNING BORDER',
		'home.fireDesc':
			'Fire burns along the UI border with core, outer flame, and sparks. Use for danger / executing / ignition.',
		'home.burnTag': 'Agent Overclock',
		'home.burnTitle': 'AGENT BURNING',
		'home.burnDesc':
			'Heavier fire + smoke + heat haze, like an agent burning its life to finish inference.',
		'home.shapeTag': 'Shape · Ribbon Aura',
		'home.shapeTitle': 'SHAPE AURA',
		'home.shapeDesc':
			'WebGL2 ribbon along the outline + outer halo + energy dust. Follows border-radius / clip-path. Use for circles, pills, rounded cards, and polygons.',
		'home.waterTag': 'Liquid · Shape Field',
		'home.waterTitle': 'WATER AURA',
		'home.waterDesc':
			'WebGL2 contour water + mist field + droplets. Follows border-radius / clip-path. Use for streaming / thinking / liquid agent states.',
		'home.cultivationTag': 'Immortal · Golden Mist',
		'home.cultivationTitle': 'CULTIVATION AURA',
		'home.cultivationDesc':
			'WebGL2 golden veins + mist field + spirit motes. Follows border-radius / clip-path. Use for cultivation themes, character panels, and enlightenment states.',
		'home.demonicTag': 'Forbidden · Dark Mist',
		'home.demonicTitle': 'DEMONIC AURA',
		'home.demonicDesc':
			'WebGL2 violet veins + mist field + ember particles. Follows border-radius / clip-path. Use for overdrive, forbidden arts, and dangerous overload states.',
		'home.thunderTag': 'Tribulation · Lightning',
		'home.thunderTitle': 'THUNDER AURA',
		'home.thunderDesc':
			'Lightning races along the outline and spawns outward arcs. Follows border-radius / clip-path. Use for ultra-thinking, tribulation, and overclocked reasoning.',
		'home.voidTag': 'Event Horizon · Void',
		'home.voidTitle': 'VOID AURA',
		'home.voidDesc':
			'WebGL2 dark shadow ribbon + event horizon + violet highlights + void mist + sparks. Follows border-radius / clip-path. Use for abyss, overload, and forbidden-zone states.',
		'home.glitchTag': 'System Collapse · RGB Tear',
		'home.glitchTitle': 'GLITCH AURA',
		'home.glitchDesc':
			'WebGL2 RGB split + digital tears + edge dropouts + data fragments. Follows border-radius / clip-path. Use for crash, retry, and system-error states.',
		'home.buildHint': 'Run npm run build first, then refresh.',
		'home.open': 'Open demo →',
		'home.kicker': 'Zero-dep · WebGL2 · ESM',
		'home.gallery': 'All demos',
		'home.galleryLead': 'Eleven effects, one page each. Multiple states and shapes per page.',
		'home.stat1': '11 effects',
		'home.stat2': 'Zero runtime deps',
		'home.stat3': 'WebGL2',
		'demo.thinking': 'Thinking',
		'demo.streaming': 'Streaming',
		'demo.idle': 'Idle',
		'demo.danger': 'Danger',
		'demo.executing': 'Executing',
		'demo.overclock': 'Overclock',
		'demo.highlight': 'Highlight',
		'demo.light': 'Light',
		'demo.circle': 'Circle',
		'demo.pill': 'Pill',
		'demo.hex': 'Hexagon',
		'demo.diamond': 'Diamond',
		'demo.card': 'Card',
		'demo.avatar': 'Avatar',
		'demo.chip': 'Chip',
		'demo.shield': 'Shield',
		'copy.prompt': 'Copy AI prompt',
		'copy.done': 'Copied',
		'copy.reset': 'Reset',
		'copy.hint': 'Edit the prompt (selector, area, options), then copy it for Cursor / Claude.',
		'copy.block.glow': 'Glow · for AI: install and attach to an area',
		'copy.block.border': 'Border · for AI: install and attach to an area',
		'copy.block.fire': 'Fire · for AI: install and attach to an area',
		'copy.block.burning': 'Burning · for AI: install and attach to an area',
		'copy.block.shape': 'Shape · for AI: install and attach to an element',
		'copy.block.water': 'Water · for AI: install and attach to an element',
		'copy.block.cultivation': 'Cultivation · for AI: install and attach to an element',
		'copy.block.demonic': 'Demonic · for AI: install and attach to an element',
		'copy.block.thunder': 'Thunder · for AI: install and attach to an element',
		'copy.block.void': 'Void · for AI: install and attach to an element',
		'copy.block.glitch': 'Glitch · for AI: install and attach to an element',
		'docs.lead':
			'All eleven effects share one lifecycle: <code>attach</code> mounts and plays, <code>pause</code> / <code>start</code> control the loop, <code>dispose()</code> on unmount. Full Markdown lives at <code>docs/api.md</code>.',
		'docs.toc.install': 'Install',
		'docs.toc.aura': 'aura',
		'docs.toc.lifecycle': 'Lifecycle',
		'docs.toc.mount': 'Mounting',
		'docs.toc.glow': 'glow',
		'docs.toc.border': 'border',
		'docs.toc.fire': 'fire',
		'docs.toc.burning': 'burning',
		'docs.toc.shape': 'shape',
		'docs.toc.water': 'water',
		'docs.toc.cultivation': 'cultivation',
		'docs.toc.demonic': 'demonic',
		'docs.toc.thunder': 'thunder',
		'docs.toc.void': 'void',
		'docs.toc.glitch': 'glitch',
		'docs.toc.framework': 'Frameworks',
		'docs.install': 'Install',
		'docs.install.cdn':
			'CDN: <code>https://unpkg.com/agent-aura/build/agent-aura.min.js</code>, global <code>AgentAura</code>. ESM only, no CJS. <code>glow</code> / <code>border</code> / <code>fire</code> / <code>burning</code> / <code>thunder</code> / <code>shape</code> / <code>water</code> / <code>cultivation</code> / <code>demonic</code> / <code>void</code> / <code>glitch</code> need WebGL2.',
		'docs.aura.p':
			'<code>target</code> is a selector or <code>HTMLElement</code>. Same as the class <code>attach()</code>. Missing node throws <code>agent-aura: target not found</code>.',
		'docs.lifecycle': 'Lifecycle',
		'docs.th.method': 'Method',
		'docs.th.behavior': 'Behavior',
		'docs.lifecycle.start': '<code>attach()</code> already calls this',
		'docs.lifecycle.pause': 'Stops rAF; canvas / wrapper stays',
		'docs.lifecycle.dispose':
			'Frees resources / observers, removes canvas or wrapper. Idempotent. start/pause after this throws',
		'docs.mount': 'Mounting',
		'docs.th.api': 'API',
		'docs.th.where': 'Parent',
		'docs.th.pos': 'Position',
		'docs.mount.glow': 'inside target',
		'docs.mount.glowPos': '<code>absolute; inset: 0</code>',
		'docs.mount.border': '<code>container</code> → non-body parent → <code>document.body</code>',
		'docs.mount.borderPos': 'absolute in container, else fixed, padded by <code>glowPadding</code>',
		'docs.mount.fire': '<code>container</code> or <code>document.body</code>',
		'docs.mount.firePos': 'fills container or viewport; particles follow the target border',
		'docs.mount.shape': '<code>container</code> or <code>document.body</code>',
		'docs.mount.shapePos': 'fills container or viewport; ribbon follows target outline',
		'docs.mount.water': '<code>container</code> or <code>document.body</code>',
		'docs.mount.waterPos': 'fills container or viewport; water follows target outline',
		'docs.mount.demonic': '<code>container</code> or <code>document.body</code>',
		'docs.mount.demonicPos': 'fills container or viewport; mist follows target outline',
		'docs.mount.thunder': '<code>container</code> or <code>document.body</code>',
		'docs.mount.thunderPos': 'fills container or viewport; lightning follows target outline',
		'docs.mount.void': '<code>container</code> or <code>document.body</code>',
		'docs.mount.voidPos': 'fills container or viewport; void ribbon follows target outline',
		'docs.mount.glitch': '<code>container</code> or <code>document.body</code>',
		'docs.mount.glitchPos': 'fills container or viewport; glitch ribbon follows target outline',
		'docs.mount.note':
			'Pass <code>container</code> for <code>border</code> / <code>fire</code> / <code>burning</code> / <code>thunder</code> / <code>shape</code> / <code>water</code> / <code>cultivation</code> / <code>demonic</code> / <code>void</code> / <code>glitch</code> in overflow / transform / scrolling panes.',
		'docs.glow.p':
			"Stream glow mask. Canvas is inserted into the target. Dark backgrounds: <code>mode: 'dark'</code>.",
		'docs.th.field': 'Field',
		'docs.th.default': 'Default',
		'docs.th.note': 'Notes',
		'docs.glow.mode': "<code>'dark' | 'light'</code>; no style works on both",
		'docs.glow.colors': 'blue / purple / orange / yellow',
		'docs.glow.colorsNote': 'exactly 4 <code>rgb(r, g, b)</code> strings',
		'docs.glow.borderWidth': 'solid stroke',
		'docs.glow.glowWidth': 'glow falloff',
		'docs.glow.radius': 'corner radius',
		'docs.glow.ratio': 'may be &lt; 1 to lower resolution',
		'docs.glow.extra':
			'Extra methods: <code>resize</code>, <code>autoResize</code>, <code>fadeIn()</code> / <code>fadeOut()</code> (300ms Promise). Capped ~32fps. No <code>container</code>.',
		'docs.border.p': 'A neural energy field flows around a rounded rect.',
		'docs.border.pad': 'extra canvas around the target',
		'docs.border.bw': 'core band',
		'docs.border.gw': 'outer spill',
		'docs.border.radius': 'match the card radius',
		'docs.border.speed': 'time scale',
		'docs.border.z': 'canvas z-index',
		'docs.border.extra': '<code>setTarget</code> / <code>setContainer</code> can retarget live.',
		'docs.fire.p': 'Fire along the border. No smoke, no heat haze.',
		'docs.fire.count': 'higher = denser, more GPU',
		'docs.fire.padding': 'border sample inset',
		'docs.fire.frame': '<code>(time: number) =&gt; void</code>, seconds',
		'docs.burning.p': 'Heavier fire + smoke + background heat.',
		'docs.burning.count': 'flame particles',
		'docs.burning.smoke': '<code>0</code> disables smoke',
		'docs.burning.glow': 'background heat haze',
		'docs.burning.padding': 'border sample inset',
		'docs.burning.note':
			'On laptops try 600–1000 particles and 150–300 smoke. <code>pause()</code> off-screen.',
		'docs.shape.p':
			'A shape-aware AI aura: WebGL2 ribbon along the outline + outer halo + energy dust. Follows the target <code>border-radius</code> and <code>clip-path</code>.',
		'docs.shape.offset': 'outward offset of the ribbon center in px',
		'docs.shape.width': 'main ribbon half-width in px',
		'docs.shape.outer': 'outer halo half-width in px',
		'docs.shape.dust': 'energy-dust particle count',
		'docs.shape.samples': 'outline sample count',
		'docs.shape.speed': 'global time scale',
		'docs.shape.corners': 'corner sampling segments',
		'docs.water.p':
			'A shape-aware liquid aura: WebGL2 contour bands + mist field + droplet particles. Follows the target <code>border-radius</code> and <code>clip-path</code>. Shares the ShapeField engine with immortal / demonic.',
		'docs.water.offset': 'outward offset of the water ring in px',
		'docs.water.field': 'outer mist particle count',
		'docs.water.detail': 'droplet particles along the outline',
		'docs.water.samples': 'outline sample count',
		'docs.water.speed': 'global time scale',
		'docs.water.corners': 'corner sampling segments',
		'docs.cultivation.p':
			'A shape-aware golden cultivation aura: WebGL2 spirit veins + mist field + spirit motes. Follows the target <code>border-radius</code> and <code>clip-path</code>. Shares the ShapeField engine with water / demonic.',
		'docs.cultivation.offset': 'outward offset of the spirit ring in px',
		'docs.cultivation.mist': 'outer mist particle count (fieldCount)',
		'docs.cultivation.spirit': 'spirit motes along the outline (detailCount)',
		'docs.cultivation.samples': 'outline sample count',
		'docs.cultivation.speed': 'global time scale',
		'docs.cultivation.corners': 'corner sampling segments',
		'docs.mount.cultivation': '<code>container</code> or <code>document.body</code>',
		'docs.mount.cultivationPos': 'fills container or viewport; spirit follows target outline',
		'docs.demonic.p':
			'A shape-aware demonic aura: WebGL2 violet veins + mist field + ember particles. Follows the target <code>border-radius</code> and <code>clip-path</code>. Shares the ShapeField engine with water / immortal.',
		'docs.demonic.offset': 'outward offset of the demonic ring in px',
		'docs.demonic.field': 'outer mist particle count',
		'docs.demonic.detail': 'ember particles along the outline',
		'docs.demonic.samples': 'outline sample count',
		'docs.demonic.speed': 'global time scale',
		'docs.demonic.corners': 'corner sampling segments',
		'docs.thunder.p':
			'A shape-aware thunder aura: WebGL2 lightning border + energy particles + outward arcs. Follows the target <code>border-radius</code> and <code>clip-path</code>.',
		'docs.thunder.offset': 'outward offset of the lightning ring in px',
		'docs.thunder.particles': 'energy particles racing along the outline',
		'docs.thunder.branches': 'max simultaneous outward arcs',
		'docs.thunder.interval': 'branch spawn interval baseline (ms)',
		'docs.thunder.corners': 'corner sampling segments',
		'docs.void.p':
			'A shape-aware void / blackhole aura: WebGL2 dark shadow ribbon + event horizon + violet highlights + void mist + sparks. Follows the target <code>border-radius</code> and <code>clip-path</code>.',
		'docs.void.offset': 'outward offset of the ring in px',
		'docs.void.shadow': 'shadow ribbon half-width in px',
		'docs.void.horizon': 'event-horizon ribbon half-width in px',
		'docs.void.highlight': 'highlight ribbon half-width in px',
		'docs.void.mist': 'void mist particle count',
		'docs.void.sparks': 'spark particle count',
		'docs.void.samples': 'outline sample count',
		'docs.void.speed': 'global time scale',
		'docs.void.corners': 'corner sampling segments',
		'docs.glitch.p':
			'A shape-aware glitch / collapse aura: WebGL2 RGB split + digital tears + edge dropouts + square data fragments. Follows the target <code>border-radius</code> and <code>clip-path</code>.',
		'docs.glitch.offset': 'outward offset of the ring in px',
		'docs.glitch.outer': 'outer noise ribbon half-width in px',
		'docs.glitch.rgb': 'RGB-split ribbon half-width in px',
		'docs.glitch.fragments': 'data-fragment particle count',
		'docs.glitch.burstMin': 'min burst interval in ms',
		'docs.glitch.burstMax': 'max burst interval in ms',
		'docs.glitch.burstDur': 'burst duration in ms',
		'docs.glitch.samples': 'outline sample count',
		'docs.glitch.speed': 'global time scale',
		'docs.glitch.corners': 'corner sampling segments',
		'docs.framework': 'Frameworks',
		'docs.framework.p':
			'Class exports: <code>Glow</code>, <code>MotionBorder</code>, <code>FireBorder</code>, <code>BurningFire</code>, <code>ShapeAura</code>, <code>WaterAura</code>, <code>CultivationAura</code>, <code>DemonicAura</code>, <code>ThunderAura</code>, <code>VoidAura</code>, <code>GlitchAura</code>. Prefer <code>aura.*</code> or <code>X.attach()</code>.',
	},
}

export function detectLang() {
	const query = new URLSearchParams(location.search).get('lang')
	if (query === 'en' || query === 'zh') return query
	try {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved === 'en' || saved === 'zh') return saved
	} catch {
		// private mode
	}
	return 'en'
}

export function applyI18n(lang = detectLang()) {
	const dict = messages[lang]
	if (!dict) return lang

	document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
	document.documentElement.dataset.lang = lang

	const page = document.documentElement.dataset.i18nPage
	if (page && dict[`${page}.title`]) document.title = dict[`${page}.title`]
	if (page && dict[`${page}.meta`]) {
		const meta = document.querySelector('meta[name="description"]')
		if (meta) meta.setAttribute('content', dict[`${page}.meta`])
	}

	for (const el of document.querySelectorAll('[data-i18n]')) {
		const value = dict[el.dataset.i18n]
		if (value != null) el.textContent = value
	}
	for (const el of document.querySelectorAll('[data-i18n-html]')) {
		const value = dict[el.dataset.i18nHtml]
		if (value != null) el.innerHTML = value
	}

	const github = document.querySelector('[data-github-docs]')
	if (github instanceof HTMLAnchorElement) {
		github.href =
			lang === 'zh'
				? 'https://github.com/wangmiaozero/agent-aura/blob/main/docs/api.zh-CN.md'
				: 'https://github.com/wangmiaozero/agent-aura/blob/main/docs/api.md'
	}

	for (const btn of document.querySelectorAll('[data-lang-toggle]')) {
		btn.textContent = lang === 'zh' ? 'EN' : '中文'
		btn.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文')
	}

	for (const link of document.querySelectorAll('a[href]')) {
		const href = link.getAttribute('href')
		if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
			continue
		}
		try {
			const url = new URL(href, location.href)
			if (url.origin !== location.origin) continue
			url.searchParams.set('lang', lang)
			link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`)
		} catch {
			// ignore invalid href
		}
	}

	document.dispatchEvent(new CustomEvent('agent-aura:lang', { detail: { lang } }))
	return lang
}

export function setLang(lang) {
	const next = lang === 'en' ? 'en' : 'zh'
	try {
		localStorage.setItem(STORAGE_KEY, next)
	} catch {
		// private mode
	}
	const url = new URL(location.href)
	url.searchParams.set('lang', next)
	history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
	applyI18n(next)
	return next
}

export function initI18n() {
	applyI18n()
	for (const btn of document.querySelectorAll('[data-lang-toggle]')) {
		btn.addEventListener('click', () => {
			setLang(detectLang() === 'zh' ? 'en' : 'zh')
		})
	}
}
