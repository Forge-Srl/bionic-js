const {BaseFile} = require('./BaseFile')
const fs = require('./async/fs'), utf8 = 'utf8'
const crypto = require('crypto'), sha256 = 'sha256', hex = 'hex'

class File extends BaseFile {

    async getCodeContent() {
        const tracingError = new Error(`reading the file "${this.path}"`)
        try {
            return (await fs.readFile(this.path, utf8)).replace(/\r/g, '')
        } catch (error) {
            tracingError.message = `${tracingError.message}\n${error.message}`
            throw tracingError
        }
    }

    async setContent(content) {
        await fs.writeFile(this.path, content, utf8)
    }

    async getHash() {
        const fileContent = await this.getCodeContent()
        const hash = crypto.createHash(sha256)
        return hash.update(fileContent).digest(hex)
    }

    async delete() {
        if (await this.exists()) {
            await fs.unlink(this.path)
            return true
        }
        return false
    }
}

module.exports = {File}