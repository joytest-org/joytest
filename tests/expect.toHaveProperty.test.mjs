import {createTestSuite} from "../dist/suite.mjs"
const {describe, test, suite} = createTestSuite(import.meta.url)

describe("expect.toHaveProperty", () => {
	test("basic functionality", (expect) => {
		expect({test: 1}).toHaveProperty("test")
		expect("test").toHaveProperty("length")
		expect([1,2]).toHaveProperty("length")
	})

	test("error cases", (expect) => {
		let i = 0;

		try { expect({}).toHaveProperty("test"); } catch (_) { ++i; }

		if (i !== 1) {
			throw new Error
		}
	})
})

describe("expect.not.toHaveProperty", () => {
	test("basic functionality", (expect) => {
		expect({test: 1}).not.toHaveProperty("test1")
		expect("test").not.toHaveProperty("length1")
		expect([1,2]).not.toHaveProperty("length1")
	})

	test("error cases", (expect) => {
		let i = 0;

		try { expect({test:1}).not.toHaveProperty("test"); } catch (_) { ++i; }

		if (i !== 1) {
			throw new Error
		}
	})
})

export default suite
