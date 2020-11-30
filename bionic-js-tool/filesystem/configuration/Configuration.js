class Configuration {

    constructor(configObj, locator, optionalKeys = [], mandatoryKeys = []) {
        Object.assign(this, {configObj, locator, optionalKeys, mandatoryKeys})
    }

    validate() {
        const missingKeys = []
        for (const keyName of this.mandatoryKeys) {
            if (!this.configObj.hasOwnProperty(keyName)) {
                missingKeys.push(keyName)
            }
        }
        if (missingKeys.length) {
            throw new Error(`${this.locator} -> missing keys: "${missingKeys.join(', ')}"`)
        }

        const validationErrors = []
        for (const keyName of [...this.mandatoryKeys, ...this.optionalKeys]) {
            try {
                (() => this[keyName])()
            } catch (error) {
                validationErrors.push(error.message)
            }
        }
        if (validationErrors.length) {
            throw new Error(validationErrors.join('\n'))
        }
    }
}

module.exports = {Configuration}