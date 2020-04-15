const {DirectoryWatcher} = require('./DirectoryWatcher')
const {FilesFilter} = require('./FilesFilter')
const {GuestFile} = require('./GuestFile')
const {JS_FILE_EXT, JSON_FILE_EXT} = require('./fileExtensions')
const {NODE_MODULES_DIR_NAME} = require('./NodeModule')

class GuestDependencyFileWalker extends DirectoryWatcher {

    static build(nodeModule, guestDirPath, guestNativeDirPath) {
        const guestFilesFilter = new FilesFilter([NODE_MODULES_DIR_NAME], [JSON_FILE_EXT, JS_FILE_EXT])
        const fileFactory = file => new GuestFile(file.path, guestDirPath, guestNativeDirPath)
        return new GuestDependencyFileWalker(nodeModule.moduleDir.path, guestFilesFilter, fileFactory)
    }

    async getFiles() { // WHY THIS METHOD, getInitialFiles is already good!!!!!
        const files = await this.getInitialFiles()
        if (this.started) {
            this.stop()
        }
        return files

    }
}

module.exports = {GuestDependencyFileWalker}