import os from "node:os"
import fs from "node:fs/promises"
import path from "node:path"

export default async function(jtest_session) {
	await fs.mkdir(
		path.join(os.homedir(), ".joytest", "cache"), {
			mode: 0o755,
			recursive: true
		}
	)

	jtest_session.cache_dir = path.join(os.homedir(), ".joytest", "cache")
}
