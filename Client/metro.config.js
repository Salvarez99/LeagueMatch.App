const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  "@leaguematch/shared": path.resolve(__dirname, "../Packages/shared/dist"),
};

config.watchFolders = [
  path.resolve(__dirname, "../Packages/shared"),
];

module.exports = config;
