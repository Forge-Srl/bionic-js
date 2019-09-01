const t = require('../test-utils')
const path = require('path')

describe('watcher integration', () => {

    let BjsSync

    beforeEach(() => {
        BjsSync = t.requireModule('watcher/BjsSync').BjsSync
    })

    test('sync', async () => {

        let log = ''
        const bjsSync = new BjsSync(t.getModuleAbsolutePath('testing-code/bjs.config.js'), {logInfo: message => log += message})

        await bjsSync.sync()
    })
})