const t = require('../test-utils')

describe('BjsSyncStats', () => {

    let log, stats

    beforeEach(() => {
        const Log = t.requireModule('filesystem/Log').Log
        log = new Log(true)
        const BjsSyncStats = t.requireModule('filesystem/BjsSyncStats').BjsSyncStats
        stats = new BjsSyncStats()
    })

    test('logStats, no files', async () => {
        t.mockGetter(stats, 'processingTime', () => 1.23)

        stats.setProjectFilesDiff({filesToDelete: [], filesToAdd: [], filesToUpdate: []})
        stats.logStats(log)

        expect(log.infoLog).toBe(
            '\n' +
            'Project files\n' +
            ' ----------\n' +
            ' [-] deleted : 0\n' +
            ' [U] updated : 0\n' +
            ' [+] added : 0\n' +
            '\n' +
            'Processing time: 1.23s\n')
        expect(log.errorLog).toBe('')
        expect(log.warningLog).toBe('')

    })

    test('logStats, with files', async () => {
        t.mockGetter(stats, 'processingTime', () => 1.23)

        stats.setProjectFilesDiff({
            filesToDelete: [{logText:'host.del'},{logText:'bundle.del'}],
            filesToAdd: [{logText:'host.add'},{logText:'bundle.add'}],
            filesToUpdate: [{logText:'host.upd'},{logText:'bundle.upd'}],
        })

        stats.logStats(log)
        expect(log.infoLog).toBe(
            '\n' +
            'Project files\n' +
            ' [-] bundle.del\n' +
            ' [-] host.del\n' +
            ' [U] bundle.upd\n' +
            ' [U] host.upd\n' +
            ' [+] bundle.add\n' +
            ' [+] host.add\n' +
            ' ----------\n' +
            ' [-] deleted : 2\n' +
            ' [U] updated : 2\n' +
            ' [+] added : 2\n' +
            '\n' +
            'Processing time: 1.23s\n')
        expect(log.errorLog).toBe('')
        expect(log.warningLog).toBe('')
    })
})