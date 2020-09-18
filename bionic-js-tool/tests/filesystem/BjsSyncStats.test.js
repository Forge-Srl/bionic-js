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
        stats.logStats(log)

        expect(log.infoLog).toBe(
            '\n' +
            'Package files\n' +
            ' ----------\n' +
            ' [-] deleted : 0\n' +
            ' [U] updated : 0\n' +
            ' [+] added : 0\n' +
            '\n' +
            'Host files\n' +
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
        stats.deletePackageFile('package1.del')
        stats.deletePackageFile('package2.del')
        stats.updatePackageFile('package1.upd')
        stats.updatePackageFile('package2.upd')
        stats.addPackageFile('package1.add')
        stats.addPackageFile('package2.add')
        stats.deleteHostFile('host1.del')
        stats.deleteHostFile('host2.del')
        stats.updateHostFile('host1.upd')
        stats.updateHostFile('host2.upd')
        stats.addHostFile('host1.add')
        stats.addHostFile('host2.add')

        t.mockGetter(stats, 'processingTime', () => 1.23)

        stats.logStats(log)
        expect(log.infoLog).toBe(
            '\n' +
            'Package files\n' +
            ' [-] package1.del\n' +
            ' [-] package2.del\n' +
            ' [U] package1.upd\n' +
            ' [U] package2.upd\n' +
            ' [+] package1.add\n' +
            ' [+] package2.add\n' +
            ' ----------\n' +
            ' [-] deleted : 2\n' +
            ' [U] updated : 2\n' +
            ' [+] added : 2\n' +
            '\n' +
            'Host files\n' +
            ' [-] host1.del\n' +
            ' [-] host2.del\n' +
            ' [U] host1.upd\n' +
            ' [U] host2.upd\n' +
            ' [+] host1.add\n' +
            ' [+] host2.add\n' +
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