const Collection = require('../models/Collection');
const Entity = require('../models/Entity');
const Marker = require('../models/Marker');

module.exports.renderNewCollection = (_, response) =>
	response.render('collection/new', { title: 'New Collection' });

module.exports.renderEntity = async (request, response) => {
	const { entityId } = request.params;
	const refetch = 'refetch' in request.query && request.user.isAdmin;
	const entity = await Entity.getEntity(entityId, undefined, !refetch);
	if (!entity)
		return response.status(404).render('error', {
			title: 'Entity Not Found',
			heading: '404',
			preMessage: "Sorry, we couldn't find the entity with an ID of",
			message: entityId,
			postMessage: "Ensure it's valid YouTube/Twitch ID.",
		});
	await entity.populate({
		path: 'collections',
		populate: {
			path: 'author entity markerCount',
		},
	});
	return refetch
		? response.redirect(`/v/${entityId}`)
		: response.render('entity', { entity, title: entity.title });
};

function DHMStoSeconds(parts) {
	// seconds
	if (parts.length === 1) return parts[0];
	// minutes:seconds
	else if (parts.length === 2) return parts[0] * 60 + parts[1];
	// hours:minutes:seconds
	else if (parts.length === 3) return parts[0] * 60 * 60 + parts[1] * 60 + parts[2];
	// days:hours:minute:seconds
	return parts[0] * 60 * 60 * 24 + parts[1] * 60 * 60 + parts[2] * 60 + parts[3];
}

module.exports.createCollection = async (request, response) => {
	const { entity: entityInput, usingYoutube, title, description } = request.body;
	const type = usingYoutube ? 'YouTube' : 'Twitch';
	const public = request.body.public === true ? true : undefined;

	const entityId = entityInput.split('/').pop().split('?')[0];

	const entity = await Entity.getEntity(entityId, type);
	if (!entity)
		return response.status(404).render('error', {
			title: 'Entity Not Found',
			heading: '404',
			preMessage: "Sorry, we couldn't find the entity with an ID of",
			message: entityId,
			postMessage: `on ${type}, ensure you have the correct ID & Platform combination.`,
		});

	const collection = await Collection.create({
		entity,
		type,
		public,
		title,
		description: description || undefined,
		author: request.user._id,
	});
	if (request.body.markers) {
		const newMarkers = [];
		for (const line of request.body.markers
			.trim()
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean)) {
			let [dhms, title = '', description] = line.split(/\t| {2}/g);
			if (!title) {
				let titleParts = [];
				[dhms, ...titleParts] = line.split(' ');
				title = titleParts.join(' ');
			}
			if (!title) title = 'Untitled';

			const when = DHMStoSeconds(dhms.split(':').map(Number));
			newMarkers.push({
				collectionRef: collection._id,
				title,
				when,
				description: description || undefined,
			});
		}
		await Marker.create(newMarkers);
	}
	response.redirect(`/v/{${entityId}/${collection._id}`);
};

async function renderCollection(request, response, view) {
	const { id } = request.params;
	const collection = await Collection.findById(id).populate('author markers entity');
	if (!collection)
		return response.status(404).render('error', {
			title: 'Collection Not Found',
			heading: '404',
			preMessage: "Sorry, we couldn't find the collection with an ID of",
			message: id,
			postMessage: 'It may have been deleted or marked private.',
		});

	response.render('collection/' + view, {
		collection,
		title: collection.title + ' on ' + collection.entity.title,
	});
}

module.exports.renderCollection = async (request, response) => {
	return renderCollection(request, response, 'render');
};

module.exports.renderCollectionEmbed = async (request, response) => {
	return renderCollection(request, response, 'embed');
};

module.exports.updateCollection = async (request, response) => {
	const { id } = request.params;
	const { title, description, markers, public } = request.body;

	const collection = await Collection.findById(id).populate('markers');
	if (!collection)
		return response.status(404).render('error', {
			title: 'Collection Not Found',
			heading: '404',
			preMessage: "Sorry, we couldn't find the collection with an ID of",
			message: id,
			postMessage: 'It may have been deleted or marked private.',
		});
	else if (!request.user.isAdmin && !collection.author.equals(request.user._id))
		return response.status(403).render('error', {
			title: 'Unauthorized',
			heading: '403',
			postMessage: "You don't have permission to edit this collection.",
		});

	collection.title = title;
	collection.description = description || undefined;

	if (public) collection.public = true;
	else collection.public = undefined;

	if (markers) {
		const newMarkers = [];
		for (const [i, line] of markers
			.trim()
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean)
			.entries()) {
			let [dhms, title = '', description] = line.split(/\t| {2}/g);
			if (!title) {
				let titleParts = [];
				[dhms, ...titleParts] = line.split(' ');
				title = titleParts.join(' ');
			}
			if (!title) title = 'Untitled';

			const when = DHMStoSeconds(dhms.split(':').map(Number));
			const oldMarker = collection.markers[i];
			if (oldMarker) {
				oldMarker.title = title;
				oldMarker.when = when;
				oldMarker.description = description || undefined;
				await oldMarker.save();
			} else {
				newMarkers.push({
					collectionRef: collection._id,
					title,
					when,
					description: description || undefined,
				});
			}
		}
		await Marker.create(newMarkers);
	}
	await collection.save();
	response.redirect(`/v/{${collection.entity}/${collection._id}`);
};

module.exports.deleteCollection = async (request, response) => {
	const { id } = request.params;
	const collection = await Collection.findById(id).populate('markers');
	if (!collection)
		return response.status(404).render('error', {
			title: 'Collection Not Found',
			heading: '404',
			preMessage: "Sorry, we couldn't find the collection with an ID of",
			message: id,
			postMessage: 'It may have been deleted or marked private.',
		});
	else if (!request.user.isAdmin && !collection.author.equals(request.user._id))
		return response.status(404).render('error', {
			title: 'Unauthorized',
			heading: '403',
			postMessage: "You don't have permission to delete this collection.",
		});
	await collection.remove();
	await Marker.deleteMany({ collectionRef: collection._id });
	response.redirect('/profile/' + request.user.username);
};
