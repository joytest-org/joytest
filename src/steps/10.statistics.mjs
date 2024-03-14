export default function(jtest_session) {
	let number_of_tests = 0
	let number_of_tests_passed = 0
	let number_of_tests_failed = 0
	let number_of_tests_error = 0
	let number_of_tests_skipped = 0

	for (const [test_id, runner_test_results] of jtest_session.internal_state.test_results) {

		for (const [runner_id, test_result] of runner_test_results) {
			++number_of_tests

			const {has_error_occurred_during_testing} = test_result

			// todo: check test timeout result
			if (has_error_occurred_during_testing) {
				number_of_tests_error++
			} else if (test_result.verdict === "pass") {
				number_of_tests_passed++
			} else if (test_result.verdict === "skipped") {
				number_of_tests_skipped++
			} else {
				number_of_tests_failed++
			}
		}

	}

	const statistics = {
		number_of_tests,
		number_of_tests_passed,
		number_of_tests_failed,
		number_of_tests_error,
		number_of_tests_skipped,
		number_of_assertions_made: jtest_session.internal_state.made_assertions
	}

	jtest_session.internal_state.final_statistics = statistics

	jtest_session.dispatchEvent("report", {
		id: "final_statistics", value: statistics
	})
}
