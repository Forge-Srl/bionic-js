const t = require('../../test-utils')

describe('GuestBundleConfiguration', () => {

    let GuestBundleConfiguration

    beforeEach(() => {
        GuestBundleConfiguration = t.requireModule('filesystem/configuration/GuestBundleConfiguration').GuestBundleConfiguration
    })

    test('fromObj', () => {
        const configObj = {}
        const config = GuestBundleConfiguration.fromObj(configObj, 'bundleName', 'locator')
        expect(config).toBeInstanceOf(GuestBundleConfiguration)
        expect(config.configObj).toBe(configObj)
        expect(config.bundleName).toBe('bundleName')
        expect(config.locator).toBe('locator')
    })

    test('fromObj, invalid name', () => {
        expect(() => GuestBundleConfiguration.fromObj(null, 'invalid-name', 'locator'))
            .toThrow('locator -> bundle name "invalid-name" cannot contain non-alphanumeric characters')
    })

    test('validation', () => {
        const config = new GuestBundleConfiguration()
        expect(config.optionalKeys).toStrictEqual(['ignoreExport'])
        expect(config.mandatoryKeys).toStrictEqual(['entryPaths'])
        expect(config.validation).not.toBeNull()
    })

    test('entryPaths, not an array', () => {
        const config = new GuestBundleConfiguration({entryPaths: 42}, undefined, 'locator')
        expect(() => config.entryPaths).toThrow('locator -> "entryPaths" is not an array')
    })

    test('entryPaths', () => {
        const config = new GuestBundleConfiguration({entryPaths: ['path1', 'path2']})
        expect(config.entryPaths).toEqual(['path1', 'path2'])
    })

    test('bundleName', () => {
        const config = new GuestBundleConfiguration(undefined, 'bundleName')

        expect(config.bundleName).toBe('bundleName')
    })
})