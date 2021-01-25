const {Configuration} = require('./Configuration')
const {GuestBundlesConfiguration} = require('./GuestBundlesConfiguration')
const {XcodeHostProjectConfiguration} = require('./XcodeHostProjectConfiguration')
const {JavaHostProjectConfiguration} = require('./JavaHostProjectConfiguration')
const {posixPath} = require('../../filesystem/posixPath')

class BjsConfiguration extends Configuration {

    static fromPath(path) {
        let configObj
        try {
            configObj = require(path)
        } catch (error) {
            error.message = `parsing the config file "${path}"\n${error.message}`
            throw error
        }
        return new BjsConfiguration(configObj, `config file "${path}"`)
    }

    constructor(configObj, locator) {
        super(configObj, locator, ['outputMode'], ['projectName', 'guestDirPath', 'guestBundles', 'hostProjects'])
    }

    get projectName() {
        return this.configObj.projectName
    }

    get guestDirPath() {
        return posixPath(this.configObj.guestDirPath)
    }

    get guestBundles() {
        if (!this._guestBundles) {
            const guestBundles = this.configObj.guestBundles
            this._guestBundles = GuestBundlesConfiguration.fromObj(guestBundles, `${this.locator} -> "guestBundles"`)
        }
        return this._guestBundles
    }

    get outputMode() {
        const outputMode = this.configObj.outputMode
        const allowedValues = ['development', 'production', 'none']
        if (!allowedValues.includes(outputMode)) {
            throw new Error(`${this.locator} -> "outputMode" only supports values: [${allowedValues.join(', ')}]`)
        }
        return outputMode
    }

    get hostProjects() {
        if (!this._hostProjects) {
            const hostTargets = this.configObj.hostProjects
            if (!Array.isArray(hostTargets)) {
                throw new Error(`${this.locator} -> "hostProjects" is not an array`)
            }
            this._hostProjects = hostTargets.map((targetObj, index) => {
                const projectLocator = `${this.locator} -> "hostProjects[${index}]"`
                if (!targetObj.language) {
                    throw new Error(`${projectLocator} -> "language" is missing`)
                }
                const language = targetObj.language.toLowerCase()
                if (language === 'swift') {
                    return XcodeHostProjectConfiguration.fromObj(targetObj, projectLocator)
                } else if (language === 'java') {
                    return JavaHostProjectConfiguration.fromObj(targetObj, projectLocator, this.projectName)
                } else {
                    throw new Error(`${projectLocator} -> "language" -> "${targetObj.language}" is not supported`)
                }
            })
        }
        return this._hostProjects
    }
}

module.exports = {BjsConfiguration}