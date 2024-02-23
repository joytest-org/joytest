import {describe, test, expect} from "@anio-jtest/test"

describe("expect.assertions", () => {
	test("should work", () => {
		expect.assertions(2)
		expect(1).toEqual(1)
		expect(1).toBe(1)
	})

	test("should throw an error if assertions() is called more than once", () => {
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
})
