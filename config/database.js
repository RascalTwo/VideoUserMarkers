const mongoose = require('mongoose');

module.exports = async function connectToDB() {
	try {
		const conn = await mongoose.connect(process.env.DB_STRING, {
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
