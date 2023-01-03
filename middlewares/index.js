const Collection = require('../models/Collection');

module.exports.requireAuth = redirectTo => (request, response, next) => {
  if (!request.isAuthenticated()) return response.redirect(redirectTo);
  else next();
};

module.exports.addUserToLocals = (request, response, next) => {
  response.locals.user = request.user;
  next();
};

module.exports.addCollectionsGetter = (request, response, next) => {
  let collections;
  response.locals.collections = () => {
    if (collections) return Promise.resolve(collections);
    return Collection.find({ $or: [{ public: true }, ...(request.user ? [{ author: request.user._id }] : [])] })
      .populate('author entity markerCount')
      .sort({ createdAt: -1 })
      .then(found => {
        collections = found;
        return collections;
      });
  };
  next();
};
