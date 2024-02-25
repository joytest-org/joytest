import {createTestSuite} from "../src/suite/index.mjs"
const {describe, test, suite} = createTestSuite(import.meta.url)

test("single test", (expect) => {

	expect.assertions(1)
	expect("1").toBe("1")

})

test("single test", (expect) => {

	expect.assertions(1)
	expect("1").toBe("1")

})

export default suite
