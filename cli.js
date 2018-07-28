#!/usr/bin/env node
const path = require("path");
const program = require("commander");

const node_hot = require("./node-hot-loader-patch.js");

let main;

program.usage("<main>").action(a => {
	main = a;
});

program.parse(process.argv);

if (main) {
	node_hot({
		fork: true,
		config: require(path.join(__dirname, "webpack.config.js"))(
			path.resolve(main)
		)
	});
} else {
	program.outputHelp();
}
