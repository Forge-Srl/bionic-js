const {Operation} = require('./Operation')

class CreatePackageOperation extends Operation {

    constructor(processor, packageFile) {
        super(processor)
        Object.assign(this, {packageFile})
    }

    async do() {
        const targetFile = this.packageFile.target
        this.processor.addSchema(guestFile, schema)
    }
}

module.exports = {Operation}