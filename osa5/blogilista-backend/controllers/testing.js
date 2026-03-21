import express from 'express';
import Blog from '../models/blog.js';
import User from '../models/user.js';

const testingRouter = express.Router();

testingRouter.post('/reset', async (request, response, next) => {
  try {
    await Blog.deleteMany({});
    await User.deleteMany({});
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default testingRouter;
