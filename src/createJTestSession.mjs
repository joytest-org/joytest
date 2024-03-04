import eventEmitter from "@anio-js-foundation/simple-event-emitter"
import createPromise from "@anio-js-foundation/create-promise"

import {default as runJTestSession} from "./run.mjs"

export default function(user_options) {
	const default_options = {
		isolate: 3,
		parallel: 5,
		timeout: 5000,
		runners: ["node"]
	}

	const options = Object.assign({}, default_options, user_options)

	let jtest_session = {
		jtest_test_mode: options["test-mode-do-not-use"] === true,

		options,

		internal_state: {
			number_of_tests_to_run: 0,
			number_of_tests_ran: 0,

			input: null,

			// A "unit" refers to the test(s) executed by a single worker process
			// In the standard running mode, one test case equals one unit.
			// However, joytest can be configured so each test file
			// is considered a unit. Hence, a unit can be more than a single unit test.
			computed_units: [],

			tests: new Map(),
			test_results: null,

			runners: [],

			final_statistics: {},

			last_event_dispatched: createPromise()
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

	//
	// hook into dispached events
	//
	let number_of_tests_to_run = -1

	event_emitter.setOnEventDispatchedHandler((event_name, event_data) => {
		if (event_name !== "report") return

		const {id, value} = event_data[0]

		if (id === "number_of_tests_to_run") {
			if (number_of_tests_to_run !== -1) {
				throw new Error(
					`number_of_tests_to_run was already set. This is a bug.`
				)
			}

			number_of_tests_to_run = value

			return
		}

		if (id !== "number_of_tests_ran") return

		if (number_of_tests_to_run === -1) {
			throw new Error(
				`number_of_tests_to_run was not set. This is a bug.`
			)
		}

		if (number_of_tests_to_run === value) {
			setTimeout(() => {
				jtest_session.internal_state.last_event_dispatched.resolve()
			}, 0)
		}
	})

	jtest_session.dispatchEvent = event_emitter.install(jtest_session.public_interface)

	return jtest_session.public_interface
}
