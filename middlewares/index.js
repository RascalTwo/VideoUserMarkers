const { NODE_ENV } = require('../config/constants');
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

module.exports.addNodeEnvToLocals = (request, response, next) => {
	response.locals.NODE_ENV = NODE_ENV;
	next();
};

module.exports.addHeadersToLocals = (request, response, next) => {
	response.locals.isDiscordbot = request.headers['user-agent'].includes('Discordbot');
	response.locals.origin = `http${request.secure ? 's' : ''}://${request.headers['host']}`;
	next();
};

module.exports.addURLToLocals = (request, response, next) => {
	response.locals.path = request.path;
	response.locals.url = request.originalUrl;
	response.locals.query = request.query;
	response.locals.params = request.params;
	next();
};

module.exports.setDefaultSorting =
	(sort = 'createdAt', descending = false) =>
		(request, _, next) => {
			if (request.query.sort === undefined) {
				request.query.sort = sort;
				// As descending can be undefined by user-choice, only change if no sorting is happening at all
				request.query.descending = descending;
			}
			next();
		};
