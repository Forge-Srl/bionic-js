const {Watcher} = require('./Watcher')

class DirectoryWatcher extends Watcher {

    constructor(dirPath, filesFilter, fileFactory) {
        super(dirPath)
        Object.assign(this, {filesFilter, fileFactory})

        this.waitingForInitialFiles = true
        this.initialFiles = []
        this.initialFilesPromises = []
    }

    fileDidAdd(file) {
        if (this.filesFilter && this.filesFilter.isToFilter(file))
            return

        if (this.waitingForInitialFiles) {
            this.initialFiles.push(this.fileFactory ? this.fileFactory(file) : file)
        } else if (this.persistent) {
            console.log(`post ADD: ${file.path}`)
        }
    }

    didReady() {
        if (this.waitingForInitialFiles) {
            this.waitingForInitialFiles = false
            for (const promise of this.initialFilesPromises) {
                promise.resolve(this.initialFiles)
            }
        }
    }

    async getInitialFiles() {
        const initialFiles = await new Promise((resolve, reject) => {
            if (!this.waitingForInitialFiles) {
                resolve(this.initialFiles)
            }
            this.initialFilesPromises.push({resolve, reject})
            if (!this.started) {
                this.start()
            }
        })
        this.stop()
        return initialFiles
    }
}

module.exports = {DirectoryWatcher}