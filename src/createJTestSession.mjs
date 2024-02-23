import eventEmitter from "@anio-js-core-foundation/simple-event-emitter"
import {default as runJTestSession} from "./run.mjs"

import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default function(user_options) {
	const default_options = {
		isolate: 3,
		parallel: 5,
		timeout: 5000,
		runners: ["node"],
		collapsed: false
	}

	const options = Object.assign({}, default_options, user_options)

	//
	// reference path to this package
	//
	const package_root = path.resolve(__dirname, "..")

	let jtest_session = {
		package_root,

		options,

		internal_state: {
			number_of_tests_to_run: 0,
			number_of_tests_ran: 0,

			input: null,

			// A "unit" refers to the test(s) executed by a single worker process
			// In the standard running mode, one test case equals one unit.
			// However, anio-jtest can be configured so each test file
			// is considered a unit. Hence, a unit can be more than a single unit test.
			computed_units: [],

			tests: new Map(),
			test_results: null,

			runners: [],

			final_statistics: {}
		},

		public_interface: {
			options,
			run() {
				return runJTestSession(jtest_session)
			}
		}
	}

	const event_emitter = eventEmitter([
		// report event gives information about things like
		// number of units, number of unit tests etc.
		"report",
		"pre-runner-spawn",
		// emitted when a runner was spawned
		"runner:spawned",
		// emitted when all runners spawned
		"post-runner-spawn",
		// when all runners are ready
		"ready"
	])

	jtest_session.dispatchEvent = event_emitter.install(jtest_session.public_interface)

	return jtest_session.public_interface
}
