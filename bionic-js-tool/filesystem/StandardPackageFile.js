const {PackageFile} = require('./PackageFile')

class StandardPackageFile extends PackageFile {

    async getPackageContent() {
        const guestFile = this.exportedFile.guestFile
        try {
            return await guestFile.getContent()
        } catch (error) {
            error.message = `reading guest code file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {StandardPackageFile}