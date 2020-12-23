const {Configuration} = require('./Configuration')
const {Validation} = require('../../schema/Validation')

class JavaTargetBundleConfiguration extends Configuration {

    static fromObj(configObj, bundleName, locator) {
        const validationResult = Validation.validateIdentifier("bundle name", bundleName)
        if (!validationResult.validity) {
            throw new Error(`${locator} -> ${validationResult.error}`)
        }
        return new JavaTargetBundleConfiguration(configObj, bundleName, locator)
    }

    constructor(configObj, bundleName, locator) {
        super(configObj, locator, [], ['sourceSets'])
        this._bundleName = bundleName
    }

    get sourceSets() {
        if (!this._sourceSets) {
            const sourceSets = this.configObj.sourceSets
            if (!Array.isArray(sourceSets)) {
                throw new Error(`${this.locator} -> "sourceSets" is not an array`)
            }
            if (!sourceSets.length) {
                throw new Error(`${this.locator} -> "sourceSets" is empty`)
            }
            if (sourceSets.includes('main')) {
                throw new Error(`${this.locator} -> "sourceSets" contains "main", which is already added by default`)
            }
            this._sourceSets = sourceSets
        }
        return this._sourceSets
    }

    get bundleName() {
        return this._bundleName
    }
}

module.exports = {JavaTargetBundleConfiguration}