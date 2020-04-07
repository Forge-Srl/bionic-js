const t = require('../../test-utils')

describe('TypeGeneratorFactory', () => {

    let mockedFactory

    beforeEach(() => {
        const TypeGeneratorFactory = t.requireModule('generation/factory/TypeGeneratorFactory').TypeGeneratorFactory

        class Schema {
            static get typeName() {
                return 'TypeName'
            }
        }

        mockedFactory = new TypeGeneratorFactory(new Schema())
        mockedFactory.language = 'Language'
    })

    test('generatorName', () => {
        expect(mockedFactory.generatorName).toBe('LanguageTypeNameTypeGenerator')
    })

    test('generatorPath', () => {
        expect(mockedFactory.generatorPath).toBe('../language/types/LanguageTypeNameTypeGenerator')
    })
})