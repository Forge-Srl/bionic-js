const t = require('../test-utils')

describe('Bjs integration', () => {

    let BjsSync, DebugLog

    beforeEach(() => {
        BjsSync = t.requireModule('filesystem/BjsSync').BjsSync
        DebugLog = t.requireModule('filesystem/DebugLog').DebugLog
    })

    test('sync', async () => {

        const bjsSync = new BjsSync(t.getModuleAbsolutePath('testing-code/bjs.config.js'), new DebugLog())
        await bjsSync.sync()
    })
})