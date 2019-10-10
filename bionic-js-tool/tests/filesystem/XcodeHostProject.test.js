const t = require('../test-utils')

describe('XcodeHostProject', () => {

    let XcodeHostProject, xcodeProjectPath

    beforeEach(() => {
        XcodeHostProject = t.requireModule('filesystem/XcodeHostProject').XcodeHostProject
        xcodeProjectPath = t.getModuleAbsolutePath('testing-code/swift/project-without-host-files/HostProject.xcodeproj')
    })

    test('getProject', async () => {
        const targetConfig = {xcodeProjectPath}
        const xcodeProject = new XcodeHostProject(targetConfig)

        const project = await xcodeProject.getProject()

        expect(project.hash.project.rootObject).toBe('C5966C852349378B00EE670C')
    })
})