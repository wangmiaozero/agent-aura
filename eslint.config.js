import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
	globalIgnores(['build/*', 'build-demo/*', 'node_modules', 'src/**/__*.ts', 'src/legacy/**']),
	js.configs.recommended,
	{
		files: ['**/*.ts'],
		extends: [tseslint.configs.recommended],
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
			ecmaVersion: 2022,
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
		},
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: { ...globals.browser, ...globals.node },
		},
	},
])
