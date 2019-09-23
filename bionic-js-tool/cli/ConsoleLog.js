class ConsoleLog {

    info(message) {
        process.stdout.write(`${message}\n`)
    }

    error(error) {
        process.stdout.write(`\x1b[31m${error}\x1b[0m\n`)
    }
}

module.exports = {ConsoleLog}