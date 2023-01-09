const Marker = require('../models/Marker');

module.exports.createMarker = async (req, res) => {
	const marker = await Marker.create(req.body);
	return res.json({ _id: marker._id });
};

module.exports.updateMarker = async (req, res) => {
	await Marker.findByIdAndUpdate(req.params.id, req.body);
	return res.json({});
};

module.exports.deleteMarker = async (req, res) => {
	await Marker.findByIdAndDelete(req.params.id);
	return res.json({});
};
