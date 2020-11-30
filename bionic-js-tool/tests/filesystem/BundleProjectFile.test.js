const t = require('../test-utils')

describe('BundleProjectFile', () => {
    let BundleProjectFile

    beforeEach(() => {
        BundleProjectFile = t.requireModule('filesystem/BundleProjectFile').BundleProjectFile
    })

    test('constructor', () => {
        const file = new BundleProjectFile('bundleName', 'content')
        expect(file.bundles).toEqual(['bundleName'])
    })

    test('id', () => {
        const file = new BundleProjectFile('bundleName')
        expect(file.id).toBe('bundleName')
    })

    test('logText', () => {
        const file = new BundleProjectFile('bundleName')
        expect(file.logText).toBe('Bundle "bundleName"')
    })

    test('isToUpdate, same file', () => {
        const oldFile = new BundleProjectFile('bundleName', 'content')
        const newFile = new BundleProjectFile('bundleName', 'content')

        expect(oldFile.isToUpdate(newFile)).toBe(false)
        expect(newFile.isToUpdate(oldFile)).toBe(false)
    })

    test('isToUpdate, different bundle names', () => {
        const oldFile = new BundleProjectFile('bundleName1', 'content')
        const newFile = new BundleProjectFile('bundleName2', 'X')

        expect(oldFile.isToUpdate(newFile)).toBe(false)
        expect(newFile.isToUpdate(oldFile)).toBe(false)
    })

    test('isToUpdate, mismatching bundle', () => {
        const oldFile = new BundleProjectFile('bundleName', 'content', ['X'])
        const oldFile2 = new BundleProjectFile('bundleName', 'content', ['bundleName', 'X'])
        const newFile = new BundleProjectFile('bundleName', 'content', ['bundleName'])

        expect(oldFile.isToUpdate(newFile)).toBe(true)
        expect(oldFile2.isToUpdate(newFile)).toBe(true)
        expect(newFile.isToUpdate(oldFile)).toBe(false)
        expect(newFile.isToUpdate(oldFile2)).toBe(false)
    })

    test('isToUpdate, different contents', () => {
        const oldFile = new BundleProjectFile('bundleName', 'content1', ['bundleName'])
        const newFile = new BundleProjectFile('bundleName', 'content2', ['bundleName'])

        expect(oldFile.isToUpdate(newFile)).toBe(true)
        expect(newFile.isToUpdate(oldFile)).toBe(true)
    })

    test('addToTargetProject', async () => {
        const file = new BundleProjectFile('bundleName', 'content')
        const targetProject = {addBundleToProject: t.mockFn()}

        await file.addToTargetProject(targetProject)
        expect(targetProject.addBundleToProject).toHaveBeenCalledWith('bundleName', 'content')
    })

    test('updateInTargetProject', async () => {
        const file = new BundleProjectFile('bundleName', 'content')
        const targetProject = {removeBundleFromProject: t.mockFn(), addBundleToProject: t.mockFn()}

        await file.updateInTargetProject(targetProject)
        expect(targetProject.removeBundleFromProject).toHaveBeenCalledWith('bundleName')
        expect(targetProject.addBundleToProject).toHaveBeenCalledWith('bundleName', 'content')
    })

    test('removeFromTargetProject', async () => {
        const file = new BundleProjectFile('bundleName', 'content')
        const targetProject = {removeBundleFromProject: t.mockFn()}

        await file.removeFromTargetProject(targetProject)
        expect(targetProject.removeBundleFromProject).toHaveBeenCalledWith('bundleName')
    })
})