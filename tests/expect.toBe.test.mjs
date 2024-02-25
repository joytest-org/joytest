import {createTestSuite} from "../src/suite/index.mjs"
const {describe, test, suite} = createTestSuite(import.meta.url)

describe("expect.toBe", () => {
	test("basic functionality", (expect) => {
		let a = {}

		expect(1).toBe(1)
		expect(false).toBe(false)
		expect("test").toBe("test")
		expect(a).toBe(a)
	})

	test("error cases", (expect) => {
		let a = {}, i = 0;

		try { expect(1).toBe(2); } catch (_) { ++i; }
		try { expect(true).toBe(false); } catch (_) { ++i; }
		try { expect("").toBe("test"); } catch (_) { ++i; }
		try { expect(a).toBe({}); } catch (_) { ++i; }

		if (i !== 4) {
			throw new Error
		}
	})
})

describe("expect.not.toBe", () => {
	test("basic functionality", (expect) => {
		let a = {}, b = {}

		expect(1).not.toBe(2)
		expect(false).not.toBe(true)
		expect("test").not.toBe("")
		expect(a).not.toBe(b)
	})

	test("error cases", (expect) => {
		let a = {}, i = 0;

		try { expect(1).not.toBe(1); } catch (_) { ++i; }
		try { expect(true).not.toBe(true); } catch (_) { ++i; }
		try { expect("").not.toBe(""); } catch (_) { ++i; }
		try { expect(a).not.toBe(a); } catch (_) { ++i; }

		if (i !== 4) {
			throw new Error
		}
	})
})

export default suite
