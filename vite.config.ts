import { defineConfig } from 'vite'

/**
 * Demo server only. Pages import the compressed library from ./build after `npm run build`.
 */
export default defineConfig({
	base: './',
	publicDir: 'public',
	server: {
		open: '/index.html',
	},
	preview: {
		open: true,
	},
})
