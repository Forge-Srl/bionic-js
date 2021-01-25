const {SourceFile} = require('./SourceFile')

class StandardSourceFile extends SourceFile {

    async getSourceFileContent() {
        const guestFile = this.annotatedFile.guestFile
        try {
            return await guestFile.getCodeContent()
        } catch (error) {
            error.message = `reading guest code file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {StandardSourceFile}