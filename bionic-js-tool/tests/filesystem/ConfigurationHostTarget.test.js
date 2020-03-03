const t = require('../test-utils')

describe('ConfigurationHostTarget', () => {

    let ConfigurationHostTarget

    beforeEach(() => {
        ConfigurationHostTarget = t.requireModule('filesystem/ConfigurationHostTarget').ConfigurationHostTarget
    })

    test('hostLanguage', () => {
        const config = new ConfigurationHostTarget({hostLanguage: 'language'})
        expect(config.hostLanguage).toBe('Language')
    })

    test('hostDirPath', () => {
        const config = new ConfigurationHostTarget({
            xcodeProjectPath: '/project/dir/project.xcodeproj',
            hostDirName: 'host/dir',
        })
        expect(config.hostDirPath).toBe('/project/dir/host/dir')
    })

    test('hostDirPath, missing', () => {
        const config = new ConfigurationHostTarget({
            xcodeProjectPath: '/project/dir/project.xcodeproj',
        })
        expect(config.hostDirPath).toBe('/project/dir/Bjs')
    })

    test('hostDirPath, hostDirName out of project dir', () => {
        const config = new ConfigurationHostTarget({
            xcodeProjectPath: '/project/dir/project.xcodeproj',
            hostDirName: '../host/dir',
        }, 'config/path')
        expect(() => config.hostDirPath).toThrow('config file "config/path" -> "hostTargets" property -> "hostDirName" must be a directory inside "/project/dir"')
    })

    test('packageName', () => {
        const config = new ConfigurationHostTarget({packageName: 'packageName.bundle'})
        expect(config.packageName).toBe('packageName.bundle')
    })

    test('packageName, missing', () => {
        const config = new ConfigurationHostTarget({})
        expect(config.packageName).toBe('package.bundle')
    })

    test('packageName, dirty name', () => {
        const config = new ConfigurationHostTarget({packageName: './packageName.bundle'}, 'config/path')
        expect(() => config.packageName).toThrow('config file "config/path" -> "hostTargets" property -> "packageName" must be a file name')
    })

    test('packageName, wrong extension', () => {
        const config = new ConfigurationHostTarget({packageName: 'packageName.bundle2'}, 'config/path')
        expect(() => config.packageName).toThrow('config file "config/path" -> "hostTargets" property -> "packageName" must be a .bundle file')
    })

    test('packageMinimization', () => {
        const config = new ConfigurationHostTarget({packageMinimization: 1})
        expect(config.packageMinimization).toBe(true)
    })

    test('packageMinimization, not boolean', () => {
        const config = new ConfigurationHostTarget({packageMinimization: ''})
        expect(config.packageMinimization).toBe(false)
    })

    test('packageMinimization, missing', () => {
        const config = new ConfigurationHostTarget({})
        expect(config.packageMinimization).toBe(false)
    })
})