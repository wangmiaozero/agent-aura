import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { build } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = join(root, 'tmp/tree-shake')

function collectGraph(entry, seen = new Set()) {
	const resolved = entry.endsWith('.js') ? entry : `${entry}.js`
	if (seen.has(resolved) || !existsSync(resolved)) return seen
	seen.add(resolved)
	const code = readFileSync(resolved, 'utf8')
	for (const match of code.matchAll(/from\s*["'](\.[^"']+)["']/g)) {
		collectGraph(join(dirname(resolved), match[1]), seen)
	}
	return seen
}

function graphSource(entry) {
	return [...collectGraph(entry)].map((file) => readFileSync(file, 'utf8')).join('\n')
}

function assertForbidden(label, source, needles) {
	const hits = needles.filter((needle) => source.includes(needle))
	if (hits.length) {
		throw new Error(`${label} leaked:\n  ${hits.join('\n  ')}`)
	}
	console.log(`ok  ${label}: no leaked effects`)
}

function assertContains(label, source, needle) {
	if (!source.includes(needle)) {
		throw new Error(`${label} missing expected marker: ${needle}`)
	}
}

function kb(bytes) {
	return `${(bytes / 1024).toFixed(2)} KB`
}

const fireSource = graphSource(join(root, 'build/fire/index.js'))
assertContains('fire graph', fireSource, 'Fire instance has been disposed')
assertForbidden('fire graph', fireSource, [
	'glitch-aura',
	'void-aura',
	'shape-aura',
	'shape-field',
	'ThunderAura instance has been disposed',
	'Glow instance has been disposed',
	'motion border geometry',
	'GlitchAura instance has been disposed',
	'VoidAura instance has been disposed',
	'ShapeFieldAura instance has been disposed',
])

const glitchSource = graphSource(join(root, 'build/glitch/index.js'))
assertContains('glitch graph', glitchSource, 'glitch-aura')
assertForbidden('glitch graph', glitchSource, [
	'Fire instance has been disposed',
	'void-aura',
	'shape-field',
	'Failed to create thunder geometry',
	'Glow instance has been disposed',
])

rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })
writeFileSync(
	join(tmp, 'fire-only.js'),
	`import { fire } from ${JSON.stringify(join(root, 'build/fire/index.js'))}\nfire('#app')\n`
)
writeFileSync(
	join(tmp, 'glitch-only.js'),
	`import { glitch } from ${JSON.stringify(join(root, 'build/glitch/index.js'))}\nglitch('#app')\n`
)
writeFileSync(
	join(tmp, 'lazy-glitch.js'),
	`export async function load() {\n  const { glitch } = await import(${JSON.stringify(join(root, 'build/glitch/index.js'))})\n  return glitch\n}\n`
)

async function bundle(entry, outName, inlineDynamicImports) {
	const outDir = join(tmp, 'out', outName)
	await build({
		configFile: false,
		root,
		publicDir: false,
		logLevel: 'error',
		build: {
			outDir,
			emptyOutDir: true,
			minify: false,
			write: true,
			lib: {
				entry,
				formats: ['es'],
				fileName: () => 'entry.js',
			},
			rollupOptions: {
				output: {
					inlineDynamicImports,
					chunkFileNames: 'chunks/[name].js',
				},
			},
		},
	})
	const entryCode = readFileSync(join(outDir, 'entry.js'), 'utf8')
	let all = entryCode
	const chunkDir = join(outDir, 'chunks')
	if (existsSync(chunkDir)) {
		for (const name of readdirSync(chunkDir)) {
			all += `\n${readFileSync(join(chunkDir, name), 'utf8')}`
		}
	}
	return { entry: entryCode, all, raw: Buffer.byteLength(all), gzip: gzipSync(all).length }
}

const fireBundle = await bundle(join(tmp, 'fire-only.js'), 'fire', true)
assertForbidden('fire-only bundle', fireBundle.all, [
	'glitch-aura',
	'void-aura',
	'shape-field',
	'ThunderAura instance has been disposed',
	'GlitchAura instance has been disposed',
])
assertContains('fire-only bundle', fireBundle.all, 'Fire instance has been disposed')
console.log(`fire-only consumer bundle  raw ${kb(fireBundle.raw)}  gzip ${kb(fireBundle.gzip)}`)

const glitchBundle = await bundle(join(tmp, 'glitch-only.js'), 'glitch', true)
assertForbidden('glitch-only bundle', glitchBundle.all, [
	'Fire instance has been disposed',
	'void-aura',
	'shape-field',
])
assertContains('glitch-only bundle', glitchBundle.all, 'glitch-aura')
console.log(
	`glitch-only consumer bundle  raw ${kb(glitchBundle.raw)}  gzip ${kb(glitchBundle.gzip)}`
)

const lazyBundle = await bundle(join(tmp, 'lazy-glitch.js'), 'lazy', false)
if (lazyBundle.entry.includes('glitch-aura') && !lazyBundle.entry.includes('import(')) {
	throw new Error('lazy glitch entry inlined the effect instead of forming a chunk')
}
assertContains('lazy glitch chunks', lazyBundle.all, 'glitch-aura')
assertForbidden('lazy glitch chunks', lazyBundle.all, [
	'Fire instance has been disposed',
	'shape-field',
])
console.log('ok  lazy import formed an independent glitch chunk')

console.log('tree-shaking and dynamic import checks passed')
