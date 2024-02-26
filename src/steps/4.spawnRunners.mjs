import createTestRunner from "@joytest/create-runner"
import parseRunnerOptions from "../lib/parseRunnerOptions.mjs"

export default async function(jtest_session) {
	const n_runners = jtest_session.options.runners.length

	jtest_session.dispatchEvent("pre-runner-spawn", n_runners)

	let runners = []

	for (const runner_config of jtest_session.options.runners) {
		const {type, options} = parseRunnerOptions(runner_config)

		const runner_instance = await createTestRunner(type, options)

		await runner_instance.init(jtest_session)

		jtest_session.dispatchEvent("runner:spawned", {
			index: runners.length,
			runner: runner_instance
		})

		runners.push(runner_instance)
	}

	let test_results = new Map()

	for (const unit of jtest_session.internal_state.computed_units) {
		for (const test of unit) {
			test_results.set(test.id, new Map())
		}
	}

	jtest_session.internal_state.runners = runners
	jtest_session.internal_state.test_results = test_results

	jtest_session.dispatchEvent("post-runner-spawn", n_runners)
}
