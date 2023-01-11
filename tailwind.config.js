/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./views/**/*.ejs', './public/**/*.js'],
	theme: {
		extend: {
			screens: {
				hoverless: { raw: '(hover: none)' },
			},
		},
	},
	plugins: [],
};
