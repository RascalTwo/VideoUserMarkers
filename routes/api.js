const router = require('express-promise-router')();

const controller = require('../controllers/api.js');

router.get('/user', controller.getUser);

router.post('/token', controller.generateToken);

router.get('/collections/:type/:entityId', controller.getCollections);

router.get('/collection/:id', controller.getCollection);

router.post('/collection/:id', controller.upsertCollection);

module.exports = router;