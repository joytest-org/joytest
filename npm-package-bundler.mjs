export default function(package_json) {
	return {
		processing: [
			"./src/suite/index.mjs"
		],

		postprocessing: [{
			file: "./dist/package.mjs",
			items: {
				"%%JOYTEST_RELEASE_VERSION%%": package_json.version
			},
			output: "./dist/package.mjs"
		}]
	}
}
