const {DebugLog} = require('./DebugLog')
const {Configuration} = require('./Configuration')
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
            const config = await Configuration.fromPath(this.configurationPath)

            const guestWatcher = await GuestWatcher.build(config)
            const guestFiles = await guestWatcher.getInitialFiles()

            const guestFilesWithSchemas = await this.processGuestFiles(guestFiles)
            await this.syncHostFiles(config.hostDir, config.hostLanguage, guestFilesWithSchemas)
            await this.syncPackageFiles(config.packageDir, guestFilesWithSchemas)
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

    async syncHostFiles(hostDirPath, hostLanguage, guestFilesWithSchemas) {
        const hostDir = new Directory(hostDirPath)
        this.log.info(`Processing host files dir "${hostDir.path}"`)

        this.log.info(` Deleting files\n`)
        await hostDir.delete()

        this.log.info(` Generating host files...`)
        await Promise.all(guestFilesWithSchemas.map(guestFileWithSchema => {

            const hostFile = HostFile.build(guestFileWithSchema.guestFile, hostDir.path, hostLanguage)
            this.log.info(`  ${hostFile.relativePath}`)
            return hostFile.generate(guestFileWithSchema.schema)
        }))
        this.log.info(' ...done\n')
    }

    async syncPackageFiles(packageDirPath, guestFilesWithSchemas) {
        const packageDir = new Directory(packageDirPath)
        this.log.info(`Processing package files dir "${packageDir.path}"`)

        this.log.info(` Deleting files\n`)
        await packageDir.delete()

        this.log.info(' Copying package files...')
        await Promise.all(guestFilesWithSchemas.map(guestFileWithSchema => {
            const packageFile = PackageFile.build(guestFileWithSchema.guestFile, packageDir.path)
            this.log.info(`  ${packageFile.relativePath}`)
            return packageFile.generate()
        }))
        this.log.info(' ...done\n')
    }
}

module.exports = {BjsSync}