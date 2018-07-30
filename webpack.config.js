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

module.exports = opts => ({
	entry: {
		main: opts.main
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
					options: getConfig(path.dirname(opts.main))
				}
			}
		]
	},

	output: {
		path: opts.output,
		filename: "bundle.js"
	},

	stats: opts.logLevel,

	target: "node",
	mode: "development",
	// externals: {
	// 	"libui-node": "commonjs libui-node"
	// }
	externals:
		process.env.TEST_CLI !== "true"
			? [nodeExternals()]
			: [
					nodeExternals(),
					nodeExternals({ modulesDir: "../node_modules" })
			  ]
});
