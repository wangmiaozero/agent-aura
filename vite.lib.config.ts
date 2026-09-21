import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

import { glslLoaderPlugin, replacePlugin } from './vite.plugins.ts'

const root = dirname(fileURLToPath(import.meta.url))
const banner =
	'/*! agent-aura v' +
	(process.env.npm_package_version ?? '0.0.0') +
	' | MIT | https://github.com/wangmiaozero/agent-aura */'

const plugins = [
	glslLoaderPlugin(),
	replacePlugin({
		__AGENT_AURA_VERSION__: JSON.stringify(process.env.npm_package_version),
	}),
]

export const entries = {
	index: resolve(root, 'src/index.ts'),
	'fire/index': resolve(root, 'src/entries/fire.ts'),
	'glow/index': resolve(root, 'src/entries/glow.ts'),
	'border/index': resolve(root, 'src/entries/border.ts'),
	'shape/index': resolve(root, 'src/entries/shape.ts'),
	'water/index': resolve(root, 'src/entries/water.ts'),
	'cultivation/index': resolve(root, 'src/entries/cultivation.ts'),
	'demonic/index': resolve(root, 'src/entries/demonic.ts'),
	'thunder/index': resolve(root, 'src/entries/thunder.ts'),
	'void/index': resolve(root, 'src/entries/void.ts'),
	'glitch/index': resolve(root, 'src/entries/glitch.ts'),
}

export default defineConfig({
	publicDir: false,
	plugins,
	build: {
		outDir: 'build',
		emptyOutDir: true,
		sourcemap: false,
		minify: true,
		lib: {
			entry: entries,
			formats: ['es'],
		},
		rollupOptions: {
			output: {
				banner,
				exports: 'named',
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name]-[hash].js',
			},
		},
	},
})
