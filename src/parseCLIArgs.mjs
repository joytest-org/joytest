import fs from "node:fs/promises"
import path from "node:path"
import parseCLIArgs from "@anio-node-foundation/cli-parse-args"
import expandAndValidateInputTestFiles from "./lib/expandAndValidateInputTestFiles.mjs"

async function __tests__FolderExists(project_root) {
	try {
		const stat = await fs.lstat(
			path.join(project_root, "__tests__")
		)

		return stat.isDirectory()
	} catch (error) {
		return false
	}
}

export default async function(args) {
	const options = {
		options: {
			// Tells joytest to spawn a runner of type 'type'.
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
			"collapsed",
			// Allow zero unit tests
			"allow-zero-tests",
			// Only to be used for testing
			"test-mode-do-not-use"
		],

		// --runner can be specified multiple times
		multi_options: ["runner"]
	}

	const input = await parseCLIArgs(args, options)

	const project_root = await fs.realpath(input.operands[0])

	let user_options = {
		project_root
	}

	let test_files = []

	if (input.operands.length > 1) {
		test_files = await expandAndValidateInputTestFiles(project_root, input.operands.slice(1))
	} else if (await __tests__FolderExists(project_root)) {
		test_files = await expandAndValidateInputTestFiles(project_root, ["__tests__"])
	}

	user_options.test_files = test_files

	//
	// only set option prop on user_options
	// if it is found in input.options
	//
	for (const option_name in options.options) {
		if (option_name in input.options) {
			user_options[option_name] = input.options[option_name]
		}
	}

	for (const flag_name of options.flags) {
		user_options[flag_name] = input.flags.includes(flag_name)
	}

	//
	// ugly but ok for the time being
	// rename "runner" to "runners"
	//
	if ("runner" in user_options) {
		user_options.runners = user_options.runner

		delete user_options.runner
	}

	return user_options
}
