const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

// Get the default Metro configuration for the project
const config = getDefaultConfig(__dirname)

// Add custom transformer options
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true, // Retain inlineRequires for performance optimization
  },
})

// Integrate NativeWind's configuration
module.exports = withNativeWind(config, {
  input: "./global.css", // Specify the global CSS file for NativeWind
  inlineRem: 16, // Set the root em size for NativeWind
})
