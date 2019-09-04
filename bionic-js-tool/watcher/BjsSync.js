const {Configuration} = require('./Configuration')
const {GuestWatcher} = require('./GuestWatcher')
const {Directory} = require('./Directory')
const {PackageFile} = require('./PackageFile')
const {HostFile} = require('./HostFile')
const {ModuleExplorer} = require('../parser/jsExplorer/ModuleExplorer')
const parser = require('@babel/parser')

class BjsSync {

    constructor(configurationPath, logger) {
        Object.assign(this, {configurationPath, logger})
    }

    async getClassSchemas(guestFile) {
        const moduleSrc = await guestFile.getContent()
        const moduleExplorer = new ModuleExplorer(parser.parse(moduleSrc, {sourceType: 'module'}))
        const classSchemas = moduleExplorer.classExplorers.map(classExplorer => classExplorer.schema)
        if (classSchemas.length > 1)
            throw new Error(`Cannot export more than one class from the module file ${guestFile.relativePath}`)
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
        const hostDir = new Directory(hostDirPath)
        this.logInfo(`Deleting host dir: "${hostDir.path}"`)
        await hostDir.delete()

        const hostFiles = guestFiles
            .filter(guestFile => guestFile.isHostExportable)
            .map(guestFile => HostFile.build(guestFile, hostDir.path, hostLanguage))

        await Promise.all(hostFiles.map(hostFile => {
            this.logInfo(`Generating "${hostFile.path}"`)
            return hostFile.generate()
        }))
    }

    async syncPackageFiles(packageDirPath, guestFiles) {
        const packageDir = new Directory(packageDirPath)
        this.logInfo(`Deleting package dir: "${packageDir.path}"`)
        await packageDir.delete()

        const packageFiles = guestFiles.map(guestFile => PackageFile.build(guestFile, packageDir.path))
        await Promise.all(packageFiles.map(packageFile => {
            this.logInfo(`Copying "${packageFile.path}"`)
            return packageFile.generate()
        }))
    }

    logInfo(message) {
        if (!this.logger)
            return

        this.logger.logInfo(message)
    }
}

module.exports = {BjsSync}