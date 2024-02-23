/**
 * Make sure anio-jtest (this package) and the
 * project using anio-jtest uses an API that is compatible
 * with this package.
 */
import {createRequire} from "node:module"
import path from "node:path"

export default async function(jtest_session) {
	const require = createRequire(path.resolve(jtest_session.options.project_root, "index.js"))

	let project_anio_jtest_version = "0.0.0"

	try {
		const project_anio_jtest = require("@anio-jtest/test/package.json")

		project_anio_jtest_version = project_anio_jtest.version
	} catch (error) {
		throw new Error(
			`Could not read @anio-jtest/test/package.json from project root. Did you install @anio-jtest/test?`
		)
	}

	if (project_anio_jtest_version !== "0.17.2") {
		throw new Error(
			`Unsupported version of @anio-jtest/test. Required: 0.17.2, Actual: ${project_anio_jtest_version}.`
		)
	}
}
