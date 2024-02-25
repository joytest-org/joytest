import resolve from "@rollup/plugin-node-resolve"

export default [{
	input: "./src/index.mjs",

	output: {
		file: "./dist/package.mjs",
		format: "es"
	},

	plugins: [resolve()]
}, {
	input: "./src/suite/index.mjs",

	output: {
		file: "./dist/suite.mjs",
		format: "es"
	},

	plugins: [resolve()]
}]
