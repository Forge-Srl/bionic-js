const t = require('../test-utils')

describe('HostProjectFile', () => {
    let HostProjectFile

    beforeEach(() => {
        HostProjectFile = t.requireModule('filesystem/HostProjectFile').HostProjectFile
    })

    test('id', () => {
        const file = new HostProjectFile('relative/path', ['bundle1'], 'content')
        expect(file.id).toBe('relative/path')
    })

    test('logText', () => {
        const file = new HostProjectFile('relative/path', ['bundle1'], 'content')
        expect(file.logText).toBe('Source "relative/path" - in bundles (bundle1)')
    })

    test('isToUpdate, same file', () => {
        const oldFile = new HostProjectFile('relative/path', ['bundle1', 'bundle2'], 'content')
        const newFile = new HostProjectFile('relative/path', ['bundle2', 'bundle1'], 'content')

        expect(oldFile.isToUpdate(newFile)).toBe(false)
        expect(newFile.isToUpdate(oldFile)).toBe(false)
    })

    test('isToUpdate, different relativePath', () => {
        const oldFile = new HostProjectFile('relative/path1', ['bundle1'], 'content')
        const newFile = new HostProjectFile('relative/path2', ['X'], 'X')

        expect(oldFile.isToUpdate(newFile)).toBe(false)
        expect(newFile.isToUpdate(oldFile)).toBe(false)
    })

    test('isToUpdate, different bundles', () => {
        const oldFile = new HostProjectFile('relative/path', ['bundle1'], 'content')
        const newFile = new HostProjectFile('relative/path', ['bundle2'], 'content')

        expect(oldFile.isToUpdate(newFile)).toBe(true)
        expect(newFile.isToUpdate(oldFile)).toBe(true)
    })

    test('isToUpdate, different contents', () => {
        const oldFile = new HostProjectFile('relative/path', ['bundle'], 'content1')
        const newFile = new HostProjectFile('relative/path', ['bundle'], 'content2')

        expect(oldFile.isToUpdate(newFile)).toBe(true)
        expect(newFile.isToUpdate(oldFile)).toBe(true)
    })

    test('addToTargetProject', async () => {
        const file = new HostProjectFile('relative/path', ['bundle'], 'content')
        const targetProject = {addHostFileToProject: t.mockFn()}

        await file.addToTargetProject(targetProject)
        expect(targetProject.addHostFileToProject).toHaveBeenCalledWith('relative/path', ['bundle'], 'content')
    })

    test('updateInTargetProject', async () => {
        const file = new HostProjectFile('relative/path', ['bundle'], 'content')
        const targetProject = {removeHostFileFromProject: t.mockFn(), addHostFileToProject: t.mockFn()}

        await file.updateInTargetProject(targetProject)
        expect(targetProject.removeHostFileFromProject).toHaveBeenCalledWith('relative/path')
        expect(targetProject.addHostFileToProject).toHaveBeenCalledWith('relative/path', ['bundle'], 'content')
    })

    test('removeFromTargetProject', async () => {
        const file = new HostProjectFile('relative/path', ['bundle'], 'content')
        const targetProject = {removeHostFileFromProject: t.mockFn()}

        await file.removeFromTargetProject(targetProject)
        expect(targetProject.removeHostFileFromProject).toHaveBeenCalledWith('relative/path')
    })
})