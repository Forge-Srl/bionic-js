const {GeneratorFactory} = require('../generation/factory/GeneratorFactory')

class Generable {

    get generator() {
        return new GeneratorFactory(this)
    }

    get dependingTypes() {
        return []
    }
}

module.exports = {Generable}