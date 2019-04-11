class StringBuilder {

    constructor() {
        this.string = ''
    }

    append(token) {
        this.string += token
    }

    getString() {
        return this.string
    }
}

module.exports = StringBuilder