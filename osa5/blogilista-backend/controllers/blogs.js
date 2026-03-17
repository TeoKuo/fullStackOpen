import express from 'express';
import Blog from '../models/blog.js';
import User from '../models/user.js';
import middleware from '../utils/middleware.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user;

    if (!user) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const blog = new Blog({
      ...request.body,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1,
    });
    response.status(201).json(populatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user;

    if (!user) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete a blog' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    await User.findByIdAndUpdate(blog.user, {
      $pull: { blogs: blog._id },
    });

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      returnDocument: 'after',
      runValidators: true,
      context: 'query',
    });

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
