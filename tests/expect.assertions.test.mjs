import {createTestSuite} from "@anio-jtest/test"
const {describe, test, suite} = createTestSuite(import.meta.url)

describe("expect.assertions", () => {
	test("should work", (expect) => {
		expect.assertions(2)
		expect(1).toEqual(1)
		expect(1).toBe(1)
	})

	/*
	test("should throw an error if assertions() is called more than once", (expect) => {
		let errorThrown = false

		expect.assertions(0)

		try {
			expect.assertions(1)
		} catch (_) {
			errorThrown = true
		}

		if (!errorThrown) {
			throw new Error
		}
	})
	*/
})

export default suite
