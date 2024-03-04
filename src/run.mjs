import steps from "./steps/index.mjs"
import fnMeasureExecutionTime from "@anio-js-foundation/fn-measure-execution-time"

async function runAllSteps(jtest_session) {
	for (const step of steps) {
		await step(jtest_session)
	}
}

export default async function(jtest_session) {
	const {execution_time} = await fnMeasureExecutionTime(
		runAllSteps, jtest_session
	)

	const {
		number_of_tests,
		number_of_tests_passed,
		number_of_tests_skipped
	} = jtest_session.internal_state.final_statistics

	return {
		execution_time,
		statistics: {
			...jtest_session.internal_state.final_statistics
		},
		successful: number_of_tests === (number_of_tests_passed + number_of_tests_skipped)
	}
}
