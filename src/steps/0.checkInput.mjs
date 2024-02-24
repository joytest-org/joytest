import path from "node:path"
import fs from "node:fs/promises"

export default async function(jtest_session) {
	const {project_root} = jtest_session.options

	const package_json_path = path.join(
		project_root, "package.json"
	)

	try {
		const stat = await fs.lstat(package_json_path)

		if (!stat.isFile() || stat.isSymbolicLink()) {
			throw new Error()
		}
	} catch (error) {
		throw new Error(
			`Could not find package.json inside project_root (${project_root}) folder.`
		)
	}
}
