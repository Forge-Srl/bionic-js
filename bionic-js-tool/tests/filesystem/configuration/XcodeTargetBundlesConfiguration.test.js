const t = require('../../test-utils')

describe('XcodeTargetBundlesConfiguration', () => {

    let XcodeTargetBundlesConfiguration

    beforeEach(() => {
        XcodeTargetBundlesConfiguration =
            t.requireModule('filesystem/configuration/XcodeTargetBundlesConfiguration').XcodeTargetBundlesConfiguration
    })

    test('bundles', () => {
        const bundle1Obj = {compileTargets: ['target1']}
        const bundle2Obj = {compileTargets: ['target2']}
        const bundles = XcodeTargetBundlesConfiguration.fromObj(
            {bundle1: bundle1Obj, bundle2: bundle2Obj}, 'locator')
        expect(bundles.length).toBe(2)
        expect(bundles[0].configObj).toBe(bundle1Obj)
        expect(bundles[0].locator).toBe('locator -> "bundle1"')
        expect(bundles[1].configObj).toBe(bundle2Obj)
        expect(bundles[1].locator).toBe('locator -> "bundle2"')
    })

    test('bundles, error same target in two bundles', () => {
        expect(() => XcodeTargetBundlesConfiguration.fromObj({
            bundle1: {compileTargets: ['target1', 'target2']},
            bundle2: {compileTargets: ['target2', 'target3']},
        }, 'locator')).toThrow('locator -> "bundle2" -> "compileTargets" -> target "target2" already used in another bundle')
    })
})