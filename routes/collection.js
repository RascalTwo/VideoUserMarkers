const router = require('express-promise-router')();
const controller = require('../controllers/collection');
const { requireAuth } = require('../middlewares/index');

router.get('/:entityId', controller.renderEntity);

router.get('/:entityId/:idOrBase64', controller.renderCollection);

router
	.route('/:entityId/:id')
	.patch(
		requireAuth('/', 'You must be logged in to update collections'),
		controller.updateCollection
	)
	.delete(
		requireAuth('/', 'You must be logged in to delete collections'),
		controller.deleteCollection
	);

router.route('/:entityId/:idOrBase64/embed').get(controller.renderCollectionEmbed);

router
	.route('/')
	.get(
		requireAuth('/', 'You must be logged in to create collections'),
		controller.renderNewCollection
	)
	.post(
		requireAuth('/', 'You must be logged in to create collections'),
		controller.createCollection
	);

module.exports = router;
