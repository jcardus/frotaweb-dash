import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api/socket': 'ws://gps.rastreosat.com.br',
			'/api': 'http://gps.rastreosat.com.br',
		},
	},
	define: {
		'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
	},
});
