class Log {

    constructor(debug) {
        Object.assign(this, {infoLog: '', warningLog: '', errorLog: ''})
        this.writeInfo = debug ? () => null : message => process.stdout.write(message)
        this.writeError = debug ? () => null : message => process.stderr.write(message)
    }

    get processExitCode() {
        return this.errorLog === '' ? 0 : 1
    }

    info(message) {
        this.infoLog += message
        this.writeInfo(message)
    }

    warning(message) {
        this.warningLog += message
        this.writeInfo(`\x1b[33m${message}\x1b[0m`)
    }

    error(message) {
        message = message.stack ? message.stack : message
        this.errorLog += message
        this.writeError(`\x1b[31m${message}\x1b[0m`)
    }
}

module.exports = {Log}