const {GeneratorFactory} = require('./GeneratorFactory')

class MultiTargetGeneratorFactory extends GeneratorFactory {

    get swift() {
        this.language = 'Swift'
        return this
    }

    get java() {
        this.language = 'Java'
        return this
    }

    forHosting(...params) {
        this.target = 'Host'
        return this.getGenerator(...params)
    }

    forWrapping(...params) {
        this.target = 'Wrapper'
        return this.getGenerator(...params)
    }
}

module.exports = {MultiTargetGeneratorFactory}