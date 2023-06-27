const mongoose = require('mongoose');
const { jsonStripper } = require('./helpers');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const he = require('he');

const EntitySchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ['YouTube', 'Twitch', 'File'],
			required: true,
		},
		rawThumbnail: {
			type: String,
			required: false,
		},
		title: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			required: false,
		},
		duration: {
			type: Number,
			required: false,
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true, versionKey: false, transform: jsonStripper('id') },
		timestamps: { createdAt: false },
	}
);
EntitySchema.virtual('collections', {
	ref: 'Collection',
	localField: '_id',
	foreignField: 'entity',
});
EntitySchema.virtual('collectionCount', {
	ref: 'Collection',
	localField: '_id',
	foreignField: 'entity',
	count: true,
});
EntitySchema.virtual('thumbnail').get(function () {
	if (this.type === 'YouTube') return `https://img.youtube.com/vi/${this._id}/maxresdefault.jpg`;
	if (this.type === 'File') return this.id;
	return this.rawThumbnail || null;
});
EntitySchema.static('typeFromID', function (id) {
	if (id.length === 10) return 'Twitch';
	else if (id.length === 11) return 'YouTube';
	return 'File';
});
EntitySchema.static('doesEntityExist', async function (id, type) {
	if (type === 'YouTube') {
		const response = await fetch(new this({ _id: id, type }).thumbnail, {
			method: 'OPTIONS',
		});
		return response.status !== 404;
	} else if (type === 'Twitch') {
		const url = new URL(`https://twitch.tv/videos/${id}`);
		await fetch(url); // First Twitch.tv fetch doesn't always have the information for some reason
		const response = await fetch(url);
		const html = await response.text();
		return html.includes('<meta property="og:video"');
	} else if (type === 'File') {
		const response = await fetch(id);
		return response.ok;
	}
	return null;
});
EntitySchema.static('getEntity', async function (id, type = this.typeFromID(id), useCache = true) {
	const found = await this.findById(id);
	if (useCache && found) return found;

	if (!(await this.doesEntityExist(id, type))) return null;

	const info = await this.fetchEntityInfo(id, type);

	let entity;
	if (found) {
		Object.assign(found, info);
		await found.save();
		entity = found;
	} else {
		entity = await this.create({ _id: id, type, ...info });
	}
	return entity;
});
EntitySchema.static('fetchEntityInfo', async function (id, type) {
	if (type === 'YouTube') {
		const url = new URL('https://www.youtube.com/watch');
		url.searchParams.set('v', id);
		const response = await fetch(url.toString());
		const html = await response.text();
		return {
			title: he.decode(html.split('<meta itemprop="name" content="')[1].split('">')[0]),
			createdAt: new Date(html.split('<meta itemprop="datePublished" content="')[1].split('">')[0]),
			duration: html
				.split('<meta itemprop="duration" content="')[1]
				.split('">')[0]
				.split('PT')[1]
				.split(/(\d+[a-z]+)/i)
				.filter(Boolean)
				.reduce((seconds, string) => {
					const multiplier = string.endsWith('H') ? 3600 : string.endsWith('M') ? 60 : 1;
					return seconds + parseInt(string) * multiplier;
				}, 0),
		};
	} else if (type === 'Twitch') {
		const url = `https://www.twitch.tv/videos/${id}`;
		await fetch(url); // First Twitch.tv fetch doesn't always have the information for some reason
		const response = await fetch(url);
		const html = await response.text();
		const ldJSON = JSON.parse(
			html.split('<script type="application/ld+json">')[1].split('</script>')[0]
		)[0];
		return {
			title: he.decode(ldJSON.name),
			createdAt: new Date(ldJSON.uploadDate),
			rawThumbnail: ldJSON.thumbnailUrl[0].includes('404_processing')
				? 'https://assets.help.twitch.tv/article/img/000002222-01a.png'
				: ldJSON.thumbnailUrl[0],
		};
	} else if (type === 'File')
		return {
			title: he.decode(id.split('/').pop().split('?')[0]),
		};
	return null;
});
EntitySchema.method('fetchInitialMarkers', async function () {
	if (this.type !== 'YouTube') return [];
	const response = await fetch(`https://www.youtube.com/watch?v=${this._id}`);
	const html = await response.text();
	const ytInitialData = JSON.parse(html.split('ytInitialData = ')[1].split(';</script>')[0]);
	const rawChapters =
		ytInitialData?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap?.find(
			map => map.key === 'DESCRIPTION_CHAPTERS'
		)?.value?.chapters ?? [];
	const markers = rawChapters.map(({ chapterRenderer }) => ({
		when: chapterRenderer.timeRangeStartMillis / 1000,
		title: chapterRenderer.title.simpleText,
	}));
	return markers;
});

module.exports = mongoose.model('Entity', EntitySchema);
