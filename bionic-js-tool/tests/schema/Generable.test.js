const t = require('../test-utils')

describe('Generable', () => {

    let Generable, GeneratorFactory

    beforeEach(() => {
        Generable = t.requireModule('schema/Generable').Generable
        GeneratorFactory = t.requireModule('generation/factory/GeneratorFactory').GeneratorFactory
    })

    test('generator', () => {
        expect(new Generable().generator).toBeInstanceOf(GeneratorFactory)
    })

    test('dependingTypes', () => {
        expect(new Generable().dependingTypes).toStrictEqual([])
    })
})