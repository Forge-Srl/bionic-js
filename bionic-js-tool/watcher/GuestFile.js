const {File} = require('./File')
const {NODE_MODULES_DIR_NAME} = require('./NodeModule')
const path = require('path')
const JS_FILE_EXT = '.js'
const JSON_FILE_EXT = '.json'

class GuestFile extends File {

    static fromFile(file) {
        return new GuestFile(file.path, file.rootDirPath)
    }

    constructor(path, guestDirPath) {
        super(path, guestDirPath)
    }

    get isHostExportable() {
        if (this.ext !== JS_FILE_EXT)
            return false

        const nodeModulesDir = path.resolve(this.rootDirPath, NODE_MODULES_DIR_NAME)
        const nodeModulesRelativePath = path.relative(nodeModulesDir, this.absolutePath)

        return nodeModulesRelativePath.match(/^\.\.[\/\\]/) !== null
    }
}

module.exports = {GuestFile, JS_FILE_EXT, JSON_FILE_EXT}