const {File} = require('./File')
const {NODE_MODULES_DIR_NAME} = require('./NodeModule')
const {JS_FILE_EXT, JSON_FILE_EXT} = require('./fileExtensions')

class GuestFile extends File {

    static fromFile(file) {
        return new GuestFile(file.path, file.rootDirPath)
    }

    constructor(path, guestDirPath) {
        super(path, guestDirPath)
    }

    get isJavascript() {
        if (!this._isJavascript) {
            this._isJavascript = this.ext === JS_FILE_EXT
        }
        return this._isJavascript
    }

    get isExportable() {
        if (!this._isExportable) {
            this._isExportable = this.isJavascript ? !this.isInsideDir(this.rootDirPath, NODE_MODULES_DIR_NAME) : false
        }
        return this._isExportable
    }
}

module.exports = {GuestFile, JS_FILE_EXT, JSON_FILE_EXT}