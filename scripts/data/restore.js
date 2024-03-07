const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;

require('./shared').then(async ({ db, client }) => {
	for (const jsonFilename of fs.readdirSync('backup')) {
		const collectionName = jsonFilename.split('.')[0];
		const documents = JSON.parse(
			await fs.promises.readFile(`backup/${jsonFilename}`, 'utf8'),
			(key, value) => {
				if (['expires', 'createdAt', 'updatedAt'].includes(key)) {
					return new Date(value);
				}
				if (['_id', 'collectionRef', 'author'].includes(key)) {
					try {
						return new ObjectId(value);
					} catch (e) {
						//
					}
				}
				return value;
			}
		);
		console.log(`Syncing ${collectionName}...`);
		await db.collection(collectionName).deleteMany({});
		await db.collection(collectionName).insertMany(documents);
		console.log(`Synced ${collectionName}`);
	}

	client.close();
});
