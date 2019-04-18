const t = require('../test-utils')
const path = require('path')

describe('Npm', () => {

    let Npm

    beforeEach(() => {
        Npm = t.requireModule('watcher/Npm')
    })

    test('getOptions path not existent', async () => {

        const npm = new Npm(path.resolve(__dirname, '../../testing-code/fake'))

        await expect(npm.getOptions()).rejects
            .toThrow(/Cannot access path ".*\/testing-code\/fake"/)
    })

    test('getOptions path is a file', async () => {

        const npm = new Npm(path.resolve(__dirname, '../../testing-code/bjs.config.js'))

        await expect(npm.getOptions()).rejects
            .toThrow(/Path ".*\/testing-code\/bjs\.config\.js" is not a directory/)
    })

    test('integration: installPackage and getDevDependencies', async () => {

        const Npm = t.requireModule('watcher/Npm')
        const npm = new Npm(path.resolve(__dirname, '../../testing-code/guest'))

        expect(await npm.install()).toBe('ok')

        const dependencies = await npm.getDevDependencies()
        expect(dependencies).toEqual([
            'node_modules/dev-dep',
            'node_modules/dev-dep/node_modules/format',
            'node_modules/dev-dep/node_modules/shared-dep',
            'node_modules/main-dep/node_modules/shared-dep/node_modules/indirect-dep'])
    }, 20000)
})