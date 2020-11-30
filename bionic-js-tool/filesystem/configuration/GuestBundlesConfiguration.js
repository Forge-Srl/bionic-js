const {GuestBundleConfiguration} = require('./GuestBundleConfiguration')

class GuestBundlesConfiguration {

    static fromObj(configObj, locator) {
        if (Array.isArray(configObj) || typeof configObj === 'string') {
            throw new Error(`${locator} is not an object`)
        }
        const bundles = []
        for (const bundleName of Object.getOwnPropertyNames(configObj)) {
            bundles.push(GuestBundleConfiguration.fromObj(
                configObj[bundleName], bundleName, `${locator} -> "${bundleName}"`))
        }
        return bundles
    }
}

module.exports = {GuestBundlesConfiguration}