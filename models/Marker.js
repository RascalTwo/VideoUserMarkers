const mongoose = require('mongoose')

const MarkerSchema = new mongoose.Schema({
	collectionId: {
		type: mongoose.Types.ObjectId,
		ref: 'Collection',
		required: true,
	},
	when: {
		type: Number,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	}
}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true },
});

module.exports = mongoose.model('Marker', MarkerSchema)