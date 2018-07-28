#!/usr/bin/env node
const path = require("path");
const program = require("commander");

const node_hot = require("./node-hot-loader-patch.js");

let main, out_dir;

program
	.usage("<main>")
	.description("Run `main` with hot reloading (similar to babel-node)")
	.option("-o, --out_dir <n>", "The output directory. Default: './build'")
	.action((_main, options) => {
		out_dir = options.out_dir || "./build";
		main = _main;
	});

program.parse(process.argv);

if (main) {
	node_hot({
		fork: true,
		config: require(path.join(__dirname, "webpack.config.js"))(
			path.resolve(out_dir),
			path.resolve(main)
		)
	});
} else {
	program.outputHelp();
}
