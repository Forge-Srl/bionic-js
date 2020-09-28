const {FileWalker} = require('./FileWalker')
const {FilesFilter} = require('./FilesFilter')
const {GuestFile} = require('./GuestFile')
const {JS_FILE_EXT, JSON_FILE_EXT} = require('./fileExtensions')
const {NodeModule} = require('./NodeModule')
const {GuestDependencyWalker} = require('./GuestDependencyWalker')

class GuestWalker extends FileWalker {

    static build(config) {
        const guestFilesFilter = new FilesFilter(config.guestIgnores, [JSON_FILE_EXT, JS_FILE_EXT])
        return new GuestWalker(config.guestDirPath, guestFilesFilter)
    }

    constructor(dirPath, filesFilter) {
        super(dirPath, filesFilter, file => GuestFile.fromFile(file))
    }

    async getDependenciesFiles() {
        const depModules = await NodeModule.fromModulePath(this.dirPath).getDependencies()
        const depFilesPromises = depModules.map(depModule => GuestDependencyWalker.build(depModule, this.dirPath).getFiles())
        return (await Promise.all(depFilesPromises)).flat()
    }

    async getFiles() {
        const guestFiles = (await Promise.all([super.getFiles(), this.getDependenciesFiles()])).flat()
        return [...new Map(guestFiles.map(guestFile => [guestFile.absolutePath, guestFile])).values()]
    }
}

module.exports = {GuestWalker}