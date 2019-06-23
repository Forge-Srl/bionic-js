const {CodeWatcher} = require('./CodeWatcher')

class PackageWatcher extends CodeWatcher {

    constructor(packageDir) {
        super(packageDir)
    }

    static async build(config) {
        return new PackageWatcher(config.packageDir)
    }
}

module.exports = {PackageWatcher}