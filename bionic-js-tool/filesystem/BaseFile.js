const path = require('path')
const fs = require('./async/fs')
const {posixPath} = require('./posixPath')

class BaseFile {

    constructor(filePath, rootDirPath = path.parse(process.cwd()).root) {
        Object.assign(this, {path: posixPath(filePath), rootDirPath: posixPath(rootDirPath)})
    }

    get asFile() {
        const {File} = require('./File')
        return new File(this.path, this.rootDirPath)
    }

    get asDir() {
        const {Directory} = require('./Directory')
        return new Directory(this.path, this.rootDirPath)
    }

    get dir() {
        const {Directory} = require('./Directory')
        return new Directory(posixPath(path.parse(this.path).dir), this.rootDirPath)
    }

    get base() {
        return path.parse(this.path).base
    }

    get name() {
        return path.parse(this.path).name
    }

    get ext() {
        return path.parse(this.path).ext
    }

    get absolutePath() {
        return posixPath(path.resolve(this.path))
    }

    get relativePath() {
        return posixPath(path.relative(this.rootDirPath, this.path))
    }

    composeNewPath(newRootDirPath, newName, newExtension) {
        return posixPath(path.format({
            dir: path.resolve(newRootDirPath, path.dirname(this.relativePath)),
            name: newName !== undefined ? newName : this.name,
            ext: newExtension !== undefined ? newExtension : this.ext,
        }))
    }

    isInsideDir(...dirPathSegments) {
        const dirPath = path.resolve(...dirPathSegments)
        const dirRelativePath = path.relative(dirPath, this.absolutePath)
        return dirRelativePath.match(/^\.\.[\/\\]/) === null
    }

    setRootDirPath(rootDirPath) {
        this.rootDirPath = posixPath(rootDirPath)
        return this
    }

    async exists() {
        return this.checkAccess(fs.orig.constants.F_OK)
    }

    async isReadable() {
        return this.checkAccess(fs.orig.constants.F_OK | fs.orig.constants.R_OK)
    }

    async isReadableAndWritable() {
        return this.checkAccess(fs.orig.constants.F_OK | fs.orig.constants.R_OK | fs.orig.constants.W_OK)
    }

    async checkAccess(accessMode) {
        try {
            await fs.access(this.path, accessMode)
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = {BaseFile}