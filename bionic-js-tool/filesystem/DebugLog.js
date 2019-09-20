class DebugLog {

    info(message) {
        console.info(message)
    }

    error(error) {
        throw error
    }
}

module.exports = {DebugLog}