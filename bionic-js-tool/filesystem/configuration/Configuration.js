const {NODE_MODULES_DIR_NAME, PACKAGE_JSON_LOCK_FILE_NAME} = require('../NodeModule')
const {XcodeHostTargetConfiguration} = require('./XcodeHostTargetConfiguration')

class Configuration {

    static fromPath(path) {
        let configObj
        try {
            configObj = require(path)
        } catch (error) {
            error.message = `parsing the config file "${path}"\n${error.message}`
            throw error
        }
        const config = new Configuration(configObj, path)
        config.checkMandatoryProps('guestDirPath', 'hostTargets')
        return config
    }

    constructor(configObj, path) {
        this.configObj = configObj
        this.path = path
    }

    get errorLocationString() {
        return `config file "${this.path}" ->`
    }

    get guestDirPath() {
        return this.configObj.guestDirPath
    }

    get hostTargets() {
        if (!this._hostTargets) {
            const hostTargets = this.configObj.hostTargets
            if (!Array.isArray(hostTargets)) {
                throw new Error(`${this.errorLocationString} "hostTargets" is not an array`)
            }
            this._hostTargets = hostTargets.map(targetObj => new XcodeHostTargetConfiguration(targetObj, this.path))
        }
        return this._hostTargets
    }

    get guestIgnores() {
        if (!this._guestIgnores) {
            let guestIgnores = []
            if (this.configObj.defaultGuestIgnores)
                guestIgnores.push(this.configObj.defaultGuestIgnores)
            else
                guestIgnores = guestIgnores.concat([NODE_MODULES_DIR_NAME, PACKAGE_JSON_LOCK_FILE_NAME])

            if (this.configObj.guestIgnores)
                guestIgnores = guestIgnores.concat(this.configObj.guestIgnores)

            this._guestIgnores = guestIgnores
        }
        return this._guestIgnores
    }

    checkMandatoryProps(...propertyNames) {
        for (const propertyName of propertyNames) {
            if (!this.configObj.hasOwnProperty(propertyName)) {
                throw new Error(`${this.errorLocationString} "${propertyName}" property is missing`)
            }
        }
    }
}

module.exports = {Configuration}