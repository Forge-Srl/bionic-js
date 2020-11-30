const fg = require('fast-glob')
const {File} = require('./File')
const path = require('path')

class FileWalker {

    constructor(dirPath, patterns) {
        Object.assign(this, {
            dirPath, patterns,
            globOptions: {
                cwd: dirPath,
                onlyFiles: true,
            },
        })
    }

    async getFiles() {
        const files = await fg(this.patterns, this.globOptions)
        return files.map(filePath => new File(path.resolve(this.dirPath, filePath), this.dirPath))
    }
}

module.exports = {FileWalker}