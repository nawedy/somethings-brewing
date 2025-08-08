// tailwind.config.cjs
module.exports = {
	content: ['./src/**/*.{html,js,svelte}', './src/app/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				cream: '#f5e9dd',
				macchiato: '#6E4A31',
				mocha: '#342721'
			},
			fontFamily: {
				serif: ['Georgia', 'serif'],
				sans: ['Inter', 'sans-serif']
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				coffee: {
					primary: '#C49A6C',
					secondary: '#B5A18E',
					accent: '#ead9c7',
					neutral: '#342721',
					'base-100': '#f5e9dd',
					info: '#a3c4f3',
					success: '#9dd9d2',
					warning: '#f5c396',
					error: '#f28b82'
				}
			}
		],
		darkTheme: 'coffee'
	}
};
