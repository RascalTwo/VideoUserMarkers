const router = require('express-promise-router')();
const controller = require('../controllers/index');
const { requireAdmin } = require('../middlewares/index');

router.get('/', controller.renderHomepage);

router.get('/profile/:username?', controller.renderProfile);

router.get('/search', controller.search);

router.get('/admin/delete-orphans', requireAdmin, controller.deleteOrphans);

module.exports = router;
