const isTestEnvironment = () => {
  return process.env.NODE_ENV === 'test' || process.argv.includes('--test');
};

const info = (...params) => {
  if (!isTestEnvironment()) {
    console.log(...params);
  }
};

const error = (...params) => {
  if (!isTestEnvironment()) {
    console.error(...params);
  }
};

export default {
  info,
  error,
};
