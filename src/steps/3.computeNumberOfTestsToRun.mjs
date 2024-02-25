export default function(jtest_session) {
	const num_runners = jtest_session.options.runners.length
	const num_test_cases = jtest_session.internal_state.tests.size
	const number_of_tests_to_run = num_test_cases * num_runners

	jtest_session.internal_state.number_of_tests_to_run = number_of_tests_to_run

	jtest_session.dispatchEvent(
		"report", {id: "number_of_tests_to_run", value: number_of_tests_to_run}
	)
}
