const router = require('express-promise-router')();
const controller = require('../controllers/collection');
const { requireAuth } = require('../middlewares/index');

router.get('/:entityId', controller.renderEntity);

router
	.route('/:entityId/:idOrBase64')
	.get(controller.renderCollection)
	.patch(requireAuth('/'), controller.updateCollection)
	.delete(requireAuth('/'), controller.deleteCollection);

router.route('/:entityId/:idOrBase64/embed').get(controller.renderCollectionEmbed);

router
	.route('/', requireAuth('/'))
	.get(controller.renderNewCollection)
	.post(controller.createCollection);

module.exports = router;
