const {CodeWatcher} = require('./CodeWatcher')
const path = require('path')
const {FilesFilter} = require('./FilesFilter')

class HostWatcher extends CodeWatcher {

    static async build(config) {
        let hostFilesFilter
        const relativePackageDir = path.relative(config.hostDir, config.packageDir)
        if (!!relativePackageDir && (!relativePackageDir.startsWith('../') || !relativePackageDir.startsWith('..\\'))
            && !path.isAbsolute(relativePackageDir)) {
            hostFilesFilter = new FilesFilter(null, [relativePackageDir])
        }
        return new HostWatcher(config.hostDir, hostFilesFilter)
    }
}

module.exports = {HostWatcher}