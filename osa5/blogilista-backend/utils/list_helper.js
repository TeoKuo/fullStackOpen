import _ from 'lodash';

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((favorite, current) =>
    current.likes > favorite.likes ? current : favorite
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const topAuthor = _.chain(blogs)
    .countBy('author')
    .toPairs()
    .maxBy((entry) => entry[1])
    .value();

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const topAuthor = _.chain(blogs)
    .groupBy('author')
    .map((authorBlogs, author) => ({
      author,
      likes: _.sumBy(authorBlogs, 'likes'),
    }))
    .maxBy('likes')
    .value();

  return topAuthor;
};

export { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
