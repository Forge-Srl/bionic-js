const t = require('../test-utils')

describe('GlobalSchemaCreator', () => {

    let GlobalSchemaCreator, ModuleSchemaCreator

    beforeEach(() => {
        t.resetModulesCache()

        ModuleSchemaCreator = t.mockAndRequireModule('parser/ModuleSchemaCreator').ModuleSchemaCreator

        GlobalSchemaCreator = t.requireModule('parser/GlobalSchemaCreator').GlobalSchemaCreator
    })

    test('getClassSchemaCreators', async () => {

        const schemaCreator = new GlobalSchemaCreator(['guestFile1', 'guestFile2'])

        ModuleSchemaCreator.mockImplementationOnce(guestFile => {
            expect(guestFile).toBe('guestFile1')
            return {getClassSchemaCreators: async () => 'Guest1Schema'}
        })

        ModuleSchemaCreator.mockImplementationOnce(guestFile => {
            expect(guestFile).toBe('guestFile2')
            return {getClassSchemaCreators: async () => 'Guest2Schema'}
        })

        const schemaCreators = await schemaCreator.getClassSchemaCreators()
        expect(schemaCreators).toStrictEqual(['Guest1Schema', 'Guest2Schema'])
    })

    test('getClassSchemas, repeated class', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        schemaCreator.getClassSchemaCreators = async () =>
            [{name: 'name1', modulePath: 'path1'}, {name: 'name1', modulePath: 'path2'}]

        await expect(schemaCreator.getClassSchemas()).rejects.toEqual(new Error('Class name1 in module "path2" was alreadyexported in module "path1"'))
    })

    test('getClassSchemas', async () => {
        const schemaCreator = new GlobalSchemaCreator()

        const creator1 = {
            name: 'name1', getSchema: classSchemaCreators => {
                expect([...classSchemaCreators]).toStrictEqual([['name1', creator1], ['name2', creator2]])
                return 'schema1'
            },
        }

        const creator2 = {
            name: 'name2', getSchema: classSchemaCreators => {
                expect([...classSchemaCreators]).toStrictEqual([['name1', creator1], ['name2', creator2]])
                return 'schema2'
            },
        }
        schemaCreator.getClassSchemaCreators = async () => [creator1, creator2]

        expect(await schemaCreator.getClassSchemas()).toStrictEqual(['schema1', 'schema2'])
    })
})