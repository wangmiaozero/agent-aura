import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dest = join(root, 'build-demo')
const buildDir = join(root, 'build')

rmSync(dest, { recursive: true, force: true })
mkdirSync(join(dest, 'build'), { recursive: true })

const htmlFiles = [
	'index.html',
	'docs.html',
	'i18n.js',
	'ai-prompts.js',
	'site.css',
	'demo-boot.js',
	'glow.html',
	'motion-border.html',
	'fire-border.html',
	'burning-fire.html',
	'shape.html',
	'water.html',
	'cultivation.html',
	'demonic.html',
	'thunder.html',
	'void.html',
	'glitch.html',
]

for (const file of htmlFiles) {
	cpSync(join(root, file), join(dest, file))
}

function copyJsTree(from, to) {
	for (const name of readdirSync(from, { withFileTypes: true })) {
		const src = join(from, name.name)
		const dst = join(to, name.name)
		if (name.isDirectory()) copyJsTree(src, dst)
		else if (name.name.endsWith('.js')) {
			mkdirSync(dirname(dst), { recursive: true })
			cpSync(src, dst)
		}
	}
}

copyJsTree(buildDir, join(dest, 'build'))
