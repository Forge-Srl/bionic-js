const File = require('./File')

class GuestFile extends File {

    constructor(path, guestDirPath) {
        super(path, guestDirPath)
    }

    static fromFile(file) {
        return new GuestFile(file.path, file.rootDirPath)
    }

    static get extensions() {
        return ['.js', '.json']
    }
}

module.exports = GuestFile