export default function(jtest_session) {
	const {number_of_tests_to_run} = jtest_session.internal_state
	let number_of_test_results = 0

	for (const [test_id, runner_test_results] of jtest_session.internal_state.test_results) {
		number_of_test_results += runner_test_results.size
	}

	if (number_of_tests_to_run !== number_of_test_results) {
		throw new Error(
			`Fatal error: ${number_of_tests_to_run} units with ${number_of_test_results} test reports. This is a bug.`
		)
	}
}
