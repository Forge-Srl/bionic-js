const {BjsSync} = require('./filesystem/BjsSync')
const {BjsConfiguration} = require('./filesystem/configuration/BjsConfiguration')
const packageInfo = require('./package.json')

class Bjs {

    constructor(log) {
        this.log = log
    }

    get version() {
        return packageInfo.version
    }

    get info() {
        return packageInfo.description
    }

    async synchronize(configurationAbsolutePath) {
        const configuration = BjsConfiguration.fromPath(configurationAbsolutePath)
        const bjsSync = new BjsSync(configuration, this.log)
        await bjsSync.sync()
    }
}

module.exports = {Bjs}