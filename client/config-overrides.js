module.exports = function override(config, env) {
  // Add fallback for node core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url/")
  };
  
  return config;
} 