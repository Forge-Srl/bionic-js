const t = require('../test-utils')

describe('Configuration', () => {

    let Configuration

    beforeEach(() => {
        Configuration = t.requireModule('filesystem/configuration/Configuration').Configuration
    })

    test('guestDirPath', () => {
        const config = new Configuration({guestDirPath: '/guest/path'})
        expect(config.guestDirPath).toBe('/guest/path')
    })
})