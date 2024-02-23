import fs from "node:fs/promises"
import path from "node:path"
import scandirSync from "@anio-js-core-foundation/node-fs-scandir-sync"

export default async function(project_root, entries) {
	let ret = []

	for (let i = 0; i < entries.length; ++i) {
		let absolute_path = await fs.realpath(path.join(project_root, entries[i]))

		if (!absolute_path.startsWith(project_root)) {
			throw new Error(`Test files must be located INSIDE project root.`)
		}

		const relative_path = absolute_path.slice(project_root.length)

		const stat = await fs.lstat(absolute_path)

		if (stat.isDirectory()) {
			for (const _ of scandirSync(absolute_path)) {
				if (_.type !== "file") continue
				if (!_.relative_path.endsWith(".test.mjs")) continue

				ret.push(`${relative_path}/${_.relative_path}`)
			}
		} else {
			ret.push(relative_path)
		}
	}

	return ret.map(file => path.normalize(file))
}
