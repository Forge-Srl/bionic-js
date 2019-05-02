const t = require('../test-utils')

describe('Generable', () => {

    let Generable, GeneratorFactory

    beforeEach(() => {
        Generable = t.requireModule('schema/Generable')
        GeneratorFactory = t.requireModule('generation/factory/GeneratorFactory')
    })

    test('generator', () => {
        expect(new Generable().generator).toBeInstanceOf(GeneratorFactory)
    })
})