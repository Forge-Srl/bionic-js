const {SourceFile} = require('./SourceFile')

class NativeSourceFile extends SourceFile {

    async getSourceFileContent() {
        const nativePackageClassGenerator = this.annotatedFile.schema.generator.forWrapping().javascript
        try {
            return nativePackageClassGenerator.getSource()
        } catch (error) {
            const guestFile = this.annotatedFile.guestFile
            error.message = `generating source code from guest file "${guestFile.relativePath}"\n${error.message}`
            throw error
        }
    }
}

module.exports = {NativeSourceFile}