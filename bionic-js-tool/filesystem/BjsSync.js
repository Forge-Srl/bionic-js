const {DebugLog} = require('./DebugLog')
const {Configuration} = require('./Configuration')
const {HostProject} = require('./HostProject')
const {GuestWatcher} = require('./GuestWatcher')
const {GlobalSchemaCreator} = require('../parser/GlobalSchemaCreator')
const {Directory} = require('./Directory')
const {HostFile} = require('./HostFile')
const {PackageFile} = require('./PackageFile')

class BjsSync {

    constructor(configurationPath, log = new DebugLog()) {
        Object.assign(this, {configurationPath, log})
    }

    async sync() {
        try {
            const config = Configuration.fromPath(this.configurationPath)
            const guestFiles = await GuestWatcher.build(config).getInitialFiles()
            const guestFilesWithSchemas = await this.processGuestFiles(guestFiles)

            for (const targetConfig of config.hostTargets) {

                const hostProject = HostProject.build(targetConfig)
                await this.syncHostFiles(targetConfig, hostProject, guestFilesWithSchemas)
                await this.syncPackageFiles(targetConfig, hostProject, guestFilesWithSchemas)
                await hostProject.save()
            }

        } catch (error) {
            this.log.error(error)
        }
    }

    async processGuestFiles(guestFiles) {
        this.log.info('Processing guest files')

        this.log.info(' Extracting schemas from guest files...')
        const globalSchemaCreator = new GlobalSchemaCreator(guestFiles)
        const guestFilesWithSchemas = await globalSchemaCreator.getGuestFilesWithSchemas()
        this.log.info(' ...done\n')
        return guestFilesWithSchemas
    }

    async syncHostFiles(targetConfig, hostProject, guestFilesWithSchemas) {
        const hostDir = new Directory(targetConfig.hostDir)
        this.log.info(`Processing host files dir "${hostDir.path}"`)

        this.log.info(` Deleting files\n`)
        await hostProject.cleanHostDir(hostDir)

        this.log.info(` Generating host files...`)
        await Promise.all(guestFilesWithSchemas.map(guestFileWithSchema => {

            const hostFile = HostFile.build(guestFileWithSchema.guestFile, targetConfig)
            this.log.info(`  ${hostFile.relativePath}`)
            return hostFile.generate(guestFileWithSchema.schema, hostProject)
        }))
        this.log.info(' ...done\n')
    }

    async syncPackageFiles(targetConfig, hostProject, guestFilesWithSchemas) {
        const packageDir = new Directory(targetConfig.packageDir)
        this.log.info(`Processing package files dir "${packageDir.path}"`)

        this.log.info(` Deleting files\n`)
        await hostProject.cleanPackageDir(packageDir)

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