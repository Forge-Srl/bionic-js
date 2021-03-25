const {File} = require('../File')

class BjsConfigurationFile extends File {

    constructor(absolutePath) {
        super(absolutePath)
    }

}

module.exports = {BjsConfigurationFile}