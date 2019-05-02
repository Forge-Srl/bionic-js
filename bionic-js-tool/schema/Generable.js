const JsonSerializable = require('../JsonSerializable')
const GeneratorFactory = require('../generation/factory/GeneratorFactory')

class Generable extends JsonSerializable {

    get generator() {
        return new GeneratorFactory(this)
    }
}

module.exports = Generable