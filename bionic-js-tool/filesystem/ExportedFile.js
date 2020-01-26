class ExportedFile {

    constructor(guestFile, schema) {
        Object.assign(this, {guestFile, schema})
    }

    get hasSchema() {
        return !!this.schema
    }

    get isNative() {
        return this.guestFile.isNative
    }

    get isHosted() {
        return this.hasSchema && !this.isNative
    }
}

module.exports = {ExportedFile}