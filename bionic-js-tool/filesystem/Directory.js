const {BaseFile} = require('./BaseFile')
const {File} = require('./File')
const path = require('path')
const mkdirp = require('./async/mkdirp')
const rimraf = require('./async/rimraf')

class Directory extends BaseFile {

    getSubFile(relativePath) {
        return new File(this.getSubPath(relativePath), this.rootDirPath)
    }

    getSubDir(relativePath) {
        return new Directory(this.getSubPath(relativePath), this.rootDirPath)
    }

    getSubPath(relativePath) {
        return path.join(this.path, relativePath)
    }

    async ensureExists() {
        try {
            await mkdirp(this.path)
        } catch (error) {
            throw new Error(`cannot create directory "${this.path}"\n${error.stack}`)
        }

        if (!await this.isReadableAndWritable())
            throw new Error(`directory "${this.path}" has no RW permissions`)
    }

    async delete() {
        await rimraf(this.path)
    }
}

module.exports = {Directory}