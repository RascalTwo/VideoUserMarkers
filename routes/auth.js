const router = require('express-promise-router')();
const passport = require('passport');

const controller = require('../controllers/auth');

router.get('/logout', controller.logout);

router.get('/login', controller.renderLogin);

router.post('/login', controller.login);

router.get('/signup', controller.renderSignup);

router.post('/signup', controller.signup);

router.get('/twitch', passport.authenticate('twitch'));

router.get(
	'/twitch/callback',
	passport.authenticate('twitch', {
		successRedirect: '/',
		failureRedirect: '/',
	})
);

module.exports = router;
