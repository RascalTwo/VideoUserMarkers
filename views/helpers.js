const { secondsToHMS } = require('../utils.js');

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
			if (aValue instanceof Date && bValue instanceof Date) return aValue - bValue;
			return aValue.toString().localeCompare(bValue.toString());
		});
		if (descending) sorted.reverse();
		return sorted;
	},
};
