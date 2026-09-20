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
	'glow.html',
	'motion-border.html',
	'fire-border.html',
	'burning-fire.html',
]

for (const file of htmlFiles) {
	cpSync(join(root, file), join(dest, file))
}

for (const file of readdirSync(buildDir)) {
	if (file.endsWith('.js')) {
		cpSync(join(buildDir, file), join(dest, 'build', file))
	}
}
