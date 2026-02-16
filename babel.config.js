module.exports = function(api) {
  api.cache(true);
  return {
    // `nativewind/babel` exports a preset-like function (it returns an object with a
    // `plugins` array). Add it to `presets` so Babel handles it correctly.
    presets: ['babel-preset-expo', 'nativewind/babel'],
  };
};