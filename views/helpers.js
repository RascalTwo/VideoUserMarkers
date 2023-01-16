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
	secondsToPTDuration(seconds) {
		return `PT${secondsToHMS(seconds, 'HMS')}`;
	},
	secondsToHuman(seconds) {
		return secondsToHMS(seconds, [' hours ', ' minutes ', ' seconds ']);
	},
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
	sortArrayBy: (array, key, descending = false) => {
		if (!key) return array;
		const sorted = array.sort((a, b) => {
			const aValue = a[key];
			const bValue = b[key];
			const hasAValue = aValue !== undefined && aValue !== null;
			const hasBValue = bValue !== undefined && bValue !== null;
			if (!hasAValue && !hasBValue) return 0;
			if (!hasAValue) return 1;
			if (!hasBValue) return -1;
			if (typeof aValue === 'number' && typeof bValue === 'number') return aValue - bValue;
			return aValue.toString().localeCompare(bValue.toString());
		});
		if (descending) sorted.reverse();
		return sorted;
	},
};
