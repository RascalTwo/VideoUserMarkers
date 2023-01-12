const marked = require('marked');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const { secondsToHMS } = require('../utils.js');

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
	return `<a href="${href}" ${
		title ? `alt="${title}" title="${title}" ` : ' '
	}target="_blank" class="underline underline-offset-2 hover:underline-offset-1" rel="noopener noreferrer">${text}</a>`;
};

module.exports = {
	secondsToHMS,
	hmsToSeconds(hms) {
		return hms
			.split(/(\d+[a-z]+)/i)
			.filter(Boolean)
			.reduce((seconds, string) => {
				const multiplier = string.endsWith('h') ? 3600 : string.endsWith('m') ? 60 : 1;
				console.log(parseInt(string), multiplier, parseInt(string) * multiplier);
				return seconds + parseInt(string) * multiplier;
			}, 0);
	},
	async markdownToHTML(markdown) {
		return createDOMPurify(new JSDOM('').window).sanitize(
			await marked.parse(markdown, { renderer })
		);
	},
};
