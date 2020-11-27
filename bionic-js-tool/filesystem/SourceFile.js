class SourceFile {

    static build(annotatedFile) {
        const {StandardSourceFile} = require('./StandardSourceFile')
        const {NativeSourceFile} = require('./NativeSourceFile')
        const SourceFileClass = annotatedFile.exportsNativeClass ? NativeSourceFile : StandardSourceFile
        return new SourceFileClass(annotatedFile)
    }

    constructor(annotatedFile) {
        Object.assign(this, {annotatedFile})
    }

    get path() {
        return this.annotatedFile.guestFile.path
    }

    async getSourceFileContent() {
        throw new Error('method "getSourceFileContent" must be implemented')
    }
}

module.exports = {SourceFile}