const HostGenerator = require('./HostGenerator')

class HostGeneratorWithClass extends HostGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {schema, classSchema})
    }
}

module.exports = HostGeneratorWithClass