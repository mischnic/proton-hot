const path = require("path");
const fs = require("fs");
const nodeExternals = require("webpack-node-externals");
const findBabelConfig = require("find-babel-config");
const JSON5 = require("json5");

function getConfig(dir) {
	const config = findBabelConfig.sync(dir).config || {};
	config.plugins = config.plugins || [];
	config.plugins.push(require.resolve("@mischnic/babel-plugin-proton-hot"));
	return config;
}

module.exports = (output, main) => ({
	entry: {
		main
	},

	context: process.cwd(),
	node: {
		__filename: false,
		__dirname: false
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: getConfig(path.dirname(main))
				}
			}
		]
	},

	output: {
		path: output,
		filename: "bundle.js"
	},

	stats: "minimal",

	target: "node",
	mode: "development",
	// externals: {
	// 	"libui-node": "commonjs libui-node"
	// }
	externals: [nodeExternals()]
});
