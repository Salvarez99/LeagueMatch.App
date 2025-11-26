const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.resolver.extraNodeModules = {
    "@Shared": require("path").resolve(__dirname, "../Shared"),
  };

  return config;
})();
