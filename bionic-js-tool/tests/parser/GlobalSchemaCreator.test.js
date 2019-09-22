const t = require('../test-utils')

describe('GlobalSchemaCreator', () => {

    let GlobalSchemaCreator, ModuleSchemaCreator

    beforeEach(() => {
        t.resetModulesCache()

        ModuleSchemaCreator = t.mockAndRequireModule('parser/ModuleSchemaCreator').ModuleSchemaCreator

        GlobalSchemaCreator = t.requireModule('parser/GlobalSchemaCreator').GlobalSchemaCreator
    })

    test('getGuestFilesWithSchemaCreatorsPromises', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        const guestFile1 = {isExportable: true}
        const guestFile2 = {isExportable: false}
        const guestFile3 = {isExportable: true}
        schemaCreator.guestFiles = [guestFile1, guestFile2, guestFile3]

        ModuleSchemaCreator.mockImplementationOnce(guestFile => {
            expect(guestFile).toBe(guestFile1)
            return {getClassSchemaCreators: async () => ['classSchemaCreator1', 'classSchemaCreator2']}
        })

        ModuleSchemaCreator.mockImplementationOnce(guestFile => {
            expect(guestFile).toBe(guestFile3)
            return {getClassSchemaCreators: async () => []}
        })

        expect(await Promise.all(schemaCreator.getGuestFilesWithSchemaCreatorsPromises)).toStrictEqual(
            [{guestFile: guestFile1, classSchemaCreator: 'classSchemaCreator1'}, undefined])
    })

    test('getGuestFilesWithSchemaCreators', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        const guestFileWithSchemaCreator1 = {guestFile: 'guestFile1', classSchemaCreator: {name: 'Class1'}}
        const guestFileWithSchemaCreator2 = {guestFile: 'guestFile3', classSchemaCreator: {name: 'Class3'}}
        t.mockGetter(schemaCreator, 'getGuestFilesWithSchemaCreatorsPromises', () => [
            (async () => guestFileWithSchemaCreator1)(),
            (async () => undefined)(),
            (async () => guestFileWithSchemaCreator2)(),
        ])

        const guestFilesWithSchemaCreators = await schemaCreator.getGuestFilesWithSchemaCreators()

        expect(guestFilesWithSchemaCreators).toStrictEqual([guestFileWithSchemaCreator1, guestFileWithSchemaCreator2])
        expect(await schemaCreator.getGuestFilesWithSchemaCreators()).toBe(guestFilesWithSchemaCreators)
    })

    test('getGuestFilesWithSchemaCreators, class already exported', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        const guestFileWithSchemaCreator1 = {
            guestFile: 'guestFile1',
            classSchemaCreator: {name: 'Class1', modulePath: '/module1'},
        }
        const guestFileWithSchemaCreator2 = {
            guestFile: 'guestFile1',
            classSchemaCreator: {name: 'Class1', modulePath: '/module2'},
        }
        t.mockGetter(schemaCreator, 'getGuestFilesWithSchemaCreatorsPromises', () => [
            (async () => guestFileWithSchemaCreator1)(),
            (async () => guestFileWithSchemaCreator2)(),
        ])

        await expect(schemaCreator.getGuestFilesWithSchemaCreators()).rejects
            .toThrow('class Class1 in module "/module2" was already exported in module "/module1"')
    })

    test('getGuestFilesWithSchemas', async () => {
        const schemaCreator = new GlobalSchemaCreator()

        let expectedClassSchemaCreators
        const classSchemaCreator1 = {
            name: 'Class1', getSchema: classSchemaCreators => {
                expect(classSchemaCreators).toStrictEqual(expectedClassSchemaCreators)
                return 'Class1-schema'
            },
        }
        const classSchemaCreator2 = {
            name: 'Class2',
            getSchema: classSchemaCreators => {
                expect(classSchemaCreators).toStrictEqual(expectedClassSchemaCreators)
                return 'Class2-schema'
            },
        }
        expectedClassSchemaCreators = new Map([['Class1', classSchemaCreator1], ['Class2', classSchemaCreator2]])

        schemaCreator.getGuestFilesWithSchemaCreators = async () => [
            {guestFile: 'guestFile1', classSchemaCreator: classSchemaCreator1},
            {guestFile: 'guestFile2', classSchemaCreator: classSchemaCreator2},
        ]

        const guestFilesWithSchemas = await schemaCreator.getGuestFilesWithSchemas()

        expect(guestFilesWithSchemas).toStrictEqual([
            {guestFile: 'guestFile1', schema: 'Class1-schema'},
            {guestFile: 'guestFile2', schema: 'Class2-schema'},
        ])
    })

    test('getGuestFilesWithSchemas, getSchema error', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        const classSchemaCreator1 = {
            name: 'Class1', getSchema: () => {
                throw new Error('problem in getSchema()')
            },
        }
        schemaCreator.getGuestFilesWithSchemaCreators = async () => [
            {guestFile: {path: '/guestFile'}, classSchemaCreator: classSchemaCreator1},
        ]

        await expect(schemaCreator.getGuestFilesWithSchemas()).rejects.toThrow(
            'extracting schema from class Class1 in module "/guestFile"\n' +
            'Error: problem in getSchema()')
    })

})