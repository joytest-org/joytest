import {c, print, forceColors} from "@anio-js-foundation/str-colorize"

import impl_createJTestSession from "./createJTestSession.mjs"
import impl_expandAndValidateInputTestFiles from "./lib/expandAndValidateInputTestFiles.mjs"

export const createJTestSession = impl_createJTestSession
export const expandAndValidateInputTestFiles = impl_expandAndValidateInputTestFiles

export default {
	version: `%%JOYTEST_RELEASE_VERSION%%`,
	createJTestSession,
	expandAndValidateInputTestFiles
}

//
// internal exports for cli.mjs
//
import internal_createJTestSession from "./createJTestSession.mjs"
import internal_parseCLIArgs from "./parseCLIArgs.mjs"
import internal_clearCurrentLine from "./lib/clearCurrentLine.mjs"
import internal_reportTestResults from "./lib/reportTestResults.mjs"
import internal_usage from "./usage.mjs"

export const internal = {
	c, print, forceColors,
	version: `%%JOYTEST_RELEASE_VERSION%%`,
	createJTestSession: internal_createJTestSession,
	parseCLIArgs: internal_parseCLIArgs,
	clearCurrentLine: internal_clearCurrentLine,
	reportTestResults: internal_reportTestResults,
	usage: internal_usage
}
