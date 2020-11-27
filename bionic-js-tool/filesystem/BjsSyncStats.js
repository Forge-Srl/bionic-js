class BjsSyncStats {

    constructor() {
        this.startTimestamp = new Date().getTime()
    }

    get processingTime() {
        return (new Date().getTime() - this.startTimestamp) / 1000
    }

    setProjectFilesDiff(projectFilesDiff) {
        this.projectFilesDiff = projectFilesDiff
    }

    logStats(log) {
        const compareProjectFiles = (projectFile1, projectFile2) => {
            const text1 = projectFile1.logText
            const text2 = projectFile2.logText
            return text1 < text2 ? -1 : text1 > text2 ? 1 : 0
        }

        log.info('\n')
        log.info('Project files\n')
        for (const file of this.projectFilesDiff.filesToDelete.sort(compareProjectFiles)) {
            log.info(` [-] ${file.logText}\n`)
        }
        for (const file of this.projectFilesDiff.filesToUpdate.sort(compareProjectFiles)) {
            log.info(` [U] ${file.logText}\n`)
        }
        for (const file of this.projectFilesDiff.filesToAdd.sort(compareProjectFiles)) {
            log.info(` [+] ${file.logText}\n`)
        }
        log.info(' ----------\n')
        log.info(` [-] deleted : ${this.projectFilesDiff.filesToDelete.length}\n`)
        log.info(` [U] updated : ${this.projectFilesDiff.filesToUpdate.length}\n`)
        log.info(` [+] added : ${this.projectFilesDiff.filesToAdd.length}\n`)
        log.info('\n')
        log.info(`Processing time: ${this.processingTime.toFixed(2)}s\n`)
    }
}

module.exports = {BjsSyncStats}