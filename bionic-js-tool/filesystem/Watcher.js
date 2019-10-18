const chokidar = require('chokidar')
const os = require('os')
const {File} = require('./File')
const {Directory} = require('./Directory')

class Watcher {

    constructor(dirPath) {
        Object.assign(this, {dirPath})
    }

    get started() {
        return this.watchProcess !== undefined
    }

    get options() {
        const options = {
            ignored: /(^|[\/\\])\../, /* Ignore paths containing .files or .dirs */
        }

        if (os.platform() === 'win32') {
            options.usePolling = true
            /* On windows, without polling, is not possible to modify watched folders */
            options.interval = 2000
            /* Polling big directories is computational expensive */
        }
        return options
    }

    start() {
        this.watchProcess = chokidar.watch(this.dirPath, this.options)
            .on('add', path => this.fileDidAdd(new File(path, this.dirPath)))
            .on('change', path => this.fileDidChange(new File(path, this.dirPath)))
            .on('unlink', path => this.fileDidUnlink(new File(path, this.dirPath)))
            .on('addDir', path => this.dirDidAdd(new Directory(path, this.dirPath)))
            .on('unlinkDir', path => this.dirDidUnlink(new Directory(path, this.dirPath)))
            .on('ready', () => this.didReady())
            .on('error', error => this.didReceiveError(error))
    }

    stop() {
        this.watchProcess.close()
        this.watchProcess = undefined
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

module.exports = {Watcher}