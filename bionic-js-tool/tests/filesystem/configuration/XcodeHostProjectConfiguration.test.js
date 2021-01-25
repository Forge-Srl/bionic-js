const t = require('../../test-utils')
const path = require('path')

describe('XcodeHostProjectConfiguration', () => {

    let XcodeTargetBundlesConfiguration, XcodeHostProjectConfiguration, File, Directory

    beforeEach(() => {
        t.resetModulesCache()
        XcodeTargetBundlesConfiguration = t.mockAndRequireModule('filesystem/configuration/XcodeTargetBundlesConfiguration').XcodeTargetBundlesConfiguration
        XcodeHostProjectConfiguration = t.requireModule('filesystem/configuration/XcodeHostProjectConfiguration').XcodeHostProjectConfiguration
        File = t.requireModule('filesystem/File').File
        Directory = t.requireModule('filesystem/Directory').Directory
    })

    test('validation', () => {
        const config = new XcodeHostProjectConfiguration()
        expect(config.optionalKeys).toStrictEqual([])
        expect(config.mandatoryKeys).toStrictEqual(['type', 'projectPath', 'hostDirName', 'targetBundles'])
        expect(config.validation).not.toBeNull()
    })

    test('language', () => {
        const config = new XcodeHostProjectConfiguration({language: 'language1'})

        expect(config.language).toBe('Swift')
    })

    test('projectPath', () => {
        const config = new XcodeHostProjectConfiguration({projectPath: `project${path.sep}path`})

        expect(config.projectPath).toBe('project/path')
    })

    test('hostDirName', () => {
        const config = new XcodeHostProjectConfiguration({hostDirName: `dir${path.sep}name`})

        expect(config.hostDirName).toBe('dir/name')
    })

    test('xcodeProjectBundle', () => {
        const config = new XcodeHostProjectConfiguration({projectPath: '/dir/path'})

        expect(config.xcodeProjectBundle).toStrictEqual(new Directory('/dir/path', '/dir'))
    })

    test('xcodeProjectFile', () => {
        const config = new XcodeHostProjectConfiguration({projectPath: '/dir/path'})

        expect(config.xcodeProjectFile).toStrictEqual(new File('/dir/path/project.pbxproj', '/dir'))
    })

    test('xcodeProjectDir', () => {
        const config = new XcodeHostProjectConfiguration({projectPath: '/dir/path'})

        expect(config.xcodeProjectDir).toStrictEqual(new Directory('/dir', '/dir'))
    })

    test('hostDir', () => {
        const config = new XcodeHostProjectConfiguration({projectPath: '/dir/path', hostDirName: 'host/name'})

        expect(config.hostDir).toStrictEqual(new Directory('/dir/host/name', '/dir'))
    })

    test('targetBundles', () => {
        const targetBundlesObj = {}
        const config = new XcodeHostProjectConfiguration({targetBundles: targetBundlesObj}, 'locator')
        XcodeTargetBundlesConfiguration.fromObj = t.mockFn(() => ['bundle1'])

        const targetBundles = config.targetBundles
        expect(targetBundles).toStrictEqual(['bundle1'])
        expect(config.targetBundles).toBe(targetBundles)
        expect(XcodeTargetBundlesConfiguration.fromObj).toBeCalledWith(targetBundlesObj, 'locator -> "targetBundles"')
    })
})