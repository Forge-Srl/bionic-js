const t = require('../../test-utils')

describe('XcodeTargetBundleConfiguration', () => {

    let XcodeTargetBundleConfiguration

    beforeEach(() => {
        XcodeTargetBundleConfiguration = t.requireModule('filesystem/configuration/XcodeTargetBundleConfiguration').XcodeTargetBundleConfiguration
    })

    test('fromObj', () => {
        const configObj = {}
        const config = XcodeTargetBundleConfiguration.fromObj(configObj, 'bundleName', 'locator')
        expect(config).toBeInstanceOf(XcodeTargetBundleConfiguration)
        expect(config.configObj).toBe(configObj)
        expect(config.bundleName).toBe('bundleName')
        expect(config.locator).toBe('locator')
    })

    test('fromObj, invalid name', () => {
        expect(() => XcodeTargetBundleConfiguration.fromObj(null, 'invalid-name', 'locator'))
            .toThrow('locator -> bundle name "invalid-name" cannot contain non-alphanumeric characters')
    })

    test('validation', () => {
        const config = new XcodeTargetBundleConfiguration()
        expect(config.optionalKeys).toStrictEqual([])
        expect(config.mandatoryKeys).toStrictEqual(['compileTargets'])
        expect(config.validation).not.toBeNull()
    })

    test('compileTargets', () => {
        const bundleObj = {compileTargets: ['target']}
        const config = new XcodeTargetBundleConfiguration(bundleObj)

        const compileTargets = config.compileTargets
        expect(compileTargets).toStrictEqual(['target'])

        expect(config.compileTargets).toBe(compileTargets)
    })

    test('compileTargets, not an array', () => {
        const bundleObj = {compileTargets: 42}
        const config = new XcodeTargetBundleConfiguration(bundleObj, undefined, 'locator')

        expect(() => config.compileTargets).toThrow('locator -> "compileTargets" is not an array')
    })

    test('compileTargets, empty', () => {
        const bundleObj = {compileTargets: []}
        const config = new XcodeTargetBundleConfiguration(bundleObj, undefined, 'locator')

        expect(() => config.compileTargets).toThrow('locator -> "compileTargets" is empty')
    })

    test('bundleName', () => {
        const config = new XcodeTargetBundleConfiguration(undefined, 'bundleName', 'locator')

        expect(config.bundleName).toBe('bundleName')
    })
})