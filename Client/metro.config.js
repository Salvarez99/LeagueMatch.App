const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Allow importing from '@Shared/...' and make Metro watch the folder
  config.resolver.extraNodeModules = {
    "@Shared": path.resolve(__dirname, "../Shared"),
  };

  config.watchFolders = [path.resolve(__dirname, "../Shared")];

  return config;
})();
