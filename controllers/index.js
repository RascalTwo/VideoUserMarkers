const User = require('../models/User');

module.exports.renderHomepage = (_, response) => response.render('index');

module.exports.renderProfile = async (request, response) => {
  const username = request.params.username || request.user?.username;
  if (!username) return response.redirect('/auth/login');

  const profiling = await User.findOne({ username }).populate({
    path: 'collections',
    populate: {
      path: 'author entity markerCount',
    },
    options: {
      sort: { createdAt: -1 },
    }
  });
  if (!profiling) return response.status(404).send('User not found');
  response.render('profile', { profiling });
};
