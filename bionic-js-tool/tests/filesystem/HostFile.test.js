const t = require('../test-utils')

describe('HostFile', () => {

    const HostFile = t.requireModule('filesystem/HostFile').HostFile

    beforeEach(() => {
        t.resetModulesCache()
    })

    test('constructor', () => {
        const hostFile = new HostFile('path', 'hostDir', 'annotatedFile', 'projectName')

        expect(hostFile.path).toBe('path')
        expect(hostFile.rootDirPath).toBe('hostDir')
        expect(hostFile.annotatedFile).toBe('annotatedFile')
        expect(hostFile.projectName).toBe('projectName')
    })

    test('build', () => {
        const annotatedFile = 'annotatedFile'
        const hostProjectConfig = {language: 'hLang'}
        const projectName = 'projectName'
        const hostFile = 'hostFile'
        const LangHostFile = class {
            static build(actualAnnotatedFile, actualHostProjectConfig, actualProjectName) {
                expect(actualAnnotatedFile).toBe(annotatedFile)
                expect(actualHostProjectConfig).toBe(hostProjectConfig)
                expect(actualProjectName).toBe(projectName)
                return hostFile
            }
        }
        t.mockAndRequireFakeModule('filesystem/hLangHostFile', 'hLangHostFile', LangHostFile)

        const actualHostFile = HostFile.build(annotatedFile, hostProjectConfig, projectName)
        expect(actualHostFile).toBe(hostFile)
    })

})