const {DebugLog} = require('./DebugLog')
const {HostProject} = require('./HostProject')
const {GuestWatcher} = require('./GuestWatcher')
const {GlobalSchemaCreator} = require('../parser/GlobalSchemaCreator')
const {Directory} = require('./Directory')
const {HostFile} = require('./HostFile')
const {PackageFile} = require('./PackageFile')

class BjsSync {

    constructor(configuration, log = new DebugLog()) {
        Object.assign(this, {configuration, log})
    }

    async sync() {
        try {
            const guestFiles = await GuestWatcher.build(this.configuration).getInitialFiles()
            const guestFilesSchemas = await this.getGuestFileSchemas(guestFiles)

            for (const targetConfig of this.configuration.hostTargets) {
                const hostProject = HostProject.build(targetConfig, this.log)
                await this.syncHostFiles(targetConfig, hostProject, guestFilesSchemas)
                await this.syncPackageFiles(targetConfig, hostProject, guestFilesSchemas)
                await hostProject.save()
            }

        } catch (error) {
            this.log.error(error)
        }
    }

    async getGuestFileSchemas(guestFiles) {
        this.log.info('Processing guest files')

        this.log.info(' Extracting schemas from guest files...')
        const globalSchemaCreator = new GlobalSchemaCreator(guestFiles)
        const guestFileSchemas = await globalSchemaCreator.getGuestFileSchemas()
        this.log.info(' ...done\n')
        return guestFileSchemas
    }

    async syncHostFiles(targetConfig, hostProject, guestFilesSchemas) {
        const hostDir = new Directory(targetConfig.hostDirPath)
        this.log.info(`Processing host files dir "${hostDir.path}"`)

        this.log.info(` Deleting files\n`)
        await hostProject.cleanHostDir()

        this.log.info(` Generating host files...`)
        await Promise.all(guestFilesSchemas.map(guestFileSchema => {

            const hostFile = HostFile.build(guestFileSchema.guestFile, targetConfig)
            this.log.info(`  ${hostFile.relativePath}`)
            return hostFile.generate(guestFileSchema.schema, hostProject)
        }))
        this.log.info(' ...done\n')
    }

    async syncPackageFiles(targetConfig, hostProject, guestFilesSchemas) {
        const packageDir = new Directory(targetConfig.hostDirPath).getSubDir(targetConfig.packageName)
        this.log.info(`Processing package files dir "${packageDir.path}"`)

        this.log.info(' Generating package files...')
        await Promise.all(guestFilesSchemas.map(guestFileSchema => {

            const packageFile = PackageFile.build(guestFileSchema.guestFile, packageDir.path)
            this.log.info(`  ${packageFile.relativePath}`)
            return packageFile.generate(hostProject)
        }))
        this.log.info(' ...done\n')
    }
}

module.exports = {BjsSync}