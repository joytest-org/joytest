import checkAPICompatibility from "./0.checkAPICompatibility.mjs"
import importAllTestFiles from "./1.importAllTestFiles.mjs"
import computeUnits from "./2.computeUnits.mjs"
import computeNumberOfTestsToRun from "./3.computeNumberOfTestsToRun.mjs"
import spawnRunners from "./4.spawnRunners.mjs"
import waitForAllRunnersToBeReady from "./5.waitForAllRunnersToBeReady.mjs"
import mapUnitsToRunners from "./6.mapUnitsToRunners.mjs"
import killRunners from "./7.killRunners.mjs"
import sanityCheck from "./8.sanityCheck.mjs"
import statistics from "./9.statistics.mjs"

export default [
	checkAPICompatibility,
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
