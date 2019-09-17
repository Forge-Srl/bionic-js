const {NullLog} = require('./NullLog')
const {Configuration} = require('./Configuration')
const {GuestWatcher} = require('./GuestWatcher')
const {Directory} = require('./Directory')
const {PackageFile} = require('./PackageFile')
const {HostFile} = require('./HostFile')
const {ModuleExplorer} = require('../parser/jsExplorer/ModuleExplorer')
const {GlobalSchemaCreator} = require('../parser/GlobalSchemaCreator')
const parser = require('@babel/parser')

class BjsSync {

    constructor(configurationPath, log = new NullLog()) {
        Object.assign(this, {configurationPath, log})
    }

    async getClassSchemas(guestFile) {
        const moduleSrc = await guestFile.getContent()
        const moduleExplorer = new ModuleExplorer(parser.parse(moduleSrc, {sourceType: 'module'}))
        const classSchemas = moduleExplorer.classExplorers.map(classExplorer => classExplorer.schema)
        if (classSchemas.length > 1)
            throw new Error(`cannot export more than one class from the module file ${guestFile.relativePath}`)
        return classSchemas
    }

    async sync() {
        const config = await Configuration.fromPath(this.configurationPath)

        const guestWatcher = await GuestWatcher.build(config)
        const guestFiles = await guestWatcher.getInitialFiles()

        await this.syncHostFiles(config.hostDir, config.hostLanguage, guestFiles)
        await this.syncPackageFiles(config.packageDir, guestFiles)
    }

    async syncHostFiles(hostDirPath, hostLanguage, guestFiles) {
        const globalSchemaCreator = new GlobalSchemaCreator(guestFiles)

        const hostDir = new Directory(hostDirPath)
        this.log.info(`Deleting host dir: "${hostDir.path}"`)
        await hostDir.delete()

        this.log.info(`Extracting schemas from guest files`)
        const guestFilesWithSchemas = await globalSchemaCreator.getGuestFilesWithSchemas()

        await Promise.all(guestFilesWithSchemas.map(guestFileWithSchema => {
            const hostFile = HostFile.build(guestFileWithSchema.guestFile, hostDir.path, hostLanguage)
            this.log.info(`Generating "${hostFile.path}"`)
            return hostFile.generate(guestFileWithSchema.schema)
        }))
    }

    async syncPackageFiles(packageDirPath, guestFiles) {
        const packageDir = new Directory(packageDirPath)
        this.log.info(`Deleting package dir: "${packageDir.path}"`)
        await packageDir.delete()

        const packageFiles = guestFiles.map(guestFile => PackageFile.build(guestFile, packageDir.path))
        await Promise.all(packageFiles.map(packageFile => {
            this.log.info(`Copying "${packageFile.path}"`)
            return packageFile.generate()
        }))
    }
}

module.exports = {BjsSync}