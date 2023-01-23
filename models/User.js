const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { jsonStripper } = require('./helpers');

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		token: String,
		isAdmin: Boolean,
	},
	{
		toObject: { virtuals: true },
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: jsonStripper('id', 'password', 'token'),
		},
	}
);
UserSchema.virtual('collections', {
	ref: 'Collection',
	localField: '_id',
	foreignField: 'author',
});
UserSchema.virtual('avatarURL').get(function () {
	return (
		'https://ui-avatars.com/api/?background=random&name=' +
		this.username.split(/[\s-_]+/).join('%20')
	);
});

UserSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compareSync(candidatePassword, this.password);
};

UserSchema.methods.generateToken = function () {
	return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
};

module.exports = mongoose.model('User', UserSchema);
