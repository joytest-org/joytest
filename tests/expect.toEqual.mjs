import {describe, test, expect} from "@anio-jtest/test"

describe("expect.toEqual", () => {
	test("basic functionality", () => {
		let a = {}

		expect(1).toEqual(1)
		expect(false).toEqual(false)
		expect("test").toEqual("test")
		expect(a).toEqual(a)
		expect(a).toEqual({})
		expect([1,2,3]).toEqual([1,2,3])
		expect("string").toEqual(new String("string"))
		expect({
			a: {
				b: {
					c: [1, 2]
				}
			}
		}).toEqual({
			a: {
				b: {
					c: [1, 2]
				}
			}
		})
	})

	test("error cases", () => {
		let a = {}, i = 0;

		try { expect(1).toEqual(2); } catch (_) { ++i; }
		try { expect(true).toEqual(false); } catch (_) { ++i; }
		try { expect("").toEqual("test"); } catch (_) { ++i; }
		try { expect(a).toEqual({a: 1}); } catch (_) { ++i; }
		try { expect("string").toEqual(new String("")); } catch (_) { ++i; }
		try { expect([1,2,3]).toEqual([1,2,4]); } catch (_i) { ++i; }

		try {
			expect({
				a: {
					b: {
						c: [1, 2]
					}
				}
			}).toEqual({
				a: {
					b: {
						c: [1, 0]
					}
				}
			})
		} catch (_) { ++i; }

		if (i !== 7) {
			throw new Error
		}
	})
})
