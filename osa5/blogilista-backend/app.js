import express from 'express';
import blogsRouter from './controllers/blogs.js';
import loginRouter from './controllers/login.js';
import testingRouter from './controllers/testing.js';
import usersRouter from './controllers/users.js';
import middleware from './utils/middleware.js';

const app = express();

app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
