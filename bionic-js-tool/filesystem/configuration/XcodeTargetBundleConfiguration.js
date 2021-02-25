const {Configuration} = require('./Configuration')
const {Validation} = require('../../schema/Validation')

class XcodeTargetBundleConfiguration extends Configuration {

    static fromObj(configObj, bundleName, locator) {
        const validationResult = Validation.validateIdentifier('bundle name', bundleName)
        if (!validationResult.validity) {
            throw new Error(`${locator} -> ${validationResult.error}`)
        }
        return new XcodeTargetBundleConfiguration(configObj, bundleName, locator)
    }

    constructor(configObj, bundleName, locator) {
        super(configObj, locator, [], ['compileTargets'])
        this._bundleName = bundleName
    }

    get compileTargets() {
        if (!this._compileTargets) {
            const compileTargets = this.configObj.compileTargets
            if (!Array.isArray(compileTargets)) {
                throw new Error(`${this.locator} -> "compileTargets" is not an array`)
            }
            if (!compileTargets.length) {
                throw new Error(`${this.locator} -> "compileTargets" is empty`)
            }
            this._compileTargets = compileTargets
        }
        return this._compileTargets
    }

    get bundleName() {
        return this._bundleName
    }
}

module.exports = {XcodeTargetBundleConfiguration}