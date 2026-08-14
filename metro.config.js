const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// TEMP diagnostic-only: react-native-maps is native-only and crashes the web
// bundle. Stub it out for web so the app can at least be previewed in a
// browser. Does not affect iOS/Android resolution.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform, ...rest) => {
  if (platform === "web" && moduleName === "react-native-maps") {
    return {
      type: "sourceFile",
      filePath: path.resolve(__dirname, "scripts/web-stubs/react-native-maps.js"),
    };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform, ...rest);
  }
  return context.resolveRequest(context, moduleName, platform, ...rest);
};

module.exports = withNativeWind(config, {
  input: "./global.css",
});