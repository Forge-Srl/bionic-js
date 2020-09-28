const {FileWalker} = require('./FileWalker')
const {FilesFilter} = require('./FilesFilter')
const {GuestFile} = require('./GuestFile')
const {JS_FILE_EXT, JSON_FILE_EXT} = require('./fileExtensions')
const {NODE_MODULES_DIR_NAME} = require('./NodeModule')

class GuestDependencyWalker extends FileWalker {

    static build(nodeModule, guestDirPath) {
        const guestFilesFilter = new FilesFilter([NODE_MODULES_DIR_NAME], [JSON_FILE_EXT, JS_FILE_EXT])
        const fileFactory = file => new GuestFile(file.path, guestDirPath)
        return new GuestDependencyWalker(nodeModule.moduleDir.path, guestFilesFilter, fileFactory)
    }
}

module.exports = {GuestDependencyWalker}