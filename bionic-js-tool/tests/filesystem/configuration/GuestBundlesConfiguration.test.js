const t = require('../../test-utils')

describe('GuestBundlesConfiguration', () => {

    let GuestBundlesConfiguration

    beforeEach(() => {
        GuestBundlesConfiguration =
            t.requireModule('filesystem/configuration/GuestBundlesConfiguration').GuestBundlesConfiguration
    })

    test('fromObj', () => {
        const bundleObj = {}
        const bundles = GuestBundlesConfiguration.fromObj({bundleName: bundleObj}, 'locator')
        expect(bundles.length).toBe(1)
        expect(bundles[0].configObj).toBe(bundleObj)
        expect(bundles[0].locator).toBe('locator -> "bundleName"')
    })

    test('fromObj, not an object', () => {
        const expectedError = 'locator is not an object'
        expect(() => GuestBundlesConfiguration.fromObj([], 'locator')).toThrow(new Error(expectedError))
        expect(() => GuestBundlesConfiguration.fromObj('', 'locator')).toThrow(new Error(expectedError))
    })
})