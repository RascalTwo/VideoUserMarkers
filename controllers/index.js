const User = require('../models/User');
const Collection = require('../models/Collection');
const Marker = require('../models/Marker');
const Entity = require('../models/Entity');

module.exports.renderHomepage = (_, response) => response.render('index', { title: 'Home' });

module.exports.renderProfile = async (request, response) => {
	const username = request.params.username || request.user?.username;
	if (!username) return response.redirect('/auth/login');

	const profiling = await User.findOne({ username }).populate({
		path: 'collections',
		populate: {
			path: 'author entity markerCount',
		},
		options: {
			sort: { createdAt: -1 },
		},
	});
	if (!profiling)
		return response.status(404).render('error', {
			title: 'User Not Found',
			heading: '404',
			preMessage: "Sorry, we couldn't find the user with a username of",
			message: username,
			postMessage: "But don't worry, you can find plenty of other things on our homepage.",
		});
	response.render('profile', {
		profiling,
		title: profiling.username + "'s Profile",
		meta: {
			image: profiling.avatarURL,
			description: `Author of ${profiling.collections.length.toLocaleString()} collections totaling ${profiling.collections
				.reduce((count, collection) => count + collection.markerCount, 0)
				.toLocaleString()} markers.`,
		},
	});
};

module.exports.deleteOrphans = async (request, response) => {
	const markers = await Marker.find().populate('collectionRef');
	const orphanedMarkers = markers.filter(m => !m.collectionRef);
	await Marker.deleteMany({ _id: { $in: orphanedMarkers.map(m => m._id) } });

	const collections = await Collection.find().populate('entity');
	const orphanedCollections = collections.filter(c => !c.entity);
	await Collection.deleteMany({
		_id: { $in: orphanedCollections.map(c => c._id) },
	});

	const entities = await Entity.find().populate('collectionCount');
	const orphanedEntities = entities.filter(e => !e.collectionCount);
	await Entity.deleteMany({ _id: { $in: orphanedEntities.map(e => e._id) } });

	request.flash(
		'success',
		`Deleted ${orphanedMarkers.length} orphaned markers, ${orphanedCollections.length} orphaned collections, and ${orphanedEntities.length} orphaned entities`
	);
	response.redirect('/profile/' + request.user.username);
};

module.exports.search = async (request, response) => {
	const search = request.query.search;
	const collections = await Collection.find({
		$or: [
			{ title: { $regex: search, $options: 'i' } },
			{ description: { $regex: search, $options: 'i' } },
		],
	}).populate({
		path: 'author entity markerCount',
	});
	const markers = await Marker.find({
		$or: [
			{ title: { $regex: search, $options: 'i' } },
			{ description: { $regex: search, $options: 'i' } },
		],
	}).populate({
		path: 'collectionRef',
		populate: {
			path: 'author entity markerCount',
		},
	});
	const matches = [
		...collections.map(e => ({ ...e.toObject(), type: 'collection' })),
		...markers.map(e => ({ ...e.toObject(), type: 'marker' })),
	].sort((a, b) => {
		const aRatio =
			(a.title.match(new RegExp(search, 'gi'))?.length || 0) +
			(a.description?.match(new RegExp(search, 'gi'))?.length || 0) /
				(a.title.length + a.description?.length ?? 0);
		const bRatio =
			(b.title.match(new RegExp(search, 'gi'))?.length || 0) +
			(b.description?.match(new RegExp(search, 'gi'))?.length || 0) /
				(b.title.length + b.description?.length ?? 0);
		return bRatio - aRatio;
	});
	response.render('search', {
		search,
		matches,
		title: `Search for "${search}"`,
		meta: {
			description: `Found ${collections.length} collections and ${markers.length} markers searching for "${search}"`,
		},
	});
};
