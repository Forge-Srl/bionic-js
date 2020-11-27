const {XcodeTargetBundleConfiguration} = require('./XcodeTargetBundleConfiguration')

class XcodeTargetBundlesConfiguration {

    static fromObj(configObj, locator) {
        const bundles = [], targetNames = new Set()
        for (const bundleName of Object.getOwnPropertyNames(configObj)) {
            const targetBundleLocator = `${locator} -> "${bundleName}"`
            const targetBundleConfig = XcodeTargetBundleConfiguration.fromObj(configObj[bundleName], bundleName,
                targetBundleLocator)
            const targetAlreadyUsed = targetBundleConfig.compileTargets.find(targetName => targetNames.has(targetName))
            if (targetAlreadyUsed) {
                throw new Error(`${targetBundleLocator} -> "compileTargets" -> target "${targetAlreadyUsed}" already ` +
                'used in another bundle')
            }
            targetBundleConfig.compileTargets.forEach(targetName => targetNames.add(targetName))
            bundles.push(targetBundleConfig)
        }
        return bundles
    }
}

module.exports = {XcodeTargetBundlesConfiguration}