const express = require('express');
const ejs = require('ejs');
const cors = require('cors');
const methodOverride = require('method-override');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const { PORT, SESSION_SECRET } = require('./config/constants');
const { addUserToLocals, addCollectionsGetter } = require('./middlewares');

require('./config/passport')();

const app = express();

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.engine('ejs', (path, data, cb) => ejs.renderFile(path, data, { async: true }).then(html => cb(null, html), cb));

app.use(express.static('public'));

app.use(
  cors({
    origin: (origin, cb) => cb(null, origin),
  }),
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
    { methods: ['POST', 'GET'] },
  ),
);

app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'common'));
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
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  app.use(addUserToLocals);
  app.use(addCollectionsGetter);

  app.use('/', require('./routes/index'));
  app.use('/auth', require('./routes/auth'));
  app.use('/collection', require('./routes/collection'));
  app.use('/marker', require('./routes/marker'));
  app.use('/api', require('./routes/api'));

  app.listen(PORT, () => {
    console.log('Server is running, you better catch it!');
  });
});
