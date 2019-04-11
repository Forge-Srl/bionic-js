const mkdirp = require('./async/mkdirp')
const rimraf = require('./async/rimraf')
const fs = require('./async/fs')

class Directory {

    constructor(path) {
        Object.assign(this, {path})
    }

    async ensureExists() {
        try {
            await mkdirp(this.path)
        } catch (error) {
            throw new Error(`Cannot create directory "${this.path}"\n${error.stack}`)
        }

        if (!await this.isReadableAndWriteable())
            throw new Error(`Directory "${this.path}" has no RW permissions`)
    }

    async isReadableAndWriteable() {
        try {
            await fs.access(this.path, fs.orig.constants.R_OK | fs.orig.constants.W_OK)
            return true
        } catch (error) {
            return false
        }
    }

    async delete() {
        await rimraf(this.path)
    }
}

module.exports = Directory