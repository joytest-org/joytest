#!/bin/bash -eufx

npm run prepare
./dist/cli.mjs . -test-mode-do-not-use -- __tests__/
