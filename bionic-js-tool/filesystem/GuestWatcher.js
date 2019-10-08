const {DirectoryWatcher} = require('./DirectoryWatcher')
const {FilesFilter} = require('./FilesFilter')
const {GuestFile, JSON_FILE_EXT, JS_FILE_EXT} = require('./GuestFile')
const {NodeModule} = require('./NodeModule')
const {GuestDependencyFileWalker} = require('./GuestDependencyFileWalker')

class GuestWatcher extends DirectoryWatcher {

    static build(config) {
        const guestFilesFilter = new FilesFilter(config.guestIgnores, [JSON_FILE_EXT, JS_FILE_EXT])
        return new GuestWatcher(config.guestDir, guestFilesFilter, config.guestNativeDir)
    }

    constructor(rootDir, filesFilter, guestNativeDir) {
        super(rootDir, filesFilter, file => GuestFile.fromFile(file, guestNativeDir))
        Object.assign(this, {guestNativeDir})
    }

    async getDependenciesFiles() {
        const depModules = await NodeModule.fromModulePath(this.directory).getDependencies()
        const depFilesPromises = depModules.map(depModule => GuestDependencyFileWalker.build(depModule, this.directory, this.guestNativeDir).getFiles())
        return (await Promise.all(depFilesPromises)).flat()
    }

    async getInitialFiles() {
        const guestFiles = (await Promise.all([super.getInitialFiles(), this.getDependenciesFiles()])).flat()
        return [...new Map(guestFiles.map(guestFile => [guestFile.absolutePath, guestFile])).values()]
    }
}

module.exports = {GuestWatcher}