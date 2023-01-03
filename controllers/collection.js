const Collection = require('../models/Collection');
const Entity = require('../models/Entity');
const Marker = require('../models/Marker');

module.exports.renderNewCollection = (_, response) => response.render('collection/new');

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
  if (!entity) return response.status(404).send(`Entity not found on ${type}`);

  const collection = await Collection.create({ entity, type, public, title, description, author: request.user._id });
  if (request.body.markers) {
    const newMarkers = [];
    for (const line of request.body.markers
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)) {
      const [dhms, title, description] = line.split('\t');
      const when = DHMStoSeconds(dhms.split(':').map(Number));
      newMarkers.push({ collectionId: collection._id, title, when, description });
    }
    await Marker.create(newMarkers);
  }
  response.redirect(`/collection/${collection._id}`);
};

module.exports.renderCollection = async (request, response) => {
  const { id } = request.params;
  const collection = await Collection.findById(id).populate('author markers entity');
  if (!collection) return response.status(404).send('Collection not found');

  response.render('collection/render', { collection });
};

module.exports.updateCollection = async (request, response) => {
  const { id } = request.params;
  const { title, description } = request.body;

  const collection = await Collection.findById(id);
  if (!collection) return response.status(404).send('Collection not found');
  else if (!request.user.isAdmin && !collection.author.equals(request.user._id))
    return response.status(403).send('You are not authorized to edit this collection');

  collection.title = title;
  collection.description = description;
  await collection.save();
  response.redirect(`/collection/${collection._id}`);
};

module.exports.deleteCollection = async (request, response) => {
  const { id } = request.params;
  const collection = await Collection.findById(id);
  console.log(collection.author, 'vs', request.user._id);
  if (!collection) return response.status(404).send('Collection not found');
  else if (!request.user.isAdmin && !collection.author.equals(request.user._id))
    return response.status(403).send('You are not authorized to delete this collection');
  await collection.remove();
  response.redirect('/profile');
};
