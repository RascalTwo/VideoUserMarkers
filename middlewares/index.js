const Collection = require('../models/Collection');
const ejsHelpers = require('../views/helpers');

module.exports.requireAuth = redirectTo => (request, response, next) => {
	if (!request.isAuthenticated()) return response.redirect(redirectTo);
	else next();
};

module.exports.requireAdmin = (request, response, next) => {
	if (!request.user?.isAdmin)
		return response.render('error', {
			title: 'Unauthorized',
			message: 'You are not authorized to view this page',
		});
	else next();
};

module.exports.addUserToLocals = (request, response, next) => {
	response.locals.user = request.user;
	next();
};

module.exports.addEJSHelpers = (request, response, next) => {
	Object.assign(response.locals, ejsHelpers);
	next();
};

module.exports.addURLToLocals = (request, response, next) => {
	response.locals.url = request.originalUrl;
	response.locals.query = request.query;
	response.locals.params = request.params;
	next();
};

module.exports.addCollectionsGetter = (request, response, next) => {
	let collections;
	response.locals.collections = () => {
		if (collections) return Promise.resolve(collections);
		return Collection.find({
			$or: [{ public: true }, ...(request.user ? [{ author: request.user._id }] : [])],
		})
			.populate('author entity markerCount')
			.sort({ createdAt: -1 })
			.then(found => {
				collections = found;
				return collections;
			});
	};
	next();
};
