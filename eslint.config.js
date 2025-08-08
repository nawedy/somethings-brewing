import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';

export default [
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/']
	},
	prettier,
	...svelte.configs.prettier
];
