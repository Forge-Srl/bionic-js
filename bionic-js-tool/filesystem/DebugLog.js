class DebugLog {

    info(message) {
        process.stdout.write(message + '\n')
    }

    error(error) {
        throw error
    }
}

module.exports = {DebugLog}