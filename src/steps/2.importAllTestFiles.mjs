import path from "node:path"
import createWorker from "@anio-js-foundation/create-worker"

export default async function(jtest_session) {
	const worker = await createWorker.fromCode(`
export function WorkerMain() {
	this.requestHandler = requestHandler
}

export async function requestHandler(test_file) {
	try {
		const module = await import(test_file)

		if (!("default" in module)) {
			return {
				error: \`Test file must use a default export\`
			}
		} else if (!("is_anio_jtest_test_suite" in module.default)) {
			return {
				error: \`Module doesn't export an joytest test suite\`
			}
		}

		return module.default
	} catch (error) {
		return {
			error: error.message
		}
	}
}
`/*, [], "WorkerMain", {
	silent: false
}*/)

	let test_suites = []
	let processed_files = {}

	for (const test_file of jtest_session.options.test_files) {
		const absolute_path = path.join(jtest_session.options.project_root, test_file)

		if (absolute_path in processed_files) continue

		const test_suite = await worker.sendRequest(absolute_path)

		if ("error" in test_suite) {
			throw new Error(
				`Error processing test file '${test_file}': ${test_suite.error}.`
			)
		}

		test_suites.push(test_suite)

		processed_files[absolute_path] = 1
	}

	await worker.terminate()

	jtest_session.internal_state.input = {test_suites, processed_files}
}
