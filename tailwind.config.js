/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./views/**/*.jsx', './public/**/*.js'],
	theme: {
		extend: {
			screens: {
				hoverless: { raw: '(hover: none)' },
			},
		},
	},
	plugins: [],
	darkMode: 'class',
};
