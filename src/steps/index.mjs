import checkInput from "./0.checkInput.mjs"
import createHomeDirectory from "./1.createHomeDirectory.mjs"
import importAllTestFiles from "./2.importAllTestFiles.mjs"
import computeUnits from "./3.computeUnits.mjs"
import computeNumberOfTestsToRun from "./4.computeNumberOfTestsToRun.mjs"
import spawnRunners from "./5.spawnRunners.mjs"
import waitForAllRunnersToBeReady from "./6.waitForAllRunnersToBeReady.mjs"
import mapUnitsToRunners from "./7.mapUnitsToRunners.mjs"
import killRunners from "./8.killRunners.mjs"
import sanityCheck from "./9.sanityCheck.mjs"
import statistics from "./10.statistics.mjs"

export default [
	checkInput,
	createHomeDirectory,
	importAllTestFiles,
	computeUnits,
	computeNumberOfTestsToRun,
	spawnRunners,
	waitForAllRunnersToBeReady,
	mapUnitsToRunners,
	killRunners,
	sanityCheck,
	statistics
]
