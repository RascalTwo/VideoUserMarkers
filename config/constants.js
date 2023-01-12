const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

module.exports.PORT = process.env.PORT || 3000;
module.exports.DB_STRING = process.env.DB_STRING || 'mongodb://localhost:27017/live-markers';
module.exports.SESSION_SECRET = process.env.SESSION_SECRET || 'keyboard cat';
module.exports.TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
module.exports.TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
module.exports.NODE_ENV = process.env.NODE_ENV || 'development';
module.exports.DISABLE_MORGAN = process.env.DISABLE_MORGAN || false;
