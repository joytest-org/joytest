function parseString(runner_config) {
	let first_colon = runner_config.indexOf(":")

	if (first_colon === -1) {
		return {type: runner_config, option: ""}
	}

	let runner_type = runner_config.slice(0, first_colon)

	return {
		type: runner_type,
		option: runner_config.slice(first_colon + 1)
	}
}

export default function(runner_config) {
	const {type, option} = parseString(runner_config)
	let options_obj = {}

	switch (type) {
		case "node": {
			if (option.length) {
				options_obj["node_binary"] = option
			}
		} break

		case "browser": {
			if (option.length) {
				options_obj["http_port"] = parseInt(option, 10)
			}
		} break

		default: {
			throw new Error(`No such runner '${type}'.`)
		} break
	}

	return {
		type,
		options: options_obj
	}
}
