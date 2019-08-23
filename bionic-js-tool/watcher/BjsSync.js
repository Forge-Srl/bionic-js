const {Configuration} = require('./Configuration')
const {GuestWatcher} = require('./GuestWatcher')
const {Directory} = require('./Directory')
const {PackageFile} = require('./PackageFile')


class BjsSync {

    constructor(configurationPath, logger) {
        Object.assign(this, {configurationPath, logger})
    }

    async sync() {
        const config = await Configuration.fromPath(this.configurationPath)

        const guestWatcher = await GuestWatcher.build(config)
        const guestFiles = await guestWatcher.getInitialFiles()

        await this.syncPackageFiles(config.packageDir, guestFiles)
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