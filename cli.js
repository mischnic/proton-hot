#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const program = require("commander");

const node_hot = require("./node-hot-loader-patch.js");

let main, outDir, logLevel;

program
	.usage("<main.js>")
	.description(
		"Run `main.js` with proton-native hot reloading (similar to babel-node)"
	)
	.option("-o, --out-dir <dir>", "The output directory", "build")
	.option(
		"-l, --log-level <level>",
		"Log level (normal, minimal, errors-only or none)",
		/^(normal|minimal|errors-only|none)$/,
		"errors-only"
	)
	.action((_main, options) => {
		outDir = options.outDir;
		logLevel = options.logLevel;
		main = _main;
	});

program.parse(process.argv);

if (main) {
	if (fs.existsSync(main)) {
		node_hot({
			fork: true,
			config: require(path.join(__dirname, "webpack.config.js"))({
				output: path.resolve(outDir),
				main: path.resolve(main),
				logLevel
			})
		});
	} else {
		console.log(`The specified \`main.js\` (${main}) doesn't exist`);
	}
} else {
	program.outputHelp();
}
