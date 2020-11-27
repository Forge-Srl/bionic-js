const t = require('../test-utils')

describe('HostEnvironmentFile', () => {

    const HostEnvironmentFile = t.requireModule('filesystem/HostEnvironmentFile').HostEnvironmentFile

    beforeEach(() => {
        t.resetModulesCache()
    })

    test('constructor', () => {
        const hostFile = new HostEnvironmentFile('path', 'hostDir', 'bundleName', 'nativeFiles', 'projectName')

        expect(hostFile.path).toBe('path')
        expect(hostFile.rootDirPath).toBe('hostDir')
        expect(hostFile.bundleName).toBe('bundleName')
        expect(hostFile.nativeFiles).toBe('nativeFiles')
        expect(hostFile.projectName).toBe('projectName')

    })

    test('build', () => {
        const nativeFiles = 'nativeFiles'
        const bundleName = 'bundleName'
        const hostProjectConfig = {language: 'hLang'}
        const projectName = 'projectName'
        const hostFile = 'hostFile'
        const LangHostFile = class {
            static build(actualNativeFiles, actualBundleName, actualHostProjectConfig, actualProjectName) {
                expect(actualNativeFiles).toBe(nativeFiles)
                expect(actualBundleName).toBe(bundleName)
                expect(actualHostProjectConfig).toBe(hostProjectConfig)
                expect(actualProjectName).toBe(projectName)
                return hostFile
            }
        }
        t.mockAndRequireFakeModule('filesystem/hLangHostEnvironmentFile', 'hLangHostEnvironmentFile', LangHostFile)

        const actualHostFile = HostEnvironmentFile.build(nativeFiles, bundleName, hostProjectConfig, projectName)
        expect(actualHostFile).toBe(hostFile)
    })
})