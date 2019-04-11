const chokidar = require('chokidar')
const os = require('os')
const File = require('./File')
const Directory = require('./Directory')

class Watcher {

    constructor(directory) {
        Object.assign(this, {directory})
    }

    get started() {
        return this.watchProcess !== undefined
    }

    get options() {
        const options = {
            ignored: /(^|[\/\\])\../ /* Ignore paths containing .files or .dirs */
        }

        if (os.platform() === 'win32') {
            options.usePolling = true
            /* On windows, without polling, is not possible to modify watched folders */
            options.interval = 2000
            /* Polling big directories is computational expensive */
        }
        return options
    }

    getFile(filePath) {
        return new File(filePath, this.directory)
    }

    start() {
        this.watchProcess = chokidar.watch(this.directory, this.options)
            .on('add', path => this.fileDidAdd(new File(path, this.directory)))
            .on('change', path => this.fileDidChange(new File(path, this.directory)))
            .on('unlink', path => this.fileDidUnlink(new File(path, this.directory)))
            .on('addDir', path => this.dirDidAdd(new Directory(path, this.directory)))
            .on('unlinkDir', path => this.dirDidUnlink(new Directory(path, this.directory)))
            .on('ready', () => this.didReady())
            .on('error', error => this.didReceiveError(error))
    }

    stop() {
        this.watchProcess.close()
    }


    fileDidAdd(file) {
    }

    fileDidChange(file) {
    }

    fileDidUnlink(file) {
    }

    dirDidAdd(dir) {
    }

    dirDidUnlink(dir) {
    }

    didReady() {
    }

    didReceiveError(error) {
    }
}

module.exports = Watcher