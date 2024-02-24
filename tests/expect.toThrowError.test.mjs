import {createTestSuite} from "@anio-jtest/test"
const {describe, test, suite} = createTestSuite(import.meta.url)

describe("expect.toThrowError", () => {
	test("basic functionality", (expect) => {
		expect(() => {
			throw new Error
		}).toThrowError()

		expect(() => {
			throw new Error("My message.")
		}).toThrowError("message")
	})

	test("error cases", (expect) => {
		let i = 0;

		try {
			expect(() => {}).toThrowError()
		} catch (_) { ++i; }

		try {
			expect(() => {
				throw new Error("my message.")
			}).toThrowError("Test")
		} catch (_) { ++i; }

		if (i !== 2) {
			throw new Error
		}
	})
})

export default suite
