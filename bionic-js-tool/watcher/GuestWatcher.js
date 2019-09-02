const {DirectoryWatcher} = require('./DirectoryWatcher')
const {FilesFilter} = require('./FilesFilter')
const {GuestFile, JSON_FILE_EXT, JS_FILE_EXT} = require('./GuestFile')
const {NodeModule} = require('./NodeModule')
const {GuestDependencyFileWalker} = require('./GuestDependencyFileWalker')

class GuestWatcher extends DirectoryWatcher {

    static build(config) {
        const guestFilesFilter = new FilesFilter(config.guestIgnores, [JSON_FILE_EXT, JS_FILE_EXT])
        return new GuestWatcher(config.guestDir, guestFilesFilter, file => GuestFile.fromFile(file))
    }

    async getDependenciesFiles() {
        const dependencies = await NodeModule.fromModulePath(this.directory).getDependencies()
        return (await Promise.all(dependencies.map(dep => GuestDependencyFileWalker.build(dep, this.directory).getFiles()))).flat()
    }

    async getInitialFiles() {
        return (await Promise.all([super.getInitialFiles(), this.getDependenciesFiles()])).flat()
    }
}

module.exports = {GuestWatcher}