const t = require('../test-utils')

describe('ModuleSchemaCreator', () => {

    let parser, ModuleSchemaCreator, ModuleExplorer, ClassSchemaCreator

    beforeEach(() => {
        t.resetModulesCache()

        parser = t.mockAndRequire('@babel/parser')
        ClassSchemaCreator = t.mockAndRequireModule('parser/ClassSchemaCreator').ClassSchemaCreator

        ModuleSchemaCreator = t.requireModule('parser/ModuleSchemaCreator').ModuleSchemaCreator
        ModuleExplorer = t.requireModule('parser/jsExplorer/ModuleExplorer').ModuleExplorer
    })

    test('getModuleExplorer', async () => {
        const guestFile = {getContent: async () => 'jsContent', relativePath: 'relativePath'}
        const schemaCreator = new ModuleSchemaCreator(guestFile)

        parser.parse = (input, options) => {
            expect(input).toBe('jsContent')
            expect(options).toEqual({sourceType: 'module'})
            return 'parsedNode'
        }

        const explorer = await schemaCreator.getModuleExplorer()
        expect(explorer).toStrictEqual(new ModuleExplorer('parsedNode', 'relativePath'))

        expect(await schemaCreator.getModuleExplorer()).toBe(explorer)
    })

    test('getModuleExplorer, parsing error', async () => {
        const guestFile = {getContent: async () => 'jsContent', relativePath: 'relativePath'}
        const schemaCreator = new ModuleSchemaCreator(guestFile)

        parser.parse = () => {
            throw new Error('inner error')
        }

        await expect(schemaCreator.getModuleExplorer()).rejects.toThrow('parsing the file "relativePath"\ninner error')
    })

    test('getClassSchemaCreators, more class explorers', async () => {
        const guestFile = {relativePath: 'relativePath'}
        const schemaCreator = new ModuleSchemaCreator(guestFile)
        const moduleExplorer = {
            classExplorers: ['explorer1', 'explorer2'],
        }
        schemaCreator.getModuleExplorer = async () => moduleExplorer

        await expect(schemaCreator.getClassSchemaCreators()).rejects
            .toThrow('cannot export more than one class from the module "relativePath"')
    })

    test('getClassSchemaCreators', async () => {
        const schemaCreator = new ModuleSchemaCreator()
        const moduleExplorer = {
            classExplorers: ['classExplorer'],
        }
        schemaCreator.getModuleExplorer = async () => moduleExplorer

        const classSchemaCreator = {classSchemaCreator: true}
        ClassSchemaCreator.mockImplementationOnce((classExplorer) => {
            expect(classExplorer).toBe('classExplorer')
            return classSchemaCreator
        })

        expect(await schemaCreator.getClassSchemaCreators())
            .toStrictEqual([classSchemaCreator])
    })
})