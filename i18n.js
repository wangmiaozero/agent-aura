import en from './i18n/en.js'
import ja from './i18n/ja.js'
import ko from './i18n/ko.js'
import zh from './i18n/zh.js'

const STORAGE_KEY = 'agent-aura-lang'

export const messages = { en, zh, ja, ko }

export const LANGS = ['en', 'zh', 'ja', 'ko']

const HTML_LANG = { en: 'en', zh: 'zh-CN', ja: 'ja', ko: 'ko' }

export function normalizeLang(value) {
	const code = String(value || '').toLowerCase()
	if (code.startsWith('zh')) return 'zh'
	if (code.startsWith('ja')) return 'ja'
	if (code.startsWith('ko')) return 'ko'
	if (code === 'en' || code.startsWith('en')) return 'en'
	return null
}

export function detectLang() {
	const query = normalizeLang(new URLSearchParams(location.search).get('lang'))
	if (query) return query
	try {
		const saved = normalizeLang(localStorage.getItem(STORAGE_KEY))
		if (saved) return saved
	} catch {
		// private mode
	}
	return normalizeLang(navigator.language) || 'en'
}

export function t(key, lang = detectLang()) {
	return messages[lang]?.[key] ?? messages.en[key] ?? key
}

function dictFor(lang) {
	if (lang === 'en' || lang === 'zh') return messages[lang]
	return { ...messages.en, ...messages[lang] }
}

export function applyI18n(lang = detectLang()) {
	const dict = dictFor(lang)
	if (!dict) return lang

	document.documentElement.lang = HTML_LANG[lang] || 'en'
	document.documentElement.dataset.lang = lang

	const titleKey = document.documentElement.dataset.i18nTitle
	const page = document.documentElement.dataset.i18nPage
	if (titleKey && dict[titleKey]) document.title = dict[titleKey]
	else if (page && dict[`${page}.title`]) document.title = dict[`${page}.title`]
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

	for (const select of document.querySelectorAll('[data-lang-select]')) {
		if (select instanceof HTMLSelectElement) select.value = lang
		select.setAttribute('aria-label', dict['lang.switch'] || 'Language')
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
	const next = normalizeLang(lang) || 'en'
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
	for (const select of document.querySelectorAll('[data-lang-select]')) {
		select.addEventListener('change', () => {
			if (select instanceof HTMLSelectElement) setLang(select.value)
		})
	}
}
