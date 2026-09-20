import { defineConfig } from 'vite'

import { glslLoaderPlugin, replacePlugin } from './vite.plugins.ts'

const banner =
	'/*! agent-aura v' +
	(process.env.npm_package_version ?? '0.0.0') +
	' | MIT | https://github.com/wangmiaozero/agent-aura */'

export default defineConfig({
	build: {
		outDir: 'build',
		lib: {
			entry: 'src/index.ts',
			name: 'AgentAura',
			formats: ['es', 'iife'],
			fileName: (format) => (format === 'es' ? 'index.js' : 'agent-aura.min.js'),
		},
		sourcemap: false,
		minify: true,
		emptyOutDir: true,
		rollupOptions: {
			output: {
				banner,
				exports: 'named',
			},
		},
	},
	publicDir: false,
	plugins: [
		glslLoaderPlugin(),
		replacePlugin({
			__AGENT_AURA_VERSION__: JSON.stringify(process.env.npm_package_version),
		}),
	],
})
