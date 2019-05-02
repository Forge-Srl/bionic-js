const t = require('../test-utils')

describe('MultiTargetGenerable', () => {

    let MultiTargetGenerable, MultiTargetGeneratorFactory

    beforeEach(() => {
        MultiTargetGenerable = t.requireModule('schema/MultiTargetGenerable')
        MultiTargetGeneratorFactory = t.requireModule('generation/factory/MultiTargetGeneratorFactory')
    })

    test('generator', () => {
        expect(new MultiTargetGenerable().generator).toBeInstanceOf(MultiTargetGeneratorFactory)
    })
})