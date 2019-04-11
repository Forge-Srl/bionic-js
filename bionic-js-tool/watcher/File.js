const Directory = require('./Directory')
const path = require('path')
const fs = require('./async/fs'), utf8 = 'utf8'
const crypto = require('crypto'), sha256 = 'sha256', hex = 'hex'

class File {

    get dir() {
        return new Directory(path.parse(this.path).dir)
    }

    get name() {
        return path.parse(this.path).name
    }

    get ext() {
        return path.parse(this.path).ext
    }

    get relativePath() {
        return path.relative(this.rootDirPath, this.path)
    }


    constructor(path, rootDirPath) {
        Object.assign(this, {path, rootDirPath})
    }


    composeNewPath(newRootDirPath, newExtension) {
        return path.format({
            dir: path.resolve(newRootDirPath, path.dirname(this.relativePath)),
            name: this.name,
            ext: newExtension !== undefined ? newExtension : this.ext
        })
    }

    async getContent() {
        try {
            return await fs.readFile(this.path, utf8)
        } catch(error){
            throw new Error(`Error reading file "${this.path}"\n${error.stack}`)
        }
    }

    async setContent(content) {
        await fs.writeFile(this.path, content, utf8)
    }

    async getHash() {
        const fileContent = await this.getContent()
        const hash = crypto.createHash(sha256)
        return hash.update(fileContent).digest(hex)
    }
}

module.exports = File