import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const build = join(root, 'build')

export const SUBPATHS = [
	'fire',
	'glow',
	'border',
	'shape',
	'water',
	'cultivation',
	'demonic',
	'thunder',
	'void',
	'glitch',
]

for (const name of SUBPATHS) {
	const dir = join(build, name)
	mkdirSync(dir, { recursive: true })
	writeFileSync(join(dir, 'index.d.ts'), `export * from '../entries/${name}.js'\n`)
}
