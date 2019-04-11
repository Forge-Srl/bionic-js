const JsonSerializable = require('../JsonSerializable')

class SchemaWithGenerators extends JsonSerializable {

    getHostGeneratorClass(directory, classPrefix) {
        throw new Error('method "getHostGeneratorClass" must be implemented')
    }

    getJavaGenerator(...params) {
        return new (this.getHostGeneratorClass('java', 'Java'))(this, ...params)
    }

    getSwiftGenerator(...params) {
        return new (this.getHostGeneratorClass('swift', 'Swift'))(this, ...params)
    }
}

module.exports = SchemaWithGenerators