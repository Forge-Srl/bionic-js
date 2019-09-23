const {File} = require('./File')
const {NODE_MODULES_DIR_NAME} = require('./NodeModule')
const JS_FILE_EXT = '.js'
const JSON_FILE_EXT = '.json'

class GuestFile extends File {

    static fromFile(file) {
        return new GuestFile(file.path, file.rootDirPath)
    }

    constructor(path, guestDirPath) {
        super(path, guestDirPath)
    }

    get isExportable() {
        if (this.ext !== JS_FILE_EXT)
            return false

        return !this.isInsideDir(this.rootDirPath, NODE_MODULES_DIR_NAME)
    }
}

module.exports = {GuestFile, JS_FILE_EXT, JSON_FILE_EXT}