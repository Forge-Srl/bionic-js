const {BaseFile} = require('./BaseFile')
const {File} = require('./File')
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')
const fs = require('./async/fs')
const rimraf = require('./async/rimraf')
const uuidv4 = require('uuid/v4')

class Directory extends BaseFile {

    static async getTemp() {
        return new Directory(os.tmpdir()).getSubDir(uuidv4())
    }

    static async runInTempDir(codeUsingTempDir) {
        const tempDir = await this.getTemp()
        await tempDir.delete()
        await tempDir.ensureExists()
        try {
            await codeUsingTempDir(tempDir)
        } catch (error) {
            throw error
        } finally {
            await tempDir.delete()
        }
    }

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
            error.message = `cannot create directory "${this.path}"\n${error.message}`
            throw error
        }

        if (!await this.isReadableAndWritable())
            throw new Error(`directory "${this.path}" has no RW permissions`)
    }

    async getFiles() {
        if (!await this.exists()) {
            throw new Error(`directory "${this.path}" doesn't exists`)
        }
        return (await fs.readdir(this.absolutePath, {withFileTypes: true}))
            .map(file => {
                if (file.isDirectory()) {
                    return this.getSubDir(file.name)
                } else if (file.isFile()) {
                    return this.getSubFile(file.name)
                }
                return null
            }).filter(file => file)
    }

    async cleanEmptyDirs(keepRoot = true) {
        if (!await this.exists()) {
            return true
        }

        const files = await this.getFiles()
        let empty = true
        for (const file of files) {
            if (file instanceof Directory) {
                const isChildDir = await file.cleanEmptyDirs(false)
                empty = isChildDir && empty
            } else {
                empty = false
            }
        }
        if (empty && !keepRoot) {
            await this.delete()
        }
        return empty
    }

    async delete() {
        await rimraf(this.path)
    }
}

module.exports = {Directory}