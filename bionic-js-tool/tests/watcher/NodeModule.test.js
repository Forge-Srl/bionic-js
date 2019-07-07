const t = require('../test-utils')
const path = require('path')

describe('NodeModule', () => {

    let NodeModule

    beforeEach(() => {
        NodeModule = t.requireModule('watcher/NodeModule').NodeModule
    })

    test('getDependencies path not existent', async () => {
        const moduleDirPath = path.resolve(__dirname, '../../testing-code/fake')
        const brokenModule = NodeModule.fromModulePath(moduleDirPath)

        await expect(brokenModule.getDependencies()).rejects
            .toThrow(`Cannot read package.obj file in module "${moduleDirPath}"`)
    })

    test('getDependencies path is a file', async () => {
        const moduleDirPath = path.resolve(__dirname, '../../testing-code/bjs.config.js')
        const brokenModule = NodeModule.fromModulePath(moduleDirPath)

        await expect(brokenModule.getDependencies()).rejects
            .toThrow(`Cannot read package.obj file in module "${moduleDirPath}"`)
    })

    test('getDependencies complex module with broken dependencies', async () => {
        const brokenModule = NodeModule.fromModulePath(path.resolve(__dirname, '../../testing-code/broken-dependencies'))

        await expect(brokenModule.getDependencies()).rejects
            .toThrow('Dependency "module-b" in module "node_modules/module-c/node_modules/module-d" cannot be resolved')
    })

    test('getDependencies complex module', async () => {
        const expectedDependencyPaths = [
            'node_modules/module-a',
            'node_modules/module-b',
            'node_modules/module-c',
            'node_modules/module-c/node_modules/module-b']

        const guestModule = NodeModule.fromModulePath(path.resolve(__dirname, '../../testing-code/guest'))

        const dependencyPaths = (await guestModule.getDependencies()).map(dep => dep.moduleDir.relativePath)

        expect(dependencyPaths.length).toEqual(expectedDependencyPaths.length)
        expect(dependencyPaths).toEqual(expect.arrayContaining(expectedDependencyPaths))
    })
})