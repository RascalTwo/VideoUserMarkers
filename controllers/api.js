const User = require('../models/User');
const Collection = require('../models/Collection');
const Marker = require('../models/Marker');
const Entity = require('../models/Entity');

const getUserFromToken = async request => {
  const token = request.headers.authorization?.split(' ')[1] || null;
  if (!token) {
    return null;
  }

  return await User.findOne({ token });
};

module.exports.getUser = async (request, response) => {
  return response.json(await getUserFromToken(request));
};

module.exports.generateToken = async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  if (!user) {
    return response.json({ message: 'Invalid Credentials' });
  }

  const isMatch = user.comparePassword(password);
  if (!isMatch) {
    return response.json({ message: 'Invalid Credentials' });
  }

  user.token = user.generateToken();
  await user.save();
  return response.json({ token: user.token });
};

module.exports.getCollections = async (request, response) => {
  const { type, entityId } = request.params;

  const user = await getUserFromToken(request);

  const query = { type, entity: entityId }
  if (user) query.$or = [{ author: user._id }, { public: true }]
  else query.public = true;

  return response.json(
    await Collection.find(query).populate(
      'author entity',
    ),
  );
};

module.exports.getCollection = async (request, response) => {
  const { id } = request.params;

  const user = await getUserFromToken(request);

  const query = { _id: id }
  if (user) query.$or = [{ author: user._id }, { public: true }]
  else query.public = true;

  return response.json(await Collection.find(query).populate('author markers entity'));
};

module.exports.upsertCollection = async (request, response) => {
  const { id } = request.params;

  const user = await getUserFromToken(request);
  if (!user) {
    return response.json({ message: 'Bad Credentials' });
  }

  const {
    entity: { _id: entityId, type },
    title,
    description,
    public,
    markers,
  } = request.body;

  const entity = await Entity.getEntity(entityId, type);
  if (!entity) return response.json({ message: `Entity does not exist on ${type}` });

  const collection = await Collection.findById(id).populate('author markers');
  if (!collection) {
    const newCollection = new Collection({
      _id: id,
      type,
      entity,
      author: user,
      title,
      description,
      public,
    });
    await newCollection.save();

    newCollection.markers = await Marker.insertMany(markers);
    return response.json(newCollection);
  }

  if (collection.author.id !== user.id) {
    return response.json({ message: 'Unauthorized' });
  }

  collection.entity = entity;
  collection.type = type;
  collection.title = title;
  collection.description = description;
  if (public) collection.public = public;
  else delete collection.public;

  const deletingMarkerIDs = [];
  for (const marker of collection.markers) {
    if (!markers.find(m => m._id === marker.id)) {
      deletingMarkerIDs.push(marker.id);
    }
  }
  await Marker.deleteMany({ _id: { $in: deletingMarkerIDs } });

  const newMarkers = [];
  for (const marker of markers) {
    if (collection.markers.find(t => t.id === marker._id)) {
      continue;
    }

    const newMarker = new Marker({
      ...marker,
      collection: collection._id,
    });

    await newMarker.save();
    newMarkers.push(newMarker);
  }

  for (const marker of markers) {
    const existingMarker = collection.markers.find(t => t.id === marker._id);
    if (!existingMarker) {
      continue;
    }

    existingMarker.when = marker.when;
    existingMarker.title = marker.title;
    existingMarker.description = marker.description;
    await existingMarker.save();
  }

  await collection.save();

  collection.markers = request.body.markers.map(marker => newMarkers.find(t => t.id === marker.id) || marker);
  return response.json(collection);
};
