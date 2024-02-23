function determineFinalVerdict(test_results) {
	let passed = true

	for (const test_result of test_results) {
		if (test_result.has_error_occurred_during_testing) {
			return "error"
		}

		if (test_result.verdict !== "pass") passed = false
	}

	return passed ? "pass" : "fail"
}

function condenseTestResultVerdicts(test_results) {
	let ret = []

	const pass = `\u001b[0;32m✔\u001b[0;0m`
	const fail = `\u001b[0;31m✘\u001b[0;0m`
	const error = `\u001b[1;33m⚠\u001b[0;0m`
	const timeout = `\u001b[1;31m⏱\u001b[0;0m`

	for (const test_result of test_results) {
		if (test_result.has_error_occurred_during_testing) {
			ret.push(error)
		} else if (test_result.verdict === "pass") {
			ret.push(pass)
		} else if (test_result.verdict === "fail") {
			ret.push(fail)
		} else if (test_result.verdict === "timeout") {
			ret.push(timeout)
		}
	}

	return ret.join("")
}

export default function(jtest_session, test, test_results) {
	const final_verdict = determineFinalVerdict(test_results)

	process.stderr.write(`${condenseTestResultVerdicts(test_results)}`)

	if (final_verdict === "error") {
		process.stderr.write(`\u001b[1;33m`)
	} else if (final_verdict === "fail") {
		process.stderr.write(`\u001b[1;31m`)
	}

	process.stderr.write(` ${test.label}`)

	if (final_verdict === "pass" || final_verdict === "fail") {
		let max_time = Math.max.apply(null, test_results.map(result => result.execution_time))

		process.stderr.write(` \u001b[0;90m[${max_time.toFixed(2)}ms]\u001b[0;0m`)
	}

	process.stderr.write(`\u001b[0;0m\n`)

	for (const result of test_results) {
		if (jtest_session.options.collapsed) continue

		if (result.has_error_occurred_during_testing) {
			process.stderr.write(`\u001b[0;33m${result.error}\u001b[0;0m\n`)
		} else if (result.verdict === "fail") {
			process.stderr.write(`\u001b[0;31m${result.error}\u001b[0;0m\n`)
		} else if (result.verdict === "timeout") {
			process.stderr.write(`\u001b[0;31mThis test took too long to complete!\u001b[0;0m\n`)
		}
	}
}
