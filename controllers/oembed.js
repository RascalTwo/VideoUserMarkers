const generateBaseOEmbed = response => ({
	type: 'link',
	version: '1.0',
	author_name: 'Video User Markers',
	author_url: response.locals.origin,
	provider_name: 'Rascal Two',
	provider_url: 'https://rascaltwo.com',
});

function handleDefaultOEmbed(request, response) {
	response.json(generateBaseOEmbed(response));
}

module.exports.generateHomeEmbed = handleDefaultOEmbed;

module.exports.generateEntityEmbed = handleDefaultOEmbed;

module.exports.generateCollectionEmbed = handleDefaultOEmbed;

module.exports.generateProfileEmbed = handleDefaultOEmbed;

module.exports.generateSearchEmbed = handleDefaultOEmbed;
