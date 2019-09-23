const {BaseFile} = require('./BaseFile')
const fs = require('./async/fs'), utf8 = 'utf8'
const crypto = require('crypto'), sha256 = 'sha256', hex = 'hex'

class File extends BaseFile {

    async getContent() {
        try {
            return await fs.readFile(this.path, utf8)
        } catch (error) {
            error.message = `reading the file "${this.path}"\n${error.message}`
            throw error
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

module.exports = {File}