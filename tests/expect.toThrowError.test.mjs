import {describe, test, expect} from "@anio-jtest/test"

describe("expect.toThrowError", () => {
	test("basic functionality", () => {
		expect(() => {
			throw new Error
		}).toThrowError()

		expect(() => {
			throw new Error("My message.")
		}).toThrowError("message")
	})

	test("error cases", () => {
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
