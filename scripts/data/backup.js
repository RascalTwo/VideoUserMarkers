const fs = require('fs');

require('./shared.js').then(async ({ db, client }) => {
	if (!client) return;

	const collections = await db.listCollections().toArray();

	if (!fs.existsSync('backup')) {
		await fs.promises.mkdir('backup');
	}

	for (const collection of collections) {
		const collectionName = collection.name;
		const documents = await db.collection(collectionName).find().toArray();
		await fs.promises.writeFile(`backup/${collectionName}.json`, JSON.stringify(documents));
		console.log(
			`${collectionName} collection successfully exported to ${collectionName}.json file!`
		);
	}

	client.close();
});
