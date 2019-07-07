const {DirectoryWatcher} = require('./DirectoryWatcher')
const {FilesFilter} = require('./FilesFilter')
const {GuestFile} = require('./GuestFile')

class GuestDependencyFileWalker extends DirectoryWatcher {

    static build(nodeModule, guestDirPath) {
        const guestFilesFilter = new FilesFilter(['node_modules'], GuestFile.extensions)
        const fileFactory = file => new GuestFile(file.path, guestDirPath)
        return new GuestDependencyFileWalker(nodeModule.moduleDir.path, guestFilesFilter, fileFactory)
    }

    async getFiles() {
        const files = await this.getInitialFiles()
        if (this.started) {
            this.stop()
        }
        return files

    }
}

module.exports = {GuestDependencyFileWalker}