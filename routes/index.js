const router = require('express-promise-router')();
const controller = require('../controllers/index');
const { requireAdmin, setDefaultSorting } = require('../middlewares/index');

router.get('/', setDefaultSorting('createdAt', true), controller.renderHomepage);

router.get('/profile/:username?', setDefaultSorting('updatedAt', true), controller.renderProfile);

router.get('/search', setDefaultSorting('matchRatio', true), controller.search);

router.get('/admin/delete-orphans', requireAdmin, controller.deleteOrphans);

module.exports = router;
