export default async function(jtest_session) {
	for (const [index, runner] of jtest_session.internal_state.runners.entries()) {
		runner.ready()
		.then(additional_information => {
			jtest_session.dispatchEvent("runner:ready", {index, runner})
		})
	}

	await jtest_session.internal_state.all_runners_ready.promise

	jtest_session.dispatchEvent("ready")
}
