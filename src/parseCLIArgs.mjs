import fs from "node:fs/promises"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import parseCLIArgs from "@anio-js-core-foundation/node-parse-cli-args"
import expandAndValidateInputTestFiles from "./lib/expandAndValidateInputTestFiles.mjs"

export default async function(args) {
	const options = {
		options: {
			// Tells anio-jtest to spawn a runner of type 'type'.
			"runner": "string",
			// Specify level of isolation ; a higher value means better test isolation.
			"isolate": "integer",
			// Specify how many workers are spawned to run unit tests.
			"parallel": "integer",

			// unused at the moment
			"info-fd": "integer",
			// unused at the moment
			"slow-test-threshold": "integer",

			// Specify maximum amount of time a unit test can run in milliseconds.
			"timeout": "integer",
		},

		flags: [
			// Do not randomize order of test cases.
			"no-randomize",
			// Do not show extra information
			"collapsed"
		],

		// --runner can be specified multiple times
		multi_options: ["runner"]
	}

	const input = await parseCLIArgs(args, options)

	if (1 > input.operands.length) {
		process.stderr.write(`Usage: anio-jtest [...flags] [...options] <project_root> [...test files]\n`)
		process.exit(2)
	}

	const project_root = await fs.realpath(input.operands[0])

	return {
		project_root,

		isolate: "isolate" in input.options ? input.options.isolate : 3,
		parallel: "parallel" in input.options ? input.options.parallel : 1,
		timeout: "timeout" in input.options ? input.options.timeout : 5000,

		collapsed: input.flags.includes("collapsed"),

		test_files: await expandAndValidateInputTestFiles(project_root, input.operands.slice(1)),

		runners: "runner" in input.options ? input.options.runner : ["node"]
	}
}
