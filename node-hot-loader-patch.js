// https://github.com/vlazh/node-hot-loader/blob/v1.10.1/src/loader.js

// MIT License
//
// Copyright (c) 2017 Vladimir Zhukov
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const webpack = require("webpack");

/**
 * Add hmrClient to all entries.
 * @param module
 * @returns {Promise.<config>}
 */
function tweakWebpackConfig(webpackConfig) {
	const config = Array.isArray(webpackConfig)
		? webpackConfig.find(c => c.target === "node")
		: webpackConfig;

	if (!config) {
		throw new Error(
			'Not found webpack configuration. For multiple configurations in single file you must provide config with target "node".'
		);
	}

	const hmrClientEntry = require.resolve("node-hot-loader/lib/HmrClient");

	const addHmrClientEntry = (entry, entryOwner) => {
		const owner = entryOwner;
		if (Array.isArray(owner[entry])) {
			owner[entry].splice(-1, 0, hmrClientEntry);
		} else if (typeof owner[entry] === "string") {
			owner[entry] = [hmrClientEntry, owner[entry]];
		} else if (typeof owner[entry] === "function") {
			// Call function and try again with function result.
			owner[entry] = owner[entry]();
			addHmrClientEntry(entry, owner);
		} else if (typeof owner[entry] === "object") {
			Object.getOwnPropertyNames(owner[entry]).forEach(name =>
				addHmrClientEntry(name, owner[entry])
			);
		}
	};

	// Add HmrClient to every entries.
	addHmrClientEntry("entry", config);

	if (!config.plugins) {
		config.plugins = [];
	}

	// Add source-map support if configured.
	if (config.devtool && config.devtool.indexOf("source-map") >= 0) {
		config.plugins.push(
			new webpack.BannerPlugin({
				banner: `;require('${require
					.resolve("source-map-support")
					.replace(/\\/g, "/")}').install();`,
				raw: true,
				entryOnly: false
			})
		);
	}

	// Enable HMR globally if not.
	if (
		!config.plugins.find(
			p => p instanceof webpack.HotModuleReplacementPlugin
		)
	) {
		config.plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	return config;
}

/**
 * Add compiler hooks and start watching (through compiler) for changes.
 * @returns {Promise.<HmrServer>}
 */
function hooks(compiler, options) {
	const HmrServer = require("node-hot-loader/lib/HmrServer").default;
	new HmrServer({
		...options,
		compiler // webpack compiler
	}).run();
}

module.exports = function loader(options) {
	Promise.resolve()
		.then(() => require("babel-register"))
		.then(() => tweakWebpackConfig(options.config))
		.then(webpackConfig => webpack(webpackConfig))
		.then(compiler => hooks(compiler, options))
		.catch(err => console.error(err));
};
