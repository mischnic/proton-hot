#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const program = require("commander");

const node_hot = require("./node-hot-loader-patch.js");

let main, out_dir;

program
	.usage("<main.js>")
	.description("Run `main.js` with proton-native hot reloading (similar to babel-node)")
	.option("-o, --out_dir <n>", "The output directory. Default: './build'")
	.action((_main, options) => {
		out_dir = options.out_dir || "./build";
		main = _main;
	});

program.parse(process.argv);

if (main) {
	if(fs.existsSync(main)){
		node_hot({
			fork: true,
			config: require(path.join(__dirname, "webpack.config.js"))(
				path.resolve(out_dir),
				path.resolve(main)
			)
		});
	} else {
		console.log(`The specified \`main.js\` (${main}) doesn't exist`);
	}
} else {
	program.outputHelp();
}
