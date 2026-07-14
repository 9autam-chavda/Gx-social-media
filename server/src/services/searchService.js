const User = require('../models/User');
const Post = require('../models/Post');

const searchAll = async (query) => {
  if (!query.trim()) {
    return {
      users: [],
      posts: [],
    };
  }

  const regex = new RegExp(query, 'i');

  const [users, posts] =
    await Promise.all([
      User.find({
        username: regex,
      })
        .select(
          'username profilePicture'
        )
        .limit(5)
        .lean(),

      Post.find({
        caption: regex,
      })
        .populate(
          'user',
          'username profilePicture'
        )
        .limit(5)
        .lean(),
    ]);

  return {
    users,
    posts,
  };
};

module.exports = {
  searchAll,
};