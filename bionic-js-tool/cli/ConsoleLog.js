class ConsoleLog {

    info(message) {
        process.stdout.write(`${message}\n`)
    }

    warning(message) {
        process.stdout.write(`\x1b[33m${message}\x1b[0m\n`)
    }

    error(message) {
        process.stdout.write(`\x1b[31m${message}\x1b[0m\n`)
    }
}

module.exports = {ConsoleLog}