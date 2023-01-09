const TwitchStrategy = require('passport-twitch-new').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const User = require('../models/User');
const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = require('./constants');

module.exports = function setupPassport() {
	passport.use(
		new TwitchStrategy(
			{
				clientID: TWITCH_CLIENT_ID,
				clientSecret: TWITCH_CLIENT_SECRET,
				callbackURL: '/auth/twitch/callback',
				scope: 'user_read',
			},
			function verifyTwitchUser(accessToken, refreshToken, profile, done) {
				User.findOne({ twitchId: profile.id }, async function handleTwitchFoundUser(err, user) {
					if (err) return done(err);
					if (user) {
						let changed = false;
						if (user.displayName !== profile.display_name) {
							user.displayName = profile.display_name;
							changed = true;
						}
						if (user.login !== profile.login) {
							user.login = profile.login;
							changed = true;
						}
						if (changed) return user.save().then(user => done(null, user));
						return done(null, user);
					}

					const newUser = new User({
						twitchId: profile.id,
						login: profile.login,
						displayName: profile.display_name,
					});
					newUser.save(function (err) {
						if (err) return done(err);
						return done(null, newUser);
					});
				});
			}
		)
	);

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([
					ExtractJwt.fromAuthHeaderAsBearerToken(),
					ExtractJwt.fromBodyField('token'),
					ExtractJwt.fromUrlQueryParameter('token'),
				]),
				secretOrKey: process.env.SESSION_SECRET,
			},
			function verifyJWT(jwt_payload, done) {
				User.findById(jwt_payload.sub, function handleJWTFoundUser(err, user) {
					if (err) {
						return done(err, false);
					}
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				});
			}
		)
	);

	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
};
