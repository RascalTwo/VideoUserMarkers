const mongoose = require('mongoose');
const { DB_STRING } = require('./constants');

module.exports = async function connectToDB() {
	try {
		const conn = await mongoose.connect(DB_STRING, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);

		return conn;
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
