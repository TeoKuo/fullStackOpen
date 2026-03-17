import mongoose from 'mongoose';
import process from 'node:process';
import app from './app.js';
import config from './utils/config.js';
import logger from './utils/logger.js';

const start = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('connected to MongoDB');

    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error('error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

start();
