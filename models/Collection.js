const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema({
	entity: {
		type: String,
		ref: 'Entity',
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	public: {
		type: Boolean,
	}
}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true },
	timestamps: true,
})
CollectionSchema.virtual('markers', {
	ref: 'Marker',
	localField: '_id',
	foreignField: 'collectionRef',
})
CollectionSchema.virtual('markerCount', {
	ref: 'Marker',
	localField: '_id',
	foreignField: 'collectionRef',
	count: true,
})

module.exports = mongoose.model('Collection', CollectionSchema)