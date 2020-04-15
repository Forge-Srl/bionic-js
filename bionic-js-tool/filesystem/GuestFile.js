const {File} = require('./File')
const {NODE_MODULES_DIR_NAME} = require('./NodeModule')
const {JS_FILE_EXT, JSON_FILE_EXT} = require('./fileExtensions')

class GuestFile extends File {

    static fromFile(file, guestNativeDirPath) {
        return new GuestFile(file.path, file.rootDirPath, guestNativeDirPath)
    }

    constructor(path, guestDirPath, guestNativeDirPath) {
        super(path, guestDirPath)
        Object.assign(this, {guestNativeDirPath})
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

    get isNative() {
        if (!this._isNative) {
            this._isNative = this.isExportable && this.isInsideDir(this.guestNativeDirPath)
        }
        return this._isNative
    }
}

module.exports = {GuestFile, JS_FILE_EXT, JSON_FILE_EXT}