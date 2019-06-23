const {JsonSerializable} = require('../JsonSerializable')
const {MultiTargetGeneratorFactory} = require('../generation/factory/MultiTargetGeneratorFactory')

class MultiTargetGenerable extends JsonSerializable {

    get generator() {
        return new MultiTargetGeneratorFactory(this)
    }
}

module.exports = {MultiTargetGenerable}