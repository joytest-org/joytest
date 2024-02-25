#!/bin/bash -eufx

./node_modules/.bin/rollup -c rollup.config.mjs

cp src/cli.mjs dist/cli.mjs

node replaceVersionNumber.mjs
