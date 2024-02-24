export default async function(jtest_session) {
	for (const instance of jtest_session.internal_state.runners) {
		instance.terminate()
	}
}
