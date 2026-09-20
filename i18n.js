const STORAGE_KEY = 'agent-aura-lang'

export const messages = {
	zh: {
		'home.title': 'Agent Aura — Make Agents Pretty',
		'home.meta':
			'给 Agent UI 用的零依赖 WebGL2 特效：流光遮罩、神经光场边框、火焰燃烧框和超频燃烧生命态。',
		'docs.title': 'Agent Aura — API',
		'docs.meta': 'agent-aura API：aura.glow / border / fire / burning 完整参数与生命周期。',
		'nav.glow': 'Glow',
		'nav.border': 'Border',
		'nav.fire': 'Fire',
		'nav.burning': 'Burning',
		'nav.demo': '演示',
		'nav.api': 'API',
		'nav.githubDocs': 'GitHub 文档',
		'home.lead':
			'给 Agent UI 用的零依赖 WebGL2 特效库：流光遮罩、神经光场边框、火焰燃烧框和超频燃烧生命态。',
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
		'home.buildHint': '请先运行 npm run build，再刷新页面',
		'docs.lead':
			'四种特效同一套生命周期：<code>attach</code> 自动挂 canvas 并播放，<code>pause</code> / <code>start</code> 控制循环，卸载时 <code>dispose()</code>。完整 Markdown 版在仓库 <code>docs/api.zh-CN.md</code>。',
		'docs.toc.install': '安装',
		'docs.toc.aura': 'aura',
		'docs.toc.lifecycle': '生命周期',
		'docs.toc.mount': 'Canvas 挂载',
		'docs.toc.glow': 'glow',
		'docs.toc.border': 'border',
		'docs.toc.fire': 'fire',
		'docs.toc.burning': 'burning',
		'docs.toc.framework': '框架',
		'docs.install': '安装',
		'docs.install.cdn':
			'CDN：<code>https://unpkg.com/agent-aura/build/agent-aura.min.js</code>，全局 <code>AgentAura</code>。包是 ESM，没有 CJS。浏览器需要 WebGL2。',
		'docs.aura.p':
			'<code>target</code> 是选择器或 <code>HTMLElement</code>。等价于对应 class 的 <code>attach()</code>。找不到节点抛 <code>agent-aura: target not found</code>。',
		'docs.lifecycle': '生命周期',
		'docs.th.method': '方法',
		'docs.th.behavior': '行为',
		'docs.lifecycle.start': '<code>attach()</code> 已调用，一般不用再调',
		'docs.lifecycle.pause': '停 rAF，canvas 留着',
		'docs.lifecycle.dispose': '释放 WebGL / Observer / canvas，幂等。之后再 start/pause 会抛错',
		'docs.mount': 'Canvas 挂载',
		'docs.th.api': 'API',
		'docs.th.where': '挂到哪',
		'docs.th.pos': '定位',
		'docs.mount.glow': 'target 内部',
		'docs.mount.glowPos': '<code>absolute; inset: 0</code>',
		'docs.mount.border': '<code>container</code> → 非 body parent → <code>document.body</code>',
		'docs.mount.borderPos': '容器内 absolute，否则 fixed，外扩 <code>glowPadding</code>',
		'docs.mount.fire': '<code>container</code> 或 <code>document.body</code>',
		'docs.mount.firePos': '铺满容器或视口，粒子沿 target 边框',
		'docs.mount.note': '卡片在 overflow / transform / 滚动容器里时必须传 <code>container</code>。',
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
		'docs.framework': '框架',
		'docs.framework.p':
			'class 导出：<code>Glow</code>、<code>MotionBorder</code>、<code>FireBorder</code>、<code>BurningFire</code>。<code>new X()</code> 不会自动 append / start，要用 <code>X.attach()</code>。',
	},
	en: {
		'home.title': 'Agent Aura — Make Agents Pretty',
		'home.meta':
			'Zero-dependency WebGL2 effects for Agent UIs: stream glow masks, neural energy borders, burning fire, and overclock-life flames.',
		'docs.title': 'Agent Aura — API',
		'docs.meta': 'agent-aura API: aura.glow / border / fire / burning options and lifecycle.',
		'nav.glow': 'Glow',
		'nav.border': 'Border',
		'nav.fire': 'Fire',
		'nav.burning': 'Burning',
		'nav.demo': 'Demo',
		'nav.api': 'API',
		'nav.githubDocs': 'GitHub docs',
		'home.lead':
			'Zero-dependency WebGL2 effects for Agent UIs: stream glow masks, neural energy borders, fire frames, and overclock-life flames.',
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
		'home.buildHint': 'Run npm run build first, then refresh.',
		'docs.lead':
			'All four effects share one lifecycle: <code>attach</code> mounts the canvas and plays, <code>pause</code> / <code>start</code> control the loop, <code>dispose()</code> on unmount. Full Markdown lives at <code>docs/api.md</code>.',
		'docs.toc.install': 'Install',
		'docs.toc.aura': 'aura',
		'docs.toc.lifecycle': 'Lifecycle',
		'docs.toc.mount': 'Canvas mounting',
		'docs.toc.glow': 'glow',
		'docs.toc.border': 'border',
		'docs.toc.fire': 'fire',
		'docs.toc.burning': 'burning',
		'docs.toc.framework': 'Frameworks',
		'docs.install': 'Install',
		'docs.install.cdn':
			'CDN: <code>https://unpkg.com/agent-aura/build/agent-aura.min.js</code>, global <code>AgentAura</code>. ESM only, no CJS. Browser needs WebGL2.',
		'docs.aura.p':
			'<code>target</code> is a selector or <code>HTMLElement</code>. Same as the class <code>attach()</code>. Missing node throws <code>agent-aura: target not found</code>.',
		'docs.lifecycle': 'Lifecycle',
		'docs.th.method': 'Method',
		'docs.th.behavior': 'Behavior',
		'docs.lifecycle.start': '<code>attach()</code> already calls this',
		'docs.lifecycle.pause': 'Stops rAF; canvas stays',
		'docs.lifecycle.dispose':
			'Frees WebGL / observers / canvas. Idempotent. start/pause after this throws',
		'docs.mount': 'Canvas mounting',
		'docs.th.api': 'API',
		'docs.th.where': 'Parent',
		'docs.th.pos': 'Position',
		'docs.mount.glow': 'inside target',
		'docs.mount.glowPos': '<code>absolute; inset: 0</code>',
		'docs.mount.border': '<code>container</code> → non-body parent → <code>document.body</code>',
		'docs.mount.borderPos': 'absolute in container, else fixed, padded by <code>glowPadding</code>',
		'docs.mount.fire': '<code>container</code> or <code>document.body</code>',
		'docs.mount.firePos': 'fills container or viewport; particles follow the target border',
		'docs.mount.note':
			'Pass <code>container</code> when the card lives in overflow / transform / a scrolling pane.',
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
		'docs.framework': 'Frameworks',
		'docs.framework.p':
			'Class exports: <code>Glow</code>, <code>MotionBorder</code>, <code>FireBorder</code>, <code>BurningFire</code>. <code>new X()</code> does not append or start; use <code>X.attach()</code>.',
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
	return (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'
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
