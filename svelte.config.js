// File: svelte.config.js

import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

    kit: {
        adapter: adapter({
            runtime: 'nodejs20.x'
        }),
		alias: {
			$components: 'src/app/components',
			$lib: 'src/lib',
			$styles: 'src/app/assets/styles',
			$assets: 'src/app/assets',
			$images: 'static/images',
			$videos: 'static/videos'
		}
	}
};

export default config;
