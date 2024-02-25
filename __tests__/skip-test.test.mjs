import {createTestSuite} from "../dist/suite.mjs"
const {test, suite} = createTestSuite(import.meta.url)

test.skip("this test will be skipped", (expect) => {
	expect(1).not.toBe(1)
})

export default suite
