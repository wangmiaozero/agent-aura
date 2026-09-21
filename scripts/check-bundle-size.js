import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const build = join(root, 'build')

const SUBPATHS = [
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

function kb(bytes) {
	return `${(bytes / 1024).toFixed(2)} KB`
}

function gzipSize(buf) {
	return gzipSync(buf).length
}

function collectJs(file, seen = new Set()) {
	const resolved = file.endsWith('.js') ? file : `${file}.js`
	if (seen.has(resolved) || !existsSync(resolved)) return seen
	seen.add(resolved)
	const code = readFileSync(resolved, 'utf8')
	for (const match of code.matchAll(/from\s*["'](\.[^"']+)["']/g)) {
		const next = join(dirname(resolved), match[1])
		collectJs(next, seen)
	}
	return seen
}

function graphSize(entry) {
	const files = [...collectJs(entry)]
	let raw = 0
	const parts = []
	for (const file of files) {
		const buf = readFileSync(file)
		raw += buf.length
		parts.push(buf)
	}
	return { raw, gzip: gzipSize(Buffer.concat(parts)), files }
}

function dirSize(dir) {
	if (!existsSync(dir)) return { raw: 0, gzip: 0 }
	let raw = 0
	const parts = []
	const walk = (current) => {
		for (const name of readdirSync(current)) {
			const full = join(current, name)
			if (statSync(full).isDirectory()) walk(full)
			else if (name.endsWith('.js')) {
				const buf = readFileSync(full)
				raw += buf.length
				parts.push(buf)
			}
		}
	}
	walk(dir)
	return { raw, gzip: parts.length ? gzipSize(Buffer.concat(parts)) : 0 }
}

function pad(label, width = 18) {
	return label.padEnd(width)
}

const rows = []
const chunkDir = join(build, 'chunks')
const shared = dirSize(chunkDir)
rows.push(['core/shared', shared])

for (const name of SUBPATHS) {
	rows.push([name, graphSize(join(build, name, 'index.js'))])
}

const fullEsm = graphSize(join(build, 'index.js'))
rows.push(['full ESM', fullEsm])

const iifePath = join(build, 'agent-aura.min.js')
if (!existsSync(iifePath)) {
	throw new Error('missing build/agent-aura.min.js')
}
const iifeBuf = readFileSync(iifePath)
rows.push(['full IIFE', { raw: iifeBuf.length, gzip: gzipSize(iifeBuf) }])

console.log('Agent Aura Bundle Size')
console.log('')
console.log(`${pad('entry')}${pad('raw', 14)}${pad('gzip', 14)}`)
console.log('-'.repeat(46))
for (const [label, size] of rows) {
	console.log(`${pad(label)}${pad(kb(size.raw), 14)}${pad(kb(size.gzip), 14)}`)
}
