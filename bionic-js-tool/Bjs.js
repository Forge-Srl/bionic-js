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

    async synchronize(configurationAbsolutePath) {
        const configuration = BjsConfiguration.fromPath(configurationAbsolutePath)
        const bjsSync = new BjsSync(configuration, this.log)
        await bjsSync.sync()
    }
}

module.exports = {Bjs}