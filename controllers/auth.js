const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports.logout = (request, response, next) =>
	request.logout(err => {
		if (err) return next(err);
		return response.redirect('/');
	});

module.exports.login = async (request, response, next) => {
	const { username, password } = request.body;

	const user = await User.findOne({ username });
	if (!user) {
		request.flash('error', 'Invalid credentials');
		return response.redirect('/auth/login');
	}

	const isMatch = user.comparePassword(password);
	if (!isMatch) {
		request.flash('error', 'Invalid credentials');
		return response.redirect('/auth/login');
	}

	request.login(user, err => {
		if (err) return next(err);
		return response.redirect('/');
	});
};

module.exports.renderLogin = (request, response) =>
	response.render('auth/login', { title: 'Log In' });

module.exports.signup = async (request, response, next) => {
	const { username, password } = request.body;

	const user = await User.findOne({ username });

	if (user) {
		request.flash('error', 'Username already exists');
		return response.redirect('/auth/signup');
	}

	const cryptedPassword = await bcrypt.hash(password, 10);

	const newUser = new User({ username, password: cryptedPassword });
	await newUser.save();

	request.login(newUser, err => {
		if (err) return next(err);
		return response.redirect('/');
	});
};

module.exports.renderSignup = (request, response) =>
	response.render('auth/signup', { title: 'Sign Up' });
