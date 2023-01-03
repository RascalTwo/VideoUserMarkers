const router = require('express-promise-router')();
const controller = require('../controllers/collection');
const { requireAuth } = require('../middlewares/index');


router.route('/:id')
	.get(controller.renderCollection)
	.patch(requireAuth('/'), controller.updateCollection)
	.delete(requireAuth('/'), controller.deleteCollection);

router.route('/', requireAuth('/'))
	.get(controller.renderNewCollection)
	.post(controller.createCollection);


module.exports = router;