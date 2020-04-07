const t = require('../test-utils')

describe('HostEnvironmentFile', () => {

    const HostEnvironmentFile = t.requireModule('filesystem/HostEnvironmentFile').HostEnvironmentFile

    beforeEach(() => {
        t.resetModulesCache()
    })

    test('constructor', () => {
        const hostFile = new HostEnvironmentFile('path', 'hostDir', 'packageName', 'nativePackageFiles')

        expect(hostFile.path).toBe('path')
        expect(hostFile.rootDirPath).toBe('hostDir')
        expect(hostFile.packageName).toBe('packageName')
        expect(hostFile.nativePackageFiles).toBe('nativePackageFiles')

    })

    test('build', () => {
        const expectedNativePackageFiles = 'nativePackageFiles'
        const expectedTargetConfig = {hostLanguage: 'hLang'}
        const expectedHostFile = 'hostFile'
        const LangHostFile = class {
            static build(nativePackageFiles, targetConfig) {
                expect(nativePackageFiles).toBe(expectedNativePackageFiles)
                expect(targetConfig).toBe(expectedTargetConfig)
                return expectedHostFile
            }
        }
        t.mockAndRequireFakeModule('filesystem/hLangHostEnvironmentFile', 'hLangHostEnvironmentFile', LangHostFile)

        const hostFile = HostEnvironmentFile.build(expectedNativePackageFiles, expectedTargetConfig)
        expect(hostFile).toBe(expectedHostFile)
    })

})