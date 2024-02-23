import runPromisesInParallel from "@anio-js-foundation/run-promises-in-parallel"

function sortTestResultByRunners(jtest_session, test_id) {
	const test_results = jtest_session.internal_state.test_results.get(test_id)
	let ret = []

	for (const runner of jtest_session.internal_state.runners) {
		if (test_results.has(runner.id)) {
			ret.push(test_results.get(runner.id))
		} else {
			ret.push(false)
		}
	}

	return ret
}

export default async function(jtest_session) {
	let ret = []

	for (const runner of jtest_session.internal_state.runners) {
		const eventHandler = (event, data) => {
			if (event !== "test_result") return

			jtest_session.internal_state.number_of_tests_ran++

			const {test_id, result} = data

			//
			// save test result and associate it with the runner
			//
			jtest_session.internal_state.test_results.get(test_id).set(runner.id, result)

			jtest_session.dispatchEvent("report", {id: "test_result", value: {
				test: jtest_session.internal_state.tests.get(test_id),
				results: sortTestResultByRunners(jtest_session, test_id)
			}})

			jtest_session.dispatchEvent("report", {id: "number_of_tests_ran", value: jtest_session.internal_state.number_of_tests_ran})
		}

		const runners = runner.runTestUnitsFactory(
			jtest_session.internal_state.computed_units, eventHandler
		)

		ret.push(async () => {
			return await runPromisesInParallel(runners, jtest_session.options.parallel)
		})
	}

	await Promise.all(ret.map(r => r()))
}
