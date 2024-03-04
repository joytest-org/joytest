#!/bin/bash -eufx

./node_modules/.bin/npm-package-bundler .

cp src/cli.mjs dist/cli.mjs

mv dist/suite/index.mjs dist/suite.mjs

rm -r dist/suite
