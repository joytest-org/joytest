#!/bin/bash -eufx

npm run prepare
./dist/cli.mjs . -ci -test-mode-do-not-use
