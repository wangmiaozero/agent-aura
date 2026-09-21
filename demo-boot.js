import { initCopyPromptButtons } from './ai-prompts.js'
import { detectLang, initI18n, messages } from './i18n.js'

export async function bootDemo(attach) {
	initI18n()
	initCopyPromptButtons()
	try {
		const { aura } = await import('./build/index.js')
		attach(aura)
	} catch (error) {
		console.error(error)
		const hint = document.querySelector('[data-build-hint]')
		if (hint) hint.textContent = messages[detectLang()]['home.buildHint']
	}
}
