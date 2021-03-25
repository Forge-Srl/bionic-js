const {BjsInit} = require('./filesystem/BjsInit')
const {BjsSync} = require('./filesystem/BjsSync')
const {BjsConfiguration} = require('./filesystem/configuration/BjsConfiguration')
const packageInfo = require('./package.json')

class Bjs {

    static get version() {
        return packageInfo.version
    }

    static get info() {
        return packageInfo.description
    }

    constructor(log) {
        this.log = log
    }

    async initializeConfiguration(configurationAbsolutePath, minimalConfiguration) {
        const bjsInit = new BjsInit(this.log)
        await bjsInit.init(configurationAbsolutePath, minimalConfiguration)
    }

    async synchronize(configurationAbsolutePath, cleanBefore = false) {
        const bjsSync = this.bjsSyncFromPath(configurationAbsolutePath)
        if (cleanBefore) {
            await bjsSync.clean()
        }
        await bjsSync.sync()
    }

    async clean(configurationAbsolutePath) {
        const bjsSync = this.bjsSyncFromPath(configurationAbsolutePath)
        await bjsSync.clean()
    }

    bjsSyncFromPath(configurationAbsolutePath) {
        this.log.info(`bionic.js - v${Bjs.version}\n\n`)
        const configuration = BjsConfiguration.fromPath(configurationAbsolutePath)
        return new BjsSync(configuration, this.log)
    }
}

module.exports = {Bjs}