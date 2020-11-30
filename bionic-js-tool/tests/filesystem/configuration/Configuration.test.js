const t = require('../../test-utils')

describe('Configuration', () => {

    let Configuration

    beforeEach(() => {
        Configuration = t.requireModule('filesystem/configuration/Configuration').Configuration
    })

    test('validate', () => {
        const config = new Configuration({mandatory1: 1}, 'locator', ['optional1'], ['mandatory1'])
        t.mockGetter(config, 'optional1', () => null)
        t.mockGetter(config, 'mandatory1', () => null)
        config.validate()
        expect(config.optional1_get).toHaveBeenCalledTimes(1)
        expect(config.mandatory1_get).toHaveBeenCalledTimes(1)
    })

    test('validate, no keys to validate', () => {
        const config = new Configuration({}, 'locator')
        config.validate()
    })

    test('validate, no getters for keys', () => {
        const config = new Configuration({mandatory1: 1}, 'locator', ['optional1'], ['mandatory1'])
        config.validate()
    })

    test('validate, missing mandatory keys', () => {
        const config = new Configuration({}, 'locator', [], ['mandatory1, mandatory2'])
        t.mockGetter(config, 'mandatory1', () => {})
        expect(() => config.validate()).toThrow('locator -> missing keys: "mandatory1, mandatory2"')
        expect(config.mandatory1_get).not.toHaveBeenCalled()
    })


    test('validate, keys getters throwing', () => {
        const config = new Configuration({mandatory1: 1}, 'locator', ['optional1'], ['mandatory1'])
        t.mockGetter(config, 'optional1', () => {throw new Error('optionalKeyError')})
        t.mockGetter(config, 'mandatory1', () => {throw new Error('mandatoryKeyError')})
        expect(() => config.validate()).toThrow('mandatoryKeyError\noptionalKeyError')
    })
})