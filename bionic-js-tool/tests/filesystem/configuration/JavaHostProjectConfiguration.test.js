const t = require('../../test-utils')

describe('JavaHostProjectConfiguration', () => {

    let JavaHostProjectConfiguration, File, Directory

    beforeEach(() => {
        t.resetModulesCache()
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
            projectPath: '/something', srcDirName: 'dirName', basePackage: 'base.package', hostPackage: 'host'
        })

        expect(config.hostDir.absolutePath).toBe('/something/dirName/main/java/base/package/host')
        expect(config.hostDir.relativePath).toBe('main/java/base/package/host')
    })

    test('resourcesDir', () => {
        const config = new JavaHostProjectConfiguration({
            projectPath: '/something', srcDirName: 'dirName', basePackage: 'base.package'
        })

        expect(config.resourcesDir.absolutePath).toBe('/something/dirName/main/resources')
        expect(config.resourcesDir.relativePath).toBe('main/resources')
    })

})