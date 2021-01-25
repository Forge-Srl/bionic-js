const path = require('path')

function posixPath(inPath) {
    if (inPath === undefined || inPath === null) {
        return inPath
    }
    return inPath.split(path.sep).join(path.posix.sep)
}

module.exports = {posixPath}