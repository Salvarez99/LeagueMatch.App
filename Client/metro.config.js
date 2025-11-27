const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow Metro to compile the shared package
config.resolver.nodeModulesPaths = [
  "./node_modules",
  "../packages/shared/node_modules",
];

config.watchFolders = ["../packages/shared"];

module.exports = config;
