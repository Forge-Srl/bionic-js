const {BjsConfigurationGenerator} = require('../generation/configuration/BjsConfigurationGenerator')
const {BjsConfigurationFile} = require('../filesystem/configuration/BjsConfigurationFile')

class BjsInit {

    constructor(log) {
        Object.assign(this, {log})
    }

    async init(configurationAbsolutePath, minimalConfiguration) {
        const configuration = new BjsConfigurationGenerator(minimalConfiguration).getCode()
        const configFile = new BjsConfigurationFile(configurationAbsolutePath)

        this.log.info(`\nThe following configuration will be written at ${configurationAbsolutePath}:\n`)
        this.log.info(configuration)
        this.log.info('\n')
        await configFile.setContent(configuration)
    }
}

module.exports = {BjsInit}