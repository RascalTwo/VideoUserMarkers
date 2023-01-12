const express = require('express');
const ejs = require('ejs');
const cors = require('cors');
const methodOverride = require('method-override');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const { PORT, SESSION_SECRET, DISABLE_MORGAN, NODE_ENV } = require('./config/constants');
const {
	addNodeEnvToLocals,
	addHeadersToLocals,
	addURLToLocals,
	addUserToLocals,
	addCollectionsGetter,
	addEJSHelpers,
} = require('./middlewares');

require('./config/passport')();

const app = express();

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.engine('ejs', (path, data, cb) =>
	ejs.renderFile(path, data, { async: true }).then(html => cb(null, html), cb)
);

app.use(express.static('public'));

app.use(
	cors({
		origin: (origin, cb) => cb(null, origin),
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	methodOverride(
		(request, _) => {
			if (request.body?._method) {
				const method = request.body._method;
				delete request.body._method;
				return method;
			}
		},
		{ methods: ['POST', 'GET'] }
	)
);
if (!DISABLE_MORGAN) app.use(logger(NODE_ENV === 'development' ? 'dev' : 'common'));
require('./config/database')().then(conn => {
	app.use(
		session({
			secret: SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({ client: conn.connection.getClient() }),
			cookie: {
				sameSite: 'none',
				secure: 'auto',
			},
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(flash());

	app.use(addNodeEnvToLocals);
	app.use(addHeadersToLocals);
	app.use(addURLToLocals);
	app.use(addUserToLocals);
	app.use(addCollectionsGetter);
	app.use(addEJSHelpers);

	app.use('/', require('./routes/index'));
	const collectionRoutes = require('./routes/collection');
	app.use('/v', collectionRoutes);
	app.use('/auth', require('./routes/auth'));
	app.use('/marker', require('./routes/marker'));
	app.use('/api', require('./routes/api'));
	app.use('/oembed', require('./routes/oembed'));

	app.use((request, response) => {
		response.status(404).render('error', {
			title: 'Page Not Found',
			heading: '404',
			preMessage: "Sorry, we couldn't find the page",
			message: request.originalUrl,
			postMessage: "But don't worry, you can find plenty of other things on our homepage.",
		});
	});

	app.use((error, _, response, __) => {
		console.error(error.stack || error.message || error);
		response.status(error.status || 500);
		response.render('error', {
			title: 'Unexpected Error',
			heading: error.status || 500,
			preMessage: 'Sorry, something went wrong',
			message: error.message || error.stack || error,
			postMessage:
				"If trying again doesn't work, feel free to contact me with what you've done to get to this page!",
		});
	});

	app.listen(PORT, () => {
		console.log('Server is running, you better catch it!');
	});
});
