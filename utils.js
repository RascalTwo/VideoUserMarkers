const marked = require('marked');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
	return `<a href="${href}" ${
		title ? `alt="${title}" title="${title}" ` : ' '
	}target="_blank" class="underline underline-offset-2 hover:underline-offset-1 hover:animate-pulse" rel="noopener noreferrer">${text}</a>`;
};

module.exports.markdownToHTML = async markdown => {
	return createDOMPurify(new JSDOM('').window).sanitize(await marked.parse(markdown, { renderer }));
};

module.exports.conditionalS = array => (array.length === 1 ? '' : 's');

module.exports.getTotalMarkers = collections =>
	collections.reduce(
		(total, collection) => total + (collection.markerCount ?? collection.markers.length),
		0
	);

module.exports.listToDescription = (lines, isDiscord) =>
	lines.length === 0
		? ''
		: ':' + (isDiscord ? '\n\n - ' : '') + lines.join(isDiscord ? '\n - ' : ', ');

module.exports.secondsToHMS = (seconds, delimiters = '::', minimalPlaces = 1) => {
	delimiters = [...delimiters];
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor((seconds % 3600) % 60);
	const parts = [h, m, s];
	while (parts[0] === 0 && parts.length > minimalPlaces) {
		parts.shift();
		delimiters.shift();
	}
	return parts
		.map(part => part.toString().padStart(2, '0') + (delimiters.shift() || ''))
		.join('');
};
