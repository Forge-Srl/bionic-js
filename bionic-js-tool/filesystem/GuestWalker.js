const {FilesFilter} = require('./FilesFilter')
const {File} = require('./File')
const {GuestFile} = require('./GuestFile')
const {Webpack} = require('./Webpack')
const WebpackModuleClassName = 'NormalModule'

class GuestWalker {

    static build(config) {
        const entryPaths = {}, guestFilesFilters = {}
        for (const guestBundle of config.guestBundles) {
            entryPaths[guestBundle.bundleName] = guestBundle.entryPaths
            guestFilesFilters[guestBundle.bundleName] = guestBundle.ignoreExport
                ? new FilesFilter(guestBundle.ignoreExport)
                : null
        }
        return new GuestWalker(config.guestDirPath, entryPaths, guestFilesFilters)
    }

    constructor(guestDirPath, entryPaths, guestFilesFilters) {
        Object.assign(this, {guestDirPath, entryPaths, guestFilesFilters})
    }

    get webpack() {
        if (!this._webpack) {
            this._webpack = new Webpack({
                mode: 'development',
                context: this.guestDirPath,
                entry: this.entryPaths,
                output: {
                    path: '/dev/null',
                    filename: '[name].bundle.js',
                },
            }, Webpack.getVirtualFs())
        }
        return this._webpack
    }

    isFileToExport(file, chunkName) {
        const filesFilter = this.guestFilesFilters[chunkName]
        if (filesFilter) {
            return !filesFilter.isToFilter(file)
        }
        return true
    }

    async getFiles() {
        const stats = await this.webpack.compile()
        return [...stats.compilation.modules]
            .filter(module => module.constructor.name === WebpackModuleClassName)
            .map(module => {
                const file = new File(module.resource, this.guestDirPath)
                const chunks = stats.compilation.chunkGraph.getModuleChunks(module)
                    .map(chunk => chunk.name)
                    .filter(chunkName => this.isFileToExport(file, chunkName))
                    .sort()
                return {file, chunks}
            })
            .filter(module => module.chunks.length)
            .map(module => GuestFile.fromFile(module.file, module.chunks))
            .sort((a, b) => a.path > b.path ? 1 : a.path < b.path ? -1 : 0)
    }
}

module.exports = {GuestWalker}