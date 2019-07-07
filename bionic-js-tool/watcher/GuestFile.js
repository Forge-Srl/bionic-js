const {File} = require('./File')

class GuestFile extends File {

    static fromFile(file) {
        return new GuestFile(file.path, file.rootDirPath)
    }

    static get extensions() {
        return ['.js', '.json']
    }

    constructor(path, guestDirPath) {
        super(path, guestDirPath)
    }
}

module.exports = {GuestFile}