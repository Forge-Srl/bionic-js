const glob = require('glob')
const {File} = require('./File')
const path = require('path')

class FileWalker {

    constructor(dirPath, filesFilter, fileFactory) {
        Object.assign(this, {
            dirPath, filesFilter, fileFactory,
            globOptions: {
                cwd: dirPath,
                nonull: false,
                nodir: true,
            },
        })
    }

    async getFiles() {
        return new Promise((resolve, reject) => {
            glob('**', this.globOptions, (error, files) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(files
                        .map(filePath => new File(path.resolve(this.dirPath, filePath), this.dirPath))
                        .filter(file => !this.filesFilter || !this.filesFilter.isToFilter(file))
                        .map(file => this.fileFactory ? this.fileFactory(file) : file))
                }
            })
        })
    }
}

module.exports = {FileWalker}