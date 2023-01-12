const { NODE_ENV } = require('./config/constants.js');

module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		...(NODE_ENV === 'production' ? { cssnano: {} } : {}),
	},
};
