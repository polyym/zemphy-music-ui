import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import svelteConfig from './svelte.config.js';

export default defineConfig([
	js.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	svelte.configs.recommended,
	unicorn.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					// Root config files that SvelteKit's generated tsconfig does not include.
					// `vite.config.ts` AND `sanity.config.ts` ARE picked up by the project
					// service (Sanity's config is statically discovered) and must NOT be
					// listed here.
					allowDefaultProject: ['eslint.config.js', 'svelte.config.js', 'vitest.config.ts']
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.svelte']
			},
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/require-await': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/filename-case': ['error', { case: 'kebabCase' }],
			// app.d.ts and barrel index files use `export {};` deliberately to mark
			// the file as an ES module without exporting symbols. This rule is too
			// strict for those well-established TypeScript idioms.
			'unicorn/require-module-specifiers': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: tseslint.parser,
				svelteConfig
			}
		},
		rules: {
			// `{@render snippet()}` invokes a Svelte 5 snippet and is structurally
			// a void expression in template position. The rule false-positives on
			// this legitimate Svelte 5 idiom.
			'@typescript-eslint/no-confusing-void-expression': 'off',
			// The home page uses hash-based intra-page jumps (#booking, #repertoire),
			// and song / social anchors are CMS-provided absolute URLs. resolve()
			// only applies to in-app route paths, neither of which we have here.
			'svelte/no-navigation-without-resolve': 'off',
			// Inline JSON-LD in svelte:head needs the literal `</script>` token to
			// close the script element from inside an {@html} string. The rule
			// doesn't model that inlining.
			'no-useless-escape': 'off'
		}
	},
	{
		files: ['**/*.test.ts'],
		rules: {
			'@typescript-eslint/no-floating-promises': 'off'
		}
	},
	{ ignores: ['build/', '.svelte-kit/', 'node_modules/', '.netlify/'] },
	prettierConfig
]);
