const {GeneratorFactory} = require('../generation/factory/GeneratorFactory')

class Generable {

    get generator() {
        return new GeneratorFactory(this)
    }
}

module.exports = {Generable}