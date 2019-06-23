const {Watcher} = require('./Watcher')

class CodeWatcher extends Watcher {

    constructor(rootDir, filesFilter, fileFactory, persistent) {
        super(rootDir)
        Object.assign(this, {filesFilter, fileFactory, persistent})

        this.ready = false
        this.initialFiles = []
        this.initialFilesPromises = []
    }

    fileDidAdd(file) {
        if (this.filesFilter && this.filesFilter.isToFilter(file))
            return

        if (!this.ready) {
            this.initialFiles.push(this.fileFactory ? this.fileFactory(file) : file)
        } else if (this.persistent) {
            console.log(`post ADD: ${file.path}`)
        }
    }

    didReady() {
        if (!this.ready) {
            this.ready = true
            for (const promise of this.initialFilesPromises) {
                promise.resolve(this.initialFiles)
            }
        }
    }

    async getInitialFiles() {
        return await new Promise((resolve, reject) => {
            if (this.ready) {
                resolve(this.initialFiles)
            }
            this.initialFilesPromises.push({resolve, reject})
            if (!this.started) {
                this.start()
            }
        })
    }
}

module.exports = {CodeWatcher}