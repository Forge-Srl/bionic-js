class DebugLog {

    constructor() {
        Object.assign(this, {infoLog: '', warningLog: '', errorLog: ''})
    }

    info(message) {
        this.infoLog += message + '\n'
        process.stdout.write(message + '\n')
    }

    warning(message) {
        this.warningLog += message + '\n'
        process.stdout.write(`\x1b[33m${message}\x1b[0m\n`)
    }

    error(message) {
        message = message.stack ? message.stack : message
        this.errorLog += message + '\n'
        process.stdout.write(`\x1b[31m${message}\x1b[0m\n`)
    }
}

module.exports = {DebugLog}