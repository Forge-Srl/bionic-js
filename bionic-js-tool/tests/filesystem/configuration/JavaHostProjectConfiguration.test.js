const t = require('../../test-utils')

describe('JavaHostProjectConfiguration', () => {

    let JavaTargetBundlesConfiguration, JavaHostProjectConfiguration, File, Directory

    beforeEach(() => {
        t.resetModulesCache()
        JavaTargetBundlesConfiguration = t.mockAndRequireModule('filesystem/configuration/JavaTargetBundlesConfiguration').JavaTargetBundlesConfiguration
        JavaHostProjectConfiguration = t.requireModule('filesystem/configuration/JavaHostProjectConfiguration').JavaHostProjectConfiguration
        File = t.requireModule('filesystem/File').File
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    test('validation', () => {
        const config = new JavaHostProjectConfiguration()
        expect(config.optionalKeys).toStrictEqual([])
        expect(config.mandatoryKeys).toStrictEqual(['type', 'projectPath', 'srcDirName', 'targetBundles', 'basePackage', 'hostPackage'])
        expect(config.validation).not.toBeNull()
    })

    test('language', () => {
        const config = new JavaHostProjectConfiguration({language: 'language1'})

        expect(config.language).toBe('Java')
    })

    test('commonSourceSet', () => {
        const config = new JavaHostProjectConfiguration()

        expect(config.commonSourceSet).toBe('main')
    })

    test('projectPath', () => {
        const config = new JavaHostProjectConfiguration({projectPath: 'path'})

        expect(config.projectPath).toBe('path')
    })

    test('srcDirName', () => {
        const config = new JavaHostProjectConfiguration({srcDirName: 'dirName'})

        expect(config.srcDirName).toBe('dirName')
    })

    test('basePackage', () => {
        const config = new JavaHostProjectConfiguration({basePackage: 'base.package'})

        expect(config.basePackage).toBe('base.package')
    })

    test.each([
        ['base.package', 'host', 'base.package.host'],
        ['base.package', 'host.sub.package', 'base.package.host.sub.package'],
        ['', 'host', 'host'],
        [undefined, 'host', 'host'],
        [null, 'host', 'host'],
    ])('hostPackage %s, %s', (base, host, expected) => {
        const config = new JavaHostProjectConfiguration({basePackage: base, hostPackage: host})

        expect(config.hostPackage).toBe(expected)
    })

    test('srcDir', () => {
        const config = new JavaHostProjectConfiguration({projectPath: '/something', srcDirName: 'dirName'})

        expect(config.srcDir.absolutePath).toBe('/something/dirName')
        expect(config.srcDir.relativePath).toBe('')
    })

    test('hostDir', () => {
        const config = new JavaHostProjectConfiguration({
            projectPath: '/something', srcDirName: 'dirName', basePackage: 'base.package', hostPackage: 'host',
        })

        expect(config.hostDir('main').absolutePath).toBe('/something/dirName/main/java/base/package/host')
        expect(config.hostDir('main').relativePath).toBe('main/java/base/package/host')
        expect(config.hostDir('other').absolutePath).toBe('/something/dirName/other/java/base/package/host')
        expect(config.hostDir('other').relativePath).toBe('other/java/base/package/host')
    })

    test('resourcesDir', () => {
        const config = new JavaHostProjectConfiguration({
            projectPath: '/something', srcDirName: 'dirName', basePackage: 'base.package',
        })

        expect(config.resourcesDir('main').absolutePath).toBe('/something/dirName/main/resources')
        expect(config.resourcesDir('main').relativePath).toBe('main/resources')
        expect(config.resourcesDir('other').absolutePath).toBe('/something/dirName/other/resources')
        expect(config.resourcesDir('other').relativePath).toBe('other/resources')
    })

    test('targetBundles', () => {
        const targetBundlesObj = {}
        const config = new JavaHostProjectConfiguration({targetBundles: targetBundlesObj}, 'locator')
        JavaTargetBundlesConfiguration.fromObj = t.mockFn(() => ['bundle1'])

        const targetBundles = config.targetBundles
        expect(targetBundles).toStrictEqual(['bundle1'])
        expect(config.targetBundles).toBe(targetBundles)
        expect(JavaTargetBundlesConfiguration.fromObj).toBeCalledWith(targetBundlesObj, 'locator -> "targetBundles"')
    })

    test('allTargetBundleNames', () => {
        const targetBundlesObj = {}
        const config = new JavaHostProjectConfiguration({targetBundles: targetBundlesObj}, 'locator')
        JavaTargetBundlesConfiguration.fromObj = t.mockFn(() => [
            {bundleName: 'bundle1'}, {bundleName: 'bundle2'}, {bundleName: 'bundle3'}, {bundleName: 'bundle2'},
        ])

        expect(config.allTargetBundleNames).toStrictEqual(['bundle1', 'bundle2', 'bundle3'])
    })

    test.each([
        [['bundle1'], ['source1']],
        [['bundle2'], ['source2', 'source4']],
        [['bundle3'], ['source3']],
        [['bundle3', 'bundle1'], ['source1', 'source3']],
        [['bundle1', 'bundle2'], ['source1', 'source2', 'source4']],
        [['bundle1', 'bundle3', 'bundle2'], ['main']],
    ])('getSourceSetsForBundles %p', (bundles, expectedSources) => {
        const targetBundlesObj = {}
        const config = new JavaHostProjectConfiguration({targetBundles: targetBundlesObj}, 'locator')
        JavaTargetBundlesConfiguration.fromObj = t.mockFn(() => [
            {bundleName: 'bundle1', sourceSets: ['source1']},
            {bundleName: 'bundle2', sourceSets: ['source2', 'source4']},
            {bundleName: 'bundle3', sourceSets: ['source3']},
        ])

        expect(config.getSourceSetsForBundles(bundles)).toStrictEqual(expectedSources)
    })
})