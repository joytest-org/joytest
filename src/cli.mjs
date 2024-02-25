#!/usr/bin/env node
import {internal} from "./package.mjs"

const {
	createJTestSession,
	parseCLIArgs,
	clearCurrentLine,
	reportTestResults,
	usage
} = internal

const cli_args = process.argv.slice(2)

if (!cli_args.length) {
	process.stderr.write(usage)
	process.exit(2)
}

const jtest_session = createJTestSession(
	await parseCLIArgs(cli_args)
)

process.stderr.write(`Using ${jtest_session.options.parallel} parallel worker(s).\n`)
process.stderr.write(`Timeout set to ${jtest_session.options.timeout}ms.\n`)

let all_passing = true

function progressBar(max, current) {
	const n_chars = 20

	let percentage = (current / max)

	let on_chars = Math.floor(n_chars * percentage)
	let off_chars = n_chars - on_chars

	let color = all_passing ? `96;40m` : `93;40m`

	return `[\u001b[${color}${"◼".repeat(on_chars)}\u001b[0;0m\u001b[30;40m${"#".repeat(off_chars)}\u001b[0;0m]`
}

let num_unit_tests_to_run = 0

jtest_session.on("report", ({id, value}) => {
	if (id === "computed_units") {
		process.stderr.write(`[report] I got ${value} units to process\n`)
	} else if (id === "number_of_tests_to_run") {
		num_unit_tests_to_run = value

		process.stderr.write(`[report] I got ${value} unit tests to run\n`)
	} else if (id === "number_of_tests_ran") {
		clearCurrentLine()

		if (num_unit_tests_to_run !== value) {
			process.stderr.write(`${progressBar(num_unit_tests_to_run, value)} `)
		}

		process.stderr.write(`Running ${value} / ${num_unit_tests_to_run} unit tests`)

		if (num_unit_tests_to_run === value) {
			process.stderr.write("\n")
		}
	} else if (id === "test_result") {
		clearCurrentLine()

		const all_runners_done = value.results.filter(result => result === false).length === 0

		//
		// check for failing or erroring test results
		//
		for (const result of value.results) {
			if (result === false) continue

			if (result.has_error_occurred_during_testing) {
				all_passing = false
			} else if (result.verdict !== "pass") {
				all_passing = false
			}
		}

		//
		// only show test result when all runners have runned the test
		//
		if (all_runners_done) {
			const {test, results} = value

			reportTestResults(jtest_session, test, results)
		}
	}
})

jtest_session.on("pre-runner-spawn", (n_runners) => {
	process.stderr.write(`Spawning ${n_runners} runners.\n`)
})

jtest_session.on("runner:spawned", ({index, runner}) => {
	if (runner.type === "browser") {
		process.stderr.write(`[runner-${index}] Please open http://localhost:${runner.port}/index.html\n`)
	} else {
		process.stderr.write(`[runner-${index}] Node runner will connect automatically (using binary '${runner.node_binary}')\n`)
	}
})

jtest_session.on("post-runner-spawn", () => {
	process.stderr.write(`Waiting for runner(s) to connect ...\n`)
})

jtest_session.on("ready", () => {
	process.stderr.write(`All runners connected!\n`)
})

// returns test results
let result = await jtest_session.run()

function millisToSeconds(value) {
	return (value / 1000).toFixed(3)
}

function highlightFailed(value) {
	if (value === 0) return `${value}`

	return `\u001b[1;31m${value}\u001b[0;0m`
}

function highlightError(value) {
	if (value === 0) return `${value}`

	return `\u001b[1;33m${value}\u001b[0;0m`
}

process.stderr.write(
	`Ran ${result.statistics.number_of_tests} unit test(s): ` +
	`${result.statistics.number_of_tests_passed} passed` +
	`, ${highlightFailed(result.statistics.number_of_tests_failed)} failed` +
	`, ${highlightError(result.statistics.number_of_tests_error)} had errors.\n`
)

process.stderr.write(`Done in ${millisToSeconds(result.execution_time)} second(s)\n`)

let had_error = true

if (result.statistics.number_of_tests === 0) {
	process.stderr.write(
		`\u001b[1;33m⚠️  No unit tests specified!\u001b[0;0m\n`
	)
} else {
	if (result.successful) {
		had_error = false

		process.stderr.write(
			`\u001b[1;32m✔ All tests successfully passed!\u001b[0;0m\n`
		)
	}
}

if (had_error) {
	process.exit(1)
}
