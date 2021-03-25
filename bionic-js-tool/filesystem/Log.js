const colors = require('ansi-colors')

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
        this.writeInfo(colors.yellow(message))
    }

    error(message) {
        message = message.stack ? message.stack : message
        this.errorLog += message
        this.writeError(colors.red(message))
    }
}

module.exports = {Log}