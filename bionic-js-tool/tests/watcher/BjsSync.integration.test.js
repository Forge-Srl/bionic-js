const t = require('../test-utils')
const path = require('path')


describe('Bjs integration', () => {

    let BjsSync

    beforeEach(() => {
        BjsSync = t.requireModule('watcher/BjsSync').BjsSync
    })

    test('sync', async () => {

        let log = ''
        const bjsSync = new BjsSync(t.getModuleAbsolutePath('testing-code/bjs.config.js'), {info: message => log += `${message}\n`})

        await bjsSync.sync()
        console.log('Sync log:\n\n' + log)
    })
})