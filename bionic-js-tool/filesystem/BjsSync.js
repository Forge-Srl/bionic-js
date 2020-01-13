const {DebugLog} = require('./DebugLog')
const {HostProject} = require('./HostProject')
const {GuestWatcher} = require('./GuestWatcher')
const {GlobalSchemaCreator} = require('../parser/GlobalSchemaCreator')
const {Directory} = require('./Directory')
const {HostFile} = require('./HostFile')
const {PackageFile} = require('./PackageFile')
const bjsVersion = require('../package.json').version;

class BjsSync {

    constructor(configuration, log = new DebugLog()) {
        Object.assign(this, {configuration, log})
    }

    async sync() {
        try {
            this.log.info(`Bionic.js - v${bjsVersion}`)
            const guestFiles = await GuestWatcher.build(this.configuration).getInitialFiles()
            const guestFilesWithSchemas = await this.getGuestFilesWithSchemas(guestFiles)

            for (const targetConfig of this.configuration.hostTargets) {
                const hostProject = HostProject.build(targetConfig, this.log)
                await this.syncHostFiles(targetConfig, hostProject, guestFilesWithSchemas)
                await this.syncPackageFiles(targetConfig, hostProject, guestFilesWithSchemas)
                await hostProject.save()
            }
        } catch (error) {
            this.log.error(error)
        }
    }

    async getGuestFilesWithSchemas(guestFiles) {
        this.log.info('Processing guest files')

        this.log.info(' Extracting schemas from guest files...')
        const globalSchemaCreator = new GlobalSchemaCreator(guestFiles)
        const guestFilesWithSchemas = await globalSchemaCreator.getGuestFileSchemas()
        this.log.info(' ...done\n')
        return guestFilesWithSchemas
    }

    async syncHostFiles(targetConfig, hostProject, guestFilesWithSchemas) {
        const hostDir = new Directory(targetConfig.hostDirPath)
        this.log.info(`Processing host files dir "${hostDir.path}"`)

        this.log.info(` Deleting files\n`)
        await hostProject.cleanHostDir()

        this.log.info(` Generating host files...`)
        await Promise.all(guestFilesWithSchemas.map(guestFileWithSchema => {

            const hostFile = HostFile.build(guestFileWithSchema.guestFile, targetConfig)
            this.log.info(`  ${hostFile.relativePath}`)
            return hostFile.generate(guestFileWithSchema.schema, hostProject)
        }))
        this.log.info(' ...done\n')
    }

    async syncPackageFiles(targetConfig, hostProject, guestFilesWithSchemas) {
        const packageDir = new Directory(targetConfig.hostDirPath).getSubDir(targetConfig.packageName)
        this.log.info(`Processing package files dir "${packageDir.path}"`)

        this.log.info(' Generating package files...')
        await Promise.all(guestFilesWithSchemas.map(guestFileWithSchema => {

            const packageFile = PackageFile.build(guestFileWithSchema.guestFile, packageDir.path)
            this.log.info(`  ${packageFile.relativePath}`)
            return packageFile.generate(hostProject)
        }))
        this.log.info(' ...done\n')
    }
}

module.exports = {BjsSync}