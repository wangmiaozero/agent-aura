import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
	cwd: root,
	encoding: 'utf8',
})
const start = Math.min(
	...['[', '{'].map((ch) => {
		const i = raw.indexOf(ch)
		return i < 0 ? Number.POSITIVE_INFINITY : i
	})
)
if (!Number.isFinite(start)) throw new Error(`npm pack did not print JSON:\n${raw}`)
const report = JSON.parse(raw.slice(start))
const pack = Array.isArray(report) ? report[0] : report
const files = new Set((pack.files ?? []).map((item) => item.path || item))

const required = [
	'package.json',
	'build/index.js',
	'build/index.d.ts',
	'build/agent-aura.min.js',
	'build/fire/index.js',
	'build/fire/index.d.ts',
	'build/glow/index.js',
	'build/glow/index.d.ts',
	'build/border/index.js',
	'build/shape/index.js',
	'build/water/index.js',
	'build/cultivation/index.js',
	'build/demonic/index.js',
	'build/thunder/index.js',
	'build/void/index.js',
	'build/glitch/index.js',
	'build/glitch/index.d.ts',
	'docs/imports.md',
	'docs/imports.zh-CN.md',
]

const missingInPack = required.filter((path) => !files.has(path))
if (missingInPack.length) {
	throw new Error(`npm pack missing:\n  ${missingInPack.join('\n  ')}`)
}

console.log(`npm pack --dry-run ok (${files.size} files)`)
