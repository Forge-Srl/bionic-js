const fg = require('fast-glob')
const {File} = require('./File')
const path = require('path')

class FileWalker {

    constructor(dirPath, filesFilter, fileFactory) {
        Object.assign(this, {
            dirPath, filesFilter, fileFactory,
            globOptions: {
                cwd: dirPath,
                onlyFiles: true,
            },
        })
    }

    async getFiles() {
        const files = await fg(['**'], this.globOptions)
        return files
            .map(filePath => new File(path.resolve(this.dirPath, filePath), this.dirPath))
            .filter(file => !this.filesFilter || !this.filesFilter.isToFilter(file))
            .map(file => this.fileFactory ? this.fileFactory(file) : file)
    }
}

module.exports = {FileWalker}