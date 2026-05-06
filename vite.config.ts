import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			// Whitelist `sanity.config.ts` at the project root for the dev
			// server. The dynamic `import('../../../sanity.config')` in
			// `src/lib/sanity/studio-mount.svelte` resolves to a file outside
			// SvelteKit's default allow list (src, .svelte-kit, node_modules),
			// so `npm run dev` returns the "outside of Vite serving allow list"
			// 403 when /studio loads. Production builds bundle the chunk ahead
			// of time, so this only matters in dev.
			allow: [path.join(import.meta.dirname, 'sanity.config.ts')]
		}
	}
});
