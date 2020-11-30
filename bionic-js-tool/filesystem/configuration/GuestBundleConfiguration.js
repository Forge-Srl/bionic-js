const {Configuration} = require('./Configuration')
const {Validation} = require('../../schema/Validation')

class GuestBundleConfiguration extends Configuration {

    static fromObj(configObj, bundleName, locator) {
        const validationResult = Validation.validateIdentifier('bundle name', bundleName)
        if (!validationResult.validity) {
            throw new Error(`${locator} -> ${validationResult.error}`)
        }
        return new GuestBundleConfiguration(configObj, bundleName, locator)
    }

    constructor(configObj, bundleName, locator) {
        super(configObj, locator, ['ignoreExport'], ['entryPaths'])
        this._bundleName = bundleName
    }

    get entryPaths() {
        if (!this._entryPaths) {
            const entryPaths = this.configObj.entryPaths
            if (!Array.isArray(entryPaths)) {
                throw new Error(`${this.locator} -> "entryPaths" is not an array`)
            }
            this._entryPaths = entryPaths
        }
        return this._entryPaths
    }

    get ignoreExport() {
        return this.configObj.ignoreExport
    }

    get bundleName() {
        return this._bundleName
    }
}

module.exports = {GuestBundleConfiguration}