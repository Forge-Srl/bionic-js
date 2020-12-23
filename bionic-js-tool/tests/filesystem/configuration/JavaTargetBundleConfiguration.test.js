const t = require('../../test-utils')

describe('JavaTargetBundleConfiguration', () => {

    let JavaTargetBundleConfiguration

    beforeEach(() => {
        JavaTargetBundleConfiguration = t.requireModule('filesystem/configuration/JavaTargetBundleConfiguration').JavaTargetBundleConfiguration
    })

    test('fromObj', () => {
        const configObj = {}
        const config = JavaTargetBundleConfiguration.fromObj(configObj, 'bundleName', 'locator')
        expect(config).toBeInstanceOf(JavaTargetBundleConfiguration)
        expect(config.configObj).toBe(configObj)
        expect(config.bundleName).toBe('bundleName')
        expect(config.locator).toBe('locator')
    })

    test('fromObj, invalid name', () => {
        expect(() => JavaTargetBundleConfiguration.fromObj(null, 'invalid-name', 'locator'))
            .toThrow('locator -> bundle name "invalid-name" cannot contain non-alphanumeric characters')
    })

    test('validation', () => {
        const config = new JavaTargetBundleConfiguration()
        expect(config.optionalKeys).toStrictEqual([])
        expect(config.mandatoryKeys).toStrictEqual(['sourceSets'])
        expect(config.validation).not.toBeNull()
    })

    describe('sourceSets', () => {
        test('ok', () => {
            const bundleObj = {sourceSets: ['target']}
            const config = new JavaTargetBundleConfiguration(bundleObj)

            const sourceSets = config.sourceSets
            expect(sourceSets).toStrictEqual(['target'])

            expect(config.sourceSets).toBe(sourceSets)
        })

        test('not an array', () => {
            const bundleObj = {sourceSets: 42}
            const config = new JavaTargetBundleConfiguration(bundleObj, undefined, 'locator')

            expect(() => config.sourceSets).toThrow('locator -> "sourceSets" is not an array')
        })

        test('empty', () => {
            const bundleObj = {sourceSets: []}
            const config = new JavaTargetBundleConfiguration(bundleObj, undefined, 'locator')

            expect(() => config.sourceSets).toThrow('locator -> "sourceSets" is empty')
        })

        test('contains main', () => {
            const bundleObj = {sourceSets: ['other', 'main']}
            const config = new JavaTargetBundleConfiguration(bundleObj, undefined, 'locator')

            expect(() => config.sourceSets).toThrow('locator -> "sourceSets" contains "main", which is already added by default')
        })
    })

    test('bundleName', () => {
        const config = new JavaTargetBundleConfiguration(undefined, 'bundleName', 'locator')

        expect(config.bundleName).toBe('bundleName')
    })
})