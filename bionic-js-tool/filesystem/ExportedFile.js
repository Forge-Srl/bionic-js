class ExportedFile {

    constructor(guestFile, schema) {
        Object.assign(this, {guestFile, schema})
    }

    get exportsClass() {
        return !!this.schema
    }

    get exportsNativeClass() {
        return this.exportsClass && this.schema.isNative
    }

    resolveClassType(nativeClassesMap) {
        return new ExportedFile(this.guestFile, this.schema ? this.schema.resolveClassType(nativeClassesMap) : null)
    }
}

module.exports = {ExportedFile}