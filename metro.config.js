// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

// const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
	const config = getDefaultConfig(__dirname);
	const { transformer, resolver } = config;

	config.transformer = {
		...transformer,
		// Use the Expo-specific transformer path
		babelTransformerPath: require.resolve(
			"react-native-svg-transformer/expo"
		),
	};
	config.resolver = {
		...resolver,
		assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
		sourceExts: [...resolver.sourceExts, "svg"],
	};

	return config;
})();

module.exports = config;
