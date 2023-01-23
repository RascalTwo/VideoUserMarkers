module.exports = {
	jsonStripper: keys => (doc, ret) => {
		for (const key of keys) delete ret[key];
	},
};
