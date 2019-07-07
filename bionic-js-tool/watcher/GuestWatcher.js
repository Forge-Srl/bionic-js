const {DirectoryWatcher} = require('./DirectoryWatcher')
const {NodeModule} = require('./NodeModule')
const {FilesFilter} = require('./FilesFilter')
const {GuestFile} = require('./GuestFile')
const {GuestDependencyFileWalker} = require('./GuestDependencyFileWalker')

class GuestWatcher extends DirectoryWatcher {

    static build(config) {
        const guestFilesFilter = new FilesFilter(config.guestIgnores, GuestFile.extensions)
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