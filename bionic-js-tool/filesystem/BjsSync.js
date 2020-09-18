const {HostProject} = require('./HostProject')
const {BjsSyncStats} = require('./BjsSyncStats')
const {GuestWalker} = require('./GuestWalker')
const {GlobalSchemaCreator} = require('../parser/GlobalSchemaCreator')
const {HostFile} = require('./HostFile')
const {PackageFile} = require('./PackageFile')
const {HostEnvironmentFile} = require('./HostEnvironmentFile')
const {BjsNativeObjectPackageFile} = require('./BjsNativeObjectPackageFile')
const bjsVersion = require('../package.json').version

class BjsSync {

    constructor(configuration, log) {
        Object.assign(this, {configuration, log})
    }

    async sync() {
        try {
            this.log.info(`Bionic.js - v${bjsVersion}\n\n`)
            const bjsSyncStats = new BjsSyncStats()
            const guestFiles = await GuestWalker.build(this.configuration).getFiles()
            const exportedFiles = await this.getExportedFiles(guestFiles)

            for (const targetConfig of this.configuration.hostTargets) {
                const hostProject = await this.openHostProject(targetConfig, bjsSyncStats)
                await this.syncHostFiles(targetConfig, hostProject, exportedFiles)
                await this.syncPackageFiles(targetConfig, hostProject, exportedFiles)
                await this.syncVirtualFiles(targetConfig, hostProject, exportedFiles)
                await this.saveHostProject(hostProject)
                bjsSyncStats.logStats(this.log)
            }
        } catch (error) {
            this.log.error(error)
        }
    }

    async getExportedFiles(guestFiles) {
        this.log.info('Extracting schemas from guest files...\n')
        const globalSchemaCreator = new GlobalSchemaCreator(guestFiles)
        return await globalSchemaCreator.getExportedFiles()
    }

    async openHostProject(targetConfig, bjsSyncStats) {
        const hostProject = HostProject.build(targetConfig, this.log, bjsSyncStats)
        this.log.info('Opening host project...\n')
        await hostProject.open()
        return hostProject
    }

    async syncHostFiles(targetConfig, hostProject, exportedFiles) {
        this.log.info('Generating host files...\n')
        await Promise.all(exportedFiles.filter(exportedFile => exportedFile.requiresHostFile).map(exportedFile => {
            return HostFile.build(exportedFile, targetConfig).generate(hostProject)
        }))
    }

    async syncPackageFiles(targetConfig, hostProject, exportedFiles) {
        this.log.info('Generating package files...\n')
        await Promise.all(exportedFiles.map(exportedFile => {
            return PackageFile.build(exportedFile, targetConfig).generate(hostProject)
        }))
    }

    async syncVirtualFiles(targetConfig, hostProject, exportedFiles) {
        this.log.info('Generating virtual files...\n')

        const nativePackageFiles = exportedFiles.filter(exportedFile => exportedFile.requiresNativePackageFile)
        const hostEnvironmentFile = HostEnvironmentFile.build(nativePackageFiles, targetConfig)
        await hostEnvironmentFile.generate(hostProject)

        const packageFile = BjsNativeObjectPackageFile.build(targetConfig)
        await packageFile.generate(hostProject)
    }

    async saveHostProject(hostProject) {
        this.log.info('Saving host project...\n')
        await hostProject.save()
    }
}

module.exports = {BjsSync}