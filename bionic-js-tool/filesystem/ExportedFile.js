class ExportedFile {

    constructor(guestFile, schema) {
        Object.assign(this, {guestFile, schema})
    }

    get requiresHostFile() {
        return !!this.schema
    }

    get requiresNativePackageFile() {
        return this.requiresHostFile && this.guestFile.isNative
    }
}

module.exports = {ExportedFile}