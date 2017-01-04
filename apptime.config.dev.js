module.exports = (config, defaults) => ({
  ...config,
  entry: {
    app: [
      'normalize.css',
      'font-awesome/css/font-awesome.css',
      defaults.hmrEntry,
      './client/index.js',
    ],
  },
});
