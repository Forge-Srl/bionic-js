const t = require('../../test-utils')

describe('JavaTargetBundlesConfiguration', () => {

    let JavaTargetBundlesConfiguration

    beforeEach(() => {
        JavaTargetBundlesConfiguration =
            t.requireModule('filesystem/configuration/JavaTargetBundlesConfiguration').JavaTargetBundlesConfiguration
    })

    test('bundles', () => {
        const bundle1Obj = {sourceSets: ['target1']}
        const bundle2Obj = {sourceSets: ['target2']}
        const bundles = JavaTargetBundlesConfiguration.fromObj(
            {bundle1: bundle1Obj, bundle2: bundle2Obj}, 'locator')
        expect(bundles.length).toBe(2)
        expect(bundles[0].configObj).toBe(bundle1Obj)
        expect(bundles[0].locator).toBe('locator -> "bundle1"')
        expect(bundles[1].configObj).toBe(bundle2Obj)
        expect(bundles[1].locator).toBe('locator -> "bundle2"')
    })

    test('bundles, error same target in two bundles', () => {
        expect(() => JavaTargetBundlesConfiguration.fromObj({
            bundle1: {sourceSets: ['target1', 'target2']},
            bundle2: {sourceSets: ['target2', 'target3']},
        }, 'locator')).toThrow('locator -> "bundle2" -> "sourceSets" -> target "target2" already used in another bundle')
    })
})