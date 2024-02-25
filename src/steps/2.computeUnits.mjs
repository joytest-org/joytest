/*
    3 - isolate by test case (default and recommended, slowest)
        Runs every test case in a separate worker.

    2 - isolate by describe block
        Runs every describe block in a separate worker.

    1 - isolate by test file
        Runs every test file in a separate worker.

    0 - run everything without isolation (not recommended, fastest)
        Runs everything in a single worker.
*/
import shuffleArrayInPlace from "@anio-js-core-foundation/shuffle-array-in-place"

function processTests(jtest_session, fn) {
	for (const test_suite of jtest_session.internal_state.input.test_suites) {
		for (const entry of test_suite.tests) {
			if ("tests" in entry) {
				for (const test of entry.tests) {
					fn(test)
				}
			} else {
				fn(entry)
			}
		}
	}
}

export default function(jtest_session) {
	let units = []

	if (jtest_session.options.isolate === 0) {
		let unit = []

		processTests(jtest_session, (test) => {
			// all tests are in the same unit
			unit.push({
				id: test.id,
				referenced_from: test.referenced_from
			})
		})

		units.push(unit)
	}
	else if (jtest_session.options.isolate === 1) {
		let map = new Map()

		processTests(jtest_session, (test) => {
			const {referenced_from} = test

			if (!map.has(referenced_from)) {
				map.set(referenced_from, [])
			}

			map.get(referenced_from).push({
				id: test.id,
				referenced_from: test.referenced_from
			})
		})

		for (const [file, unit] of map) {
			units.push(unit)
		}
	}
	else if (jtest_session.options.isolate === 3) {
		processTests(jtest_session, (test) => {
			// each test is their own unit
			units.push([{
				id: test.id,
				referenced_from: test.referenced_from
			}])
		})
	}

	processTests(jtest_session, (test) => {
		jtest_session.internal_state.tests.set(test.id, test)
	})

	if (!jtest_session.options["no-randomize"]) {
		for (const unit of units) {
			shuffleArrayInPlace(unit)
		}

		shuffleArrayInPlace(units)
	}

	jtest_session.internal_state.computed_units = units

	jtest_session.dispatchEvent(
		"report", {id: "computed_units", value: units.length}
	)
}
