import fs from "node:fs/promises"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

const {version} = JSON.parse(await fs.readFile(
	path.join(__dirname, "package.json")
))

let package_dist = (await fs.readFile(
	path.join(__dirname, "dist", "package.mjs")
))

package_dist = package_dist.toString().split(
	`%%JOYTEST_RELEASE_VERSION%%`
).join(version)

await fs.writeFile(
	path.join(__dirname, "dist", "package.mjs"), package_dist
)
