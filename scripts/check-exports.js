import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function mustExist(rel) {
	const full = join(root, rel.replace(/^\.\//, ''))
	if (!existsSync(full)) {
		throw new Error(`export target missing: ${rel}`)
	}
}

function walkExports(exportsField) {
	const files = []
	for (const [key, value] of Object.entries(exportsField)) {
		if (typeof value === 'string') files.push({ key, path: value })
		else if (value && typeof value === 'object') {
			for (const cond of ['types', 'import', 'default']) {
				if (typeof value[cond] === 'string')
					files.push({ key: `${key} [${cond}]`, path: value[cond] })
			}
		}
	}
	return files
}

const targets = walkExports(pkg.exports)
for (const item of targets) {
	mustExist(item.path)
	console.log(`ok  ${item.key} -> ${item.path}`)
}

const extra = [
	'build/index.js',
	'build/index.d.ts',
	'build/agent-aura.min.js',
	'build/fire/index.js',
	'build/fire/index.d.ts',
	'build/glow/index.js',
	'build/border/index.js',
	'build/shape/index.js',
	'build/water/index.js',
	'build/cultivation/index.js',
	'build/demonic/index.js',
	'build/thunder/index.js',
	'build/void/index.js',
	'build/glitch/index.js',
	'build/glitch/index.d.ts',
]
for (const rel of extra) {
	mustExist(rel)
}

const fire = readFileSync(join(root, 'build/fire/index.js'), 'utf8')
if (!fire.includes('from') && !fire.includes('export')) {
	throw new Error('build/fire/index.js does not look like an ESM module')
}

console.log(`checked ${targets.length} export paths`)
