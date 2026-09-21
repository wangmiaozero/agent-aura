import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

import { glslLoaderPlugin, replacePlugin } from './vite.plugins.ts'

const root = dirname(fileURLToPath(import.meta.url))
const banner =
	'/*! agent-aura v' +
	(process.env.npm_package_version ?? '0.0.0') +
	' | MIT | https://github.com/wangmiaozero/agent-aura */'

export default defineConfig({
	publicDir: false,
	plugins: [
		glslLoaderPlugin(),
		replacePlugin({
			__AGENT_AURA_VERSION__: JSON.stringify(process.env.npm_package_version),
		}),
	],
	build: {
		outDir: 'build',
		emptyOutDir: false,
		sourcemap: false,
		minify: true,
		lib: {
			entry: resolve(root, 'src/index.ts'),
			name: 'AgentAura',
			formats: ['iife'],
			fileName: () => 'agent-aura.min.js',
		},
		rollupOptions: {
			output: {
				banner,
				exports: 'named',
			},
		},
	},
})
