import {c, print} from "@anio-js-foundation/str-colorize"

function determineFinalVerdict(test_results) {
	let passed = true, skipped = false

	for (const test_result of test_results) {
		if (test_result.has_error_occurred_during_testing) {
			return "error"
		}

		if (test_result.verdict === "skipped") skipped = true

		if (test_result.verdict !== "pass") passed = false
	}

	if (skipped) return "skipped"

	return passed ? "pass" : "fail"
}

function condenseTestResultVerdicts(test_results) {
	let ret = []

	const pass = c.green(`✔`)
	const fail = c.red(`✘`)
	const error = c.bold.yellow(`⚠`)
	const timeout = c.bold.red(`⏱`)
	const skipped = c.bold.blue(`⏵`)

	for (const test_result of test_results) {
		if (test_result.has_error_occurred_during_testing) {
			ret.push(error)
		} else if (test_result.verdict === "pass") {
			ret.push(pass)
		} else if (test_result.verdict === "fail") {
			ret.push(fail)
		} else if (test_result.verdict === "timeout") {
			ret.push(timeout)
		} else if (test_result.verdict === "skipped") {
			ret.push(skipped)
		}
	}

	return ret.join("")
}

function indent(text) {
	return `\n${text}`.split("\n").join("\n    ") + "\n"
}

export default function(jtest_session, test, test_results) {
	const final_verdict = determineFinalVerdict(test_results)

	print.stderr(`${condenseTestResultVerdicts(test_results)}`)

	let report = ``

	if (test.describe_block !== null) {
		const {label} = test.describe_block

		report += c.bold(` ${label} ›`)
	}

	report += ` ${test.label}`

	if (final_verdict === "pass" || final_verdict === "fail") {
		let max_time = Math.max.apply(null, test_results.map(result => result.execution_time))

		report += c.gray(` [${max_time.toFixed(2)}ms]`)
	}

	for (const result of test_results) {
		if (jtest_session.options.collapsed) continue

		if (result.has_error_occurred_during_testing) {
			report += "\n" + indent(result.error)
		} else if (result.verdict === "fail") {
			report += "\n" + indent(result.error)
		} else if (result.verdict === "timeout") {
			report += "\n" + indent(`This test took too long to complete!`)
		}
	}

	if (final_verdict === "error") {
		print.stderr(c.yellow(report))
	} else if (final_verdict === "fail") {
		print.stderr(c.red(report))
	} else {
		print.stderr(report)
	}

	print.stderr("\n")
}
