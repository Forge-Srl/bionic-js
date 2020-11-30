const t = require('../../test-utils')

describe('BjsConfiguration', () => {

    let GuestBundlesConfiguration, BjsConfiguration

    beforeEach(() => {
        t.resetModulesCache()
        GuestBundlesConfiguration = t.mockAndRequireModule('filesystem/configuration/GuestBundlesConfiguration').GuestBundlesConfiguration
        BjsConfiguration = t.requireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
    })

    test('fromPath', () => {
        const configPath = '../../testing-code/bjs.config.js'
        const bjsConfig = BjsConfiguration.fromPath(configPath)
        expect(bjsConfig.locator).toBe(`config file "${configPath}"`)
        expect(bjsConfig.guestDirPath).toMatch(/^.*\/testing-code\/guest/)
    })

    test('validation', () => {
        const config = new BjsConfiguration()
        expect(config.optionalKeys).toStrictEqual(['outputMode'])
        expect(config.mandatoryKeys).toStrictEqual(['projectName', 'guestDirPath', 'guestBundles', 'hostProjects'])
        expect(config.validation).not.toBeNull()
    })

    test('projectName', () => {
        const bjsConfig = new BjsConfiguration({projectName: 'name'})
        expect(bjsConfig.projectName).toBe('name')
    })

    test('guestDirPath', () => {
        const bjsConfig = new BjsConfiguration({guestDirPath: 'path'})
        expect(bjsConfig.guestDirPath).toBe('path')
    })

    test('guestBundles', () => {
        const bundlesObj = {}
        const bjsConfig = new BjsConfiguration({guestBundles: bundlesObj}, 'locator')
        GuestBundlesConfiguration.fromObj = t.mockFn(() => ['bundle'])

        const guestBundles = bjsConfig.guestBundles
        expect(guestBundles).toStrictEqual(['bundle'])
        expect(bjsConfig.guestBundles).toBe(guestBundles)
        expect(GuestBundlesConfiguration.fromObj).toBeCalledWith(bundlesObj, 'locator -> "guestBundles"')
    })

    test('outputMode', () => {
        const bjsConfigDev = new BjsConfiguration({outputMode: 'development'})
        expect(bjsConfigDev.outputMode).toBe('development')

        const bjsConfigPro = new BjsConfiguration({outputMode: 'production'})
        expect(bjsConfigPro.outputMode).toBe('production')

        const bjsConfigNone = new BjsConfiguration({outputMode: 'none'})
        expect(bjsConfigNone.outputMode).toBe('none')
    })

    test('outputMode, not allowed', () => {
        const bjsConfigDev = new BjsConfiguration({outputMode: 'not allowed'}, 'locator')
        expect(() => bjsConfigDev.outputMode)
            .toThrow('locator -> "outputMode" only supports values: [development, production, none]')
    })

    test('hostProjects, swift', () => {
        const projectObj = {language: 'swift', projectPath: 'path', targetBundles: {}}
        const bjsConfig = new BjsConfiguration({hostProjects: [projectObj]}, 'locator')
        const hostProjects = bjsConfig.hostProjects
        expect(hostProjects[0].configObj).toBe(projectObj)
        expect(hostProjects[0].locator).toBe('locator -> "hostProjects[0]"')

        expect(bjsConfig.hostProjects).toBe(hostProjects)
    })

    test('hostProjects, empty', () => {
        const bjsConfig = new BjsConfiguration({hostProjects: []})
        expect(bjsConfig.hostProjects).toStrictEqual([])
    })

    test('hostProjects, not an array', () => {
        const bjsConfig = new BjsConfiguration({hostProjects: 42}, 'locator')
        expect(() => bjsConfig.hostProjects).toThrow('locator -> "hostProjects" is not an array')
    })

    test('hostProjects, missing language', () => {
        const bjsConfig = new BjsConfiguration({hostProjects: [{}]}, 'locator')
        expect(() => bjsConfig.hostProjects).toThrow('locator -> "hostProjects[0]" -> "language" is missing')
    })

    test('hostProjects, wrong language', () => {
        const bjsConfig = new BjsConfiguration({hostProjects: [{language: 'foo'}]}, 'locator')
        expect(() => bjsConfig.hostProjects).toThrow('locator -> "hostProjects[0]" -> "language" -> "foo" is not supported')
    })
})