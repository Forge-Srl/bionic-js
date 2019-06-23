const t = require('../test-utils')

describe('MultiTargetGenerable', () => {

    let MultiTargetGenerable, MultiTargetGeneratorFactory

    beforeEach(() => {
        MultiTargetGenerable = t.requireModule('schema/MultiTargetGenerable').MultiTargetGenerable
        MultiTargetGeneratorFactory = t.requireModule('generation/factory/MultiTargetGeneratorFactory').MultiTargetGeneratorFactory
    })

    test('generator', () => {
        expect(new MultiTargetGenerable().generator).toBeInstanceOf(MultiTargetGeneratorFactory)
    })
})