export default async function(jtest_session) {
	let ready_promises = jtest_session.internal_state.runners.map(instance => {
		return instance.ready()
	})

	await Promise.all(ready_promises)

	jtest_session.dispatchEvent("ready")
}
