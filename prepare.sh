#!/bin/bash -eufx

./node_modules/.bin/vipen .

cp src/cli.mjs dist/cli.mjs

mv dist/additional_entry_points/suite/package.min.mjs dist/suite.mjs

rm -r dist/additional_entry_points
