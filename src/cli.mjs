#!/usr/bin/env node
import {internal} from "./package.mjs"

const {
	c, print, forceColors,
	createJTestSession,
	parseCLIArgs,
	clearCurrentLine,
	reportTestResults,
	usage
} = internal

const cli_args = process.argv.slice(2)

if (!cli_args.length) {
	print.stderr(`You are using joytest v${internal.version}.\n\n`)
	print.stderr(usage)

	process.exit(2)
}

const jtest_session = createJTestSession(
	await parseCLIArgs(cli_args)
)

if (jtest_session.options.ci) {
	forceColors()
}

print.stderr(
	c.bold.yellow(`🌞 Joytest v${internal.version}\n`)
)

print.stderr(c.gray(`Using ${jtest_session.options.parallel} parallel worker(s).\n`))
print.stderr(c.gray(`Timeout set to ${jtest_session.options.timeout}ms.\n`))

let all_passing = true

function progressBar(max, current) {
	const n_chars = 20

	let percentage = (current / max)

	let on_chars = Math.floor(n_chars * percentage)
	let off_chars = n_chars - on_chars

	let color = all_passing ? `cyan` : `yellow`

	return `[${c.bold[color]("◼".repeat(on_chars))}${" ".repeat(off_chars)}]`
}

let num_unit_tests_to_run = 0

jtest_session.on("report", ({id, value}) => {
	if (id === "computed_units") {
		print.stderr(`[report] I got ${value} units to process\n`)
	} else if (id === "number_of_tests_to_run") {
		num_unit_tests_to_run = value

		print.stderr(`[report] I got ${value} unit tests to run\n`)
	} else if (id === "number_of_tests_ran") {
		if (jtest_session.options.ci) return

		clearCurrentLine()

		if (num_unit_tests_to_run !== value) {
			print.stderr(`${progressBar(num_unit_tests_to_run, value)} `)
		}

		print.stderr(`Running ${value} / ${num_unit_tests_to_run} unit tests`)

		if (num_unit_tests_to_run === value) {
			print.stderr("\n")
		}
	} else if (id === "test_result") {
		if (!jtest_session.options.ci) clearCurrentLine()

		const all_runners_done = value.results.filter(result => result === false).length === 0

		//
		// check for failing or erroring test results
		//
		for (const result of value.results) {
			if (result === false) continue

			if (result.has_error_occurred_during_testing) {
				all_passing = false
			} else if (result.verdict !== "pass" && result.verdict !== "skipped") {
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
	print.stderr(c.gray(`Spawning ${n_runners} runners.\n`))
})

jtest_session.on("runner:spawned", ({index, runner}) => {
	const dynamic_props = runner.getDynamicProperties()

	if (runner.type === "browser") {
		print.stderr(`[runner-${index}] Please open http://localhost:${dynamic_props.port}/index.html\n`)
	} else if (runner.type === "node") {
		if ("node_binary" in dynamic_props) {
			print.stderr(`[runner-${index}] Node runner will connect automatically (using binary at '${dynamic_props.node_binary}')\n`)
		} else {
			print.stderr(`[runner-${index}] Node runner will connect automatically once the node binary is ready (requested node version '${dynamic_props.requested_version}')\n`)
		}
	}
})

jtest_session.on("post-runner-spawn", () => {
	print.stderr(`Waiting for runner(s) to connect ...\n`)
})

jtest_session.on("runner:reportString", ({index, string}) => {
	print.stderr(c.gray(`[runner-${index}] ${string}\n`))
})

jtest_session.on("runner:ready", ({index, runner}) => {
	const dynamic_props = runner.getDynamicProperties()

	print.stderr(`[runner-${index}] Connected to the test session!`)

	if ("concrete_version" in dynamic_props) {
		print.stderr(` Using concrete version '${dynamic_props.concrete_version}'`)
	}

	print.stderr("\n")
})

jtest_session.on("ready", () => {
	print.stderr(`All runners connected!\n`)
})

// returns test results
let result = await jtest_session.run()

function millisToSeconds(value) {
	return (value / 1000).toFixed(3)
}

function highlightFailed(value) {
	if (value === 0) return `${value}`

	return c.bold.red(value)
}

function highlightError(value) {
	if (value === 0) return `${value}`

	return c.bold.yellow(value)
}

function highlightSkipped(value) {
	if (value === 0) return `${value}`

	return c.bold.blue(value)
}

print.stderr(
	`Ran ${result.statistics.number_of_tests} unit test(s): ` +
	`${result.statistics.number_of_tests_passed} passed` +
	`, ${highlightSkipped(result.statistics.number_of_tests_skipped)} skipped` +
	`, ${highlightFailed(result.statistics.number_of_tests_failed)} failed` +
	`, ${highlightError(result.statistics.number_of_tests_error)} had errors.\n`
)

print.stderr(
	`Done in ${millisToSeconds(result.execution_time)} second(s)` +
	`, made ${result.statistics.number_of_assertions_made} assertion(s)\n`
)

let had_error = true

if (result.statistics.number_of_tests === 0 && !jtest_session.options["allow-zero-tests"]) {
	print.stderr(
		c.bold.yellow(`⚠️  No unit tests specified!\n`)
	)
} else {
	if (result.successful) {
		had_error = false

		print.stderr(
			c.bold.green(`✔ All tests successfully passed!\n`)
		)
	}
}

if (had_error) {
	process.exit(1)
}
