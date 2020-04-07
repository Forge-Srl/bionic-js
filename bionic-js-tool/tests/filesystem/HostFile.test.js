const t = require('../test-utils')

describe('HostFile', () => {

    const HostFile = t.requireModule('filesystem/HostFile').HostFile

    beforeEach(() => {
        t.resetModulesCache()
    })

    test('constructor', () => {
        const hostFile = new HostFile('path', 'hostDir', 'exportedFile')

        expect(hostFile.path).toBe('path')
        expect(hostFile.rootDirPath).toBe('hostDir')
        expect(hostFile.exportedFile).toBe('exportedFile')

    })

    test('build', () => {
        const expectedExportedFile = 'exportedFile'
        const expectedTargetConfig = {hostLanguage: 'hLang'}
        const expectedHostFile = 'hostFile'
        const LangHostFile = class {
            static build(exportedFile, targetConfig) {
                expect(exportedFile).toBe(expectedExportedFile)
                expect(targetConfig).toBe(expectedTargetConfig)
                return expectedHostFile
            }
        }
        t.mockAndRequireFakeModule('filesystem/hLangHostFile', 'hLangHostFile', LangHostFile)

        const hostFile = HostFile.build(expectedExportedFile, expectedTargetConfig)
        expect(hostFile).toBe(expectedHostFile)
    })

})