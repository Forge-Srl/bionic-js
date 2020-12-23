const {JavaTargetBundleConfiguration} = require('./JavaTargetBundleConfiguration')

class JavaTargetBundlesConfiguration {

    static fromObj(configObj, locator) {
        const bundles = [], targetSourceSets = new Set()
        for (const bundleName of Object.getOwnPropertyNames(configObj)) {
            const targetBundleLocator = `${locator} -> "${bundleName}"`
            const targetBundleConfig = JavaTargetBundleConfiguration.fromObj(configObj[bundleName], bundleName,
                targetBundleLocator)
            const targetAlreadyUsed = targetBundleConfig.sourceSets.find(targetSourceSet => targetSourceSets.has(targetSourceSet))
            if (targetAlreadyUsed) {
                throw new Error(`${targetBundleLocator} -> "sourceSets" -> target "${targetAlreadyUsed}" already ` +
                'used in another bundle')
            }
            targetBundleConfig.sourceSets.forEach(targetName => targetSourceSets.add(targetName))
            bundles.push(targetBundleConfig)
        }
        return bundles
    }
}

module.exports = {JavaTargetBundlesConfiguration}