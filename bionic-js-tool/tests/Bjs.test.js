const t = require('./test-utils')

describe('Bjs', () => {

    let Bjs, BjsInit, BjsSync, BjsConfiguration, log, bjs

    beforeEach(() => {
        t.resetModulesCache()

        BjsInit = t.mockAndRequireModule('filesystem/BjsInit').BjsInit
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

    test('bjsSyncFromPath', () => {
        log.info = t.mockFn()
        Bjs.version = '00000'
        BjsConfiguration.fromPath = t.mockFn().mockImplementationOnce(path => {
            expect(path).toBe('some path')
            return 'some config'
        })
        BjsSync.mockImplementationOnce((config, aLog) => {
            expect(config).toBe('some config')
            expect(aLog).toBe(log)
            return {dummy: 'bjsSync'}
        })

        expect(bjs.bjsSyncFromPath('some path')).toStrictEqual({dummy: 'bjsSync'})
        expect(log.info).toHaveBeenCalledWith(`bionic.js - v${t.requireModule('package.json').version}\n\n`)
    })

    test('initializeConfiguration', async () => {
        const init = t.mockFn()
        BjsInit.mockImplementationOnce((aLog) => {
            expect(aLog).toBe(log)
            return {init}
        })
        await bjs.initializeConfiguration('some path', 'minimal config')
        expect(init).toHaveBeenCalledTimes(1)
        expect(init).toHaveBeenCalledWith('some path', 'minimal config')
    })

    describe('synchonize', () => {
        let sync, clean

        beforeEach(() => {
            sync = t.mockFn()
            clean = t.mockFn()
            bjs.bjsSyncFromPath = (path) => {
                expect(path).toBe('some path')
                return {sync, clean}
            }
        })

        test('without clean', async () => {
            await bjs.synchronize('some path', false)
            expect(clean).not.toHaveBeenCalled()
            expect(sync).toHaveBeenCalledTimes(1)
        })

        test('with clean', async () => {
            await bjs.synchronize('some path', true)
            expect(clean).toHaveBeenCalledTimes(1)
            expect(sync).toHaveBeenCalledTimes(1)
            expect(clean).toHaveBeenCalledBefore(sync)
        })
    })

    test('clean', async () => {
        const clean = t.mockFn()
        bjs.bjsSyncFromPath = (path) => {
            expect(path).toBe('some path')
            return {clean}
        }
        await bjs.clean('some path')
        expect(clean).toHaveBeenCalledTimes(1)
    })
})