const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_STRING;
const dbName = uri.split('/')[3].split('?')[0];
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client
	.connect()
	.catch(err => {
		console.error(err);
		throw err;
	})
	.then(client => {
		const db = client.db(dbName);

		return { db, client };
	});
