const t = require('./test-utils')

describe('Bjs', () => {

    let Bjs, BjsSync, BjsConfiguration, log, bjs

    beforeEach(() => {
        t.resetModulesCache()

        BjsSync = t.mockAndRequireModule('filesystem/BjsSync').BjsSync
        BjsConfiguration = t.mockAndRequireModule('filesystem/configuration/BjsConfiguration').BjsConfiguration
        Bjs = t.requireModule('Bjs').Bjs
        log = {}
        bjs = new Bjs(log)
    })

    test('version', () => {
        expect(Bjs.version).toBe(t.requireModule('package.json').version)
    })

    test('info', () => {
        expect(Bjs.info).toBe(t.requireModule('package.json').description)
    })

    test('synchonize', async () => {
        const mockFn = t.mockFn()
        BjsConfiguration.fromPath = t.mockFn().mockImplementationOnce(path => {
            expect(path).toBe('some path')
            return 'some config'
        })
        BjsSync.mockImplementationOnce((config, aLog) => {
            expect(config).toBe('some config')
            expect(aLog).toBe(log)
            return {
                sync: async () => mockFn()
            }
        })
        await bjs.synchronize('some path')
        expect(mockFn).toHaveBeenCalledTimes(1)
    })
})