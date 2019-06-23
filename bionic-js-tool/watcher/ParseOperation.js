const {Operation} = require('./Operation')

class ParseOperation extends Operation {

    constructor(processor, guestFile) {
        super(processor)
        Object.assign(this, {guestFile})
    }

    async do() {
        const schema = {}
        this.processor.addGuestSchema(guestFile, schema)
    }
}

module.exports = {Operation}