const router = require('express-promise-router')();

const controller = require('../controllers/oembed.js');

router.get('/', controller.generateHomeEmbed);

router.get('/v/:entityId', controller.generateEntityEmbed);

router.get('/v/:entityId/:id', controller.generateCollectionEmbed);

router.get('/profile/:username', controller.generateProfileEmbed);

router.get('/search', controller.generateSearchEmbed);

module.exports = router;
