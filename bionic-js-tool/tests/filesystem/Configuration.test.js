const t = require('../test-utils')

describe('Configuration', () => {

    let Configuration

    beforeEach(() => {
        Configuration = t.requireModule('filesystem/Configuration').Configuration
    })

    test('guestNativeDirPath', () => {
        const config = new Configuration({guestDirPath: '/guest/path', nativeDirName: 'nativeDirName'})
        expect(config.guestNativeDirPath).toBe('/guest/path/nativeDirName')
    })

    test('guestNativeDirPath, nativeDirName with sub dir', () => {
        const config = new Configuration({guestDirPath: '/guest/path', nativeDirName: './sub/dir/nativeDirName'})
        expect(config.guestNativeDirPath).toBe('/guest/path/sub/dir/nativeDirName')
    })

    test('guestNativeDirPath, missing nativeDirName', () => {
        const config = new Configuration({guestDirPath: '/guest/path'})
        expect(config.guestNativeDirPath).toBe('/guest/path/native')
    })

    test('guestNativeDirPath, nativeDirName out of guestDir', () => {
        const config = new Configuration({guestDirPath: '/guest/path', nativeDirName: '../nativeDirName'},
            '/config/path')
        expect(() => config.guestNativeDirPath).toThrow('config file "/config/path" -> "nativeDirName" must be a directory inside "/guest/path"')
    })
})