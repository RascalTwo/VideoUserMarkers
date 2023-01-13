const Marker = require('../models/Marker');

module.exports.createMarker = async (req, res) => {
	const marker = await Marker.create(req.body);

	await marker.populate('collectionRef');

	const collection = marker.collectionRef;
	collection.updatedAt = Date.now();
	await collection.save();

	return res.json({ markerId: marker._id, collectionUpdatedAt: collection.updatedAt });
};

module.exports.updateMarker = async (req, res) => {
	const marker = await Marker.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		populate: 'collectionRef',
	});

	const collection = marker.collectionRef;
	collection.updatedAt = Date.now();
	await collection.save();

	return res.json({
		marker,
		collectionUpdatedAt: collection.updatedAt,
	});
};

module.exports.deleteMarker = async (req, res) => {
	const marker = await Marker.findByIdAndDelete(req.params.id, { populate: 'collectionRef' });

	const collection = marker.collectionRef;
	collection.updatedAt = Date.now();
	await collection.save();

	return res.json({ collectionUpdatedAt: collection.updatedAt });
};
