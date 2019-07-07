const {DirectoryWatcher} = require('./DirectoryWatcher')

class PackageWatcher extends DirectoryWatcher {

    constructor(packageDir) {
        super(packageDir)
    }

    static build(config) {
        return new PackageWatcher(config.packageDir)
    }
}

module.exports = {PackageWatcher}