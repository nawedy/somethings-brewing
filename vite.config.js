// File: vite.config.js

import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { svelteTesting } from '@testing-library/svelte/vite';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Setup for __dirname in ESM
const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		sveltekit(),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],

	// Define environment variables for build-time
	define: {
		'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(
			process.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
		),
		'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
			process.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
		)
	},

	resolve: {
		alias: {
			$components: path.resolve(dirname, 'src/app/components'),
			$lib: path.resolve(dirname, 'src/lib'),
			$routes: path.resolve(dirname, 'src/routes'),
			$layouts: path.resolve(dirname, 'src/layouts'),
			$assets: path.resolve(dirname, 'src/assets'),
			$images: path.resolve(dirname, 'static/images'),
			$videos: path.resolve(dirname, 'static/videos')
		}
	},

  build: {
    sourcemap: false,
    minify: 'esbuild'
  },

	test: {
		workspace: [
			{
				extends: './vite.config.js',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.js']
				}
			},
			{
				extends: './vite.config.js',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			},
			{
				extends: true,
				plugins: [
					storybookTest({
						configDir: path.join(dirname, '.storybook')
					})
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					setupFiles: ['.storybook/vitest.setup.ts']
				}
			}
		]
	}
});
