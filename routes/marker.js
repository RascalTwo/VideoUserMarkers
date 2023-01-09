const router = require('express-promise-router')();
const controller = require('../controllers/marker');

router.post('/', controller.createMarker);
router.route('/:id').put(controller.updateMarker).delete(controller.deleteMarker);

module.exports = router;
