const {PackageFile} = require('./PackageFile')

class NativePackageFile extends PackageFile {

    async getPackageContent() {
        const nativePackageClassGenerator = this.exportedFile.schema.generator.forWrapping().javascript
        try {
            return nativePackageClassGenerator.getSource()
        } catch (error) {
            const guestFile = this.exportedFile.guestFile
            error.message = `generating native package code from guest file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {NativePackageFile}