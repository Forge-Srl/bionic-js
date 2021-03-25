const t = require('../test-utils')

describe('Log', () => {

    let stdoutWrite, stderrWrite, log, Log

    beforeEach(() => {
        stdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => null)
        stderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation(() => null)

        Log = t.requireModule('filesystem/Log').Log
        log = new Log()
    })

    afterEach(() => {
        stdoutWrite.mockRestore()
        stderrWrite.mockRestore()
    })

    test('info', () => {
        log.info('msg1')
        log.info('msg2')

        expect(log.infoLog).toBe('msg1msg2')

        expect(stderrWrite).toHaveBeenCalledTimes(0)

        expect(stdoutWrite).toHaveBeenCalledTimes(2)
        expect(stdoutWrite).toHaveBeenCalledWith('msg1')
        expect(stdoutWrite).toHaveBeenCalledWith('msg2')
    })

    test('warning', () => {
        log.warning('msg1')
        log.warning('msg2')

        expect(log.warningLog).toBe('msg1msg2')

        expect(stderrWrite).toHaveBeenCalledTimes(0)

        expect(stdoutWrite).toHaveBeenCalledTimes(2)
        expect(stdoutWrite).toHaveBeenCalledWith('\u001b[33mmsg1\u001b[39m')
        expect(stdoutWrite).toHaveBeenCalledWith('\u001b[33mmsg2\u001b[39m')
    })

    test('error', () => {
        log.error('msg1')
        log.error('msg2')

        expect(log.errorLog).toBe('msg1msg2')

        expect(stderrWrite).toHaveBeenCalledTimes(2)
        expect(stderrWrite).toHaveBeenCalledWith('\u001b[31mmsg1\u001b[39m')
        expect(stderrWrite).toHaveBeenCalledWith('\u001b[31mmsg2\u001b[39m')

        expect(stdoutWrite).toHaveBeenCalledTimes(0)
    })

    test('debug log', () => {
        const log = new Log(true)

        log.info('info')
        log.warning('warning')
        log.error('error')

        expect(log.infoLog).toBe('info')
        expect(log.warningLog).toBe('warning')
        expect(log.errorLog).toBe('error')

        expect(stderrWrite).toHaveBeenCalledTimes(0)
        expect(stdoutWrite).toHaveBeenCalledTimes(0)
    })
})