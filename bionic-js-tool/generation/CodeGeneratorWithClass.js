const CodeGenerator = require('./CodeGenerator')

class CodeGeneratorWithClass extends CodeGenerator {

    constructor(schema, classSchema) {
        super(schema)
        Object.assign(this, {classSchema})
    }
}

module.exports = CodeGeneratorWithClass