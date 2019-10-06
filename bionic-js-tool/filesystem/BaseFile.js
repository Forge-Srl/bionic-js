const path = require('path')
const fs = require('./async/fs')

class BaseFile {

    constructor(path, rootDirPath) {
        Object.assign(this, {path, rootDirPath})
    }

    get dir() {
        const {Directory} = require('./Directory')
        return new Directory(path.parse(this.path).dir, this.rootDirPath)
    }

    get name() {
        return path.parse(this.path).name
    }

    get ext() {
        return path.parse(this.path).ext
    }

    get absolutePath() {
        return path.resolve(this.path)
    }

    get relativePath() {
        return path.relative(this.rootDirPath, this.path)
    }

    composeNewPath(newRootDirPath, newName, newExtension) {
        return path.format({
            dir: path.resolve(newRootDirPath, path.dirname(this.relativePath)),
            name: newName !== undefined ? newName : this.name,
            ext: newExtension !== undefined ? newExtension : this.ext,
        })
    }

    isInsideDir(...dirPathSegments) {
        const nodeModulesDir = path.resolve(...dirPathSegments)
        const nodeModulesRelativePath = path.relative(nodeModulesDir, this.absolutePath)
        return nodeModulesRelativePath.match(/^\.\.[\/\\]/) === null
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