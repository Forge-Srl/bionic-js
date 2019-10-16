const path = require('path')
const os = require('os')
const rimraf = require('rimraf')
const fs = require('fs')

const getTempDirPath = (create = false) => {
    const tempPath = path.resolve(os.tmpdir(), 'js-tests')
    rimraf.sync(tempPath)
    if (create) {
        fs.mkdirSync(tempPath)
    }
    return tempPath
}

module.exports = {getTempDirPath}