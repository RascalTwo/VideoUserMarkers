const router = require('express-promise-router')();
const controller = require('../controllers/index');

router.get('/', controller.renderHomepage);

router.get('/profile/:username?', controller.renderProfile);

module.exports = router;