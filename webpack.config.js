const path = require("path");
const nodeExternals = require("webpack-node-externals");

const babelrc = JSON.parse(
	require("fs")
		.readFileSync(".babelrc")
		.toString()
		.split("\n")
		.filter(v => !/\s\/\//.test(v))
		.join("\n")
);
babelrc.plugins = babelrc.plugins || [];
babelrc.plugins.push(require.resolve("babel-plugin-proton-hot"));

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
					options: babelrc
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
