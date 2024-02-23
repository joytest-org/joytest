import createTestRunner from "../../../create-runner/dist/package.mjs"

export default async function(jtest_session) {
	const n_runners = jtest_session.options.runners.length

	jtest_session.dispatchEvent("pre-runner-spawn", n_runners)

	let runners = []

	for (const runner_config of jtest_session.options.runners) {
		let runner_type = runner_config
		let runner_options = {}

		if (runner_config.includes(":")) {
			// todo: fix ":" in tmp[1]
			let tmp = runner_config.split(":")

			runner_type = tmp[0]

			if (runner_type === "node") {
				runner_options = {node_binary: tmp[1]}
			} else if (runner_type === "browser") {
				runner_options = {http_port: parseInt(tmp[1], 10)}
			}
		}

		const runner_instance = await createTestRunner(runner_type, runner_options)

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
