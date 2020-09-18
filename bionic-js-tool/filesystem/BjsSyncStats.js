class BjsSyncStats {

    constructor() {
        this.packageFiles = {deleted: [], updated: [], added: []}
        this.hostFiles = {deleted: [], updated: [], added: []}
        this.startTimestamp = new Date().getTime()
    }

    get processingTime() {
        return (new Date().getTime() - this.startTimestamp) / 1000
    }

    deletePackageFile(relativePath) {
        this.packageFiles.deleted.push(relativePath)
    }

    updatePackageFile(relativePath) {
        this.packageFiles.updated.push(relativePath)
    }

    addPackageFile(relativePath) {
        this.packageFiles.added.push(relativePath)
    }

    deleteHostFile(relativePath) {
        this.hostFiles.deleted.push(relativePath)
    }

    updateHostFile(relativePath) {
        this.hostFiles.updated.push(relativePath)
    }

    addHostFile(relativePath) {
        this.hostFiles.added.push(relativePath)
    }

    logFiles(log, files) {
        for (const file of files.deleted) {
            log.info(` [-] ${file}\n`)
        }
        for (const file of files.updated) {
            log.info(` [U] ${file}\n`)
        }
        for (const file of files.added) {
            log.info(` [+] ${file}\n`)
        }
        log.info(' ----------\n')
        log.info(` [-] deleted : ${files.deleted.length}\n`)
        log.info(` [U] updated : ${files.updated.length}\n`)
        log.info(` [+] added : ${files.added.length}\n`)
    }

    logProcessingTime(log) {
        log.info(`Processing time: ${this.processingTime.toFixed(2)}s\n`)
    }

    logStats(log) {
        log.info('\n')
        log.info('Package files\n')
        this.logFiles(log, this.packageFiles)
        log.info('\n')
        log.info('Host files\n')
        this.logFiles(log, this.hostFiles)
        log.info('\n')
        this.logProcessingTime(log)
    }
}

module.exports = {BjsSyncStats}