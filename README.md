<img src="./logo.png" height="50px">

---

A small yet versatile javascript test runner.

> [!WARNING]  
> This project is far from production ready. API and behaviour might change without notice.

```
Usage: joytest <project-root> [...options] [...flags] -- [...test_files]

    Possible options and their meaning:

        --runner <type>:<option>
            Tells joytest to spawn a runner of type 'type'.

            Possible types:

                node:<option>
                    Spawn a node process to run test files on.

                    If <option> starts with a slash (/) this sets the
                    path to the node binary to be used by the runner.

                    If <option> does not start with a slash, this value
                    is interpreted as a node version specifier.

                browser:<http-port>
                    Spawn a HTTP server to run test files on.
                    The port of the HTTP server can be specified as the option.
                    Default is a random free port.

            This option can be specified multiple times to create as many runners as you like.

            Example:

                joytest <project_root> \
                    --runner node \
                    --runner browser:8080 \
                    --runner node:/home/runner/node/v20/bin/node \
                    --runner node:latest \
                    --runner node:v19

            The default is to spawn a single node process (equivalent to specifying "--runner node").

        --isolate <level>
            Specify level of isolation ; a higher value means better test isolation.

            Possible values:

                3 - isolate by test case (default and recommended, slowest)
                    Runs every test case in a separate worker.

                2 - isolate by describe block
                    Runs every describe block in a separate worker.

                1 - isolate by test file
                    Runs every test file in a separate worker.

                0 - run everything without isolation (not recommended, fastest)
                    Runs everything in a single worker.

        --parallel <n>
            Specify how many workers are spawned to run unit tests.
            This option has no effect if --isolate is 0.
            The default value is whatever "os.availableParallelism()" returns.

        --info-fd <n>
            Print information (in JSON format) that can be used to automate
            calls to joytest on file descriptor with id <n>.

        --slow-test-threshold <n>
            Specify amount after a test is being reported as "slow".
            The default is 2500 (2.5 seconds).

        --timeout <n>
            Specify maximum amount of time a unit test can run in milliseconds.
            The default value is 5000 (5 seconds).

    Possible flags and their meaning:

        -allow-zero-tests
            Allow zero unit tests.
            Normally this would be considered an error.

        -no-randomize
            Do not randomize order of test cases.
            This is only really relevant if "--parallel 1" was specified.

        -collapsed
            Do not display extra information.

        -ci
            Set this flag if you're invoking joytest from a ci script.

    Handling of test_files:

        If a file is specified it will be added to the session, regardless of the file extension.
        If a directory is specified it will be read recursively and only files ending in ".test.mjs" will be added to the session.
        Specifying the same test file twice will not result in the test file being added a second time.
```

Some things are not implemented (yet) such as info-fd, slow-test-threshold and `--isolate 2`.

## Test File API

```js
//
// these two lines are basic boilerplate for a unit test file.
//
import {createTestSuite} from "joytest/suite"

const {describe, test, suite} = createTestSuite(import.meta.url)

describe("this is a describe block", () => {
	test("this is a synchronous test", (expect) => {
		expect(1).toBe(1)
	})

	test("this is an asynchronous test", async (expect) => {
		expect.assertions(1)

		await (new Promise(resolve => setTimeout(resolve, 100)))

		expect(1).toBe(1)
	})

	test.skip("this test will be skipped", (expect) => {
		expect(1).not.toBe(1)
	})
})

//
// test file must export a test suite
//
export default suite
```

### Todo

- Implement rest of the feature set.
- Session Server (graphical web view), not a priority.
