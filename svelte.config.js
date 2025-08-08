// File: svelte.config.js

import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/app/components',
			$lib: 'src/lib',
			$styles: 'src/app/styles',
			$assets: 'src/assets',
			$images: 'static/images',
			$videos: 'static/videos'
		}
	}
};

export default config;
