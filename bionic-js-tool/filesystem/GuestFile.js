const {File} = require('./File')
const {JS_FILE_EXT, MJS_FILE_EXT} = require('./fileExtensions')

class GuestFile extends File {

    static fromFile(file, bundles) {
        return new GuestFile(file.path, file.rootDirPath, bundles)
    }

    constructor(path, guestDirPath, bundles) {
        super(path, guestDirPath)
        Object.assign(this, {bundles})
    }

    get isJavascript() {
        if (!this._isJavascript) {
            this._isJavascript = [JS_FILE_EXT, MJS_FILE_EXT].includes(this.ext)
        }
        return this._isJavascript
    }
}

module.exports = {GuestFile}