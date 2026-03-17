import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from './config.js';
import logger from './logger.js';

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }

  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) {
      request.user = null;
      return next();
    }

    const decodedToken = jwt.verify(request.token, config.SECRET);

    if (!decodedToken.id) {
      request.user = null;
      return next();
    }

    request.user = await User.findById(decodedToken.id);
    next();
  } catch (error) {
    next(error);
  }
};

const errorHandler = (error, request, response, next) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'expected `username` to be unique' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }

  logger.error(error.message);
  next(error);
};

export default {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
