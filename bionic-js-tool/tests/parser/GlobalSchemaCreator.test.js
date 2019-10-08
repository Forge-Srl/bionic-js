const t = require('../test-utils')

describe('GlobalSchemaCreator', () => {

    let GlobalSchemaCreator, ModuleSchemaCreator

    beforeEach(() => {
        t.resetModulesCache()

        ModuleSchemaCreator = t.mockAndRequireModule('parser/ModuleSchemaCreator').ModuleSchemaCreator

        GlobalSchemaCreator = t.requireModule('parser/GlobalSchemaCreator').GlobalSchemaCreator
    })

    test('moduleCreatorPromises', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        const guestFile1 = {isExportable: true}
        const guestFile2 = {isExportable: false}
        const guestFile3 = {isExportable: true}
        schemaCreator.guestFiles = [guestFile1, guestFile2, guestFile3]

        ModuleSchemaCreator.build.mockImplementationOnce(async guestFile => {
            expect(guestFile).toBe(guestFile1)
            return 'moduleSchemaCreator1'
        })

        ModuleSchemaCreator.build.mockImplementationOnce(async guestFile => {
            expect(guestFile).toBe(guestFile3)
            return 'moduleSchemaCreator3'
        })

        expect(await Promise.all(schemaCreator.moduleCreatorPromises)).toStrictEqual(
            ['moduleSchemaCreator1', 'moduleSchemaCreator3'])
    })

    test('getModuleCreators', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        const moduleCreator1 = {name: 'Class1', exporting: true}
        const moduleCreator2 = {name: 'Class2', exporting: false}
        const moduleCreator3 = {name: 'Class3', exporting: true}

        t.mockGetter(schemaCreator, 'moduleCreatorPromises', () => [
            (async () => moduleCreator1)(),
            (async () => moduleCreator2)(),
            (async () => moduleCreator3)(),
        ])

        const moduleCreators = await schemaCreator.getModuleCreators()

        expect(moduleCreators).toStrictEqual([moduleCreator1, moduleCreator3])
        expect(await schemaCreator.getModuleCreators()).toBe(moduleCreators)
    })

    test('getModuleCreators, class already exported', async () => {
        const schemaCreator = new GlobalSchemaCreator()
        const moduleCreator1 = {name: 'Class1', path: '/module1', exporting: true}
        const moduleCreator2 = {name: 'Class1', path: '/module2', exporting: true}

        t.mockGetter(schemaCreator, 'moduleCreatorPromises', () => [
            (async () => moduleCreator1)(),
            (async () => moduleCreator2)(),
        ])

        await expect(schemaCreator.getModuleCreators()).rejects
            .toThrow('class Class1 in module "/module2" was already exported in module "/module1"')
    })

    test('getGuestFileSchemas', async () => {
        const schemaCreator = new GlobalSchemaCreator()

        let expectedModuleCreators
        const moduleCreator1 = {
            guestFile: 'GuestFile1', getSchema: moduleCreators => {
                expect(moduleCreators).toStrictEqual(expectedModuleCreators)
                return 'Class1-schema'
            },
        }
        const moduleCreator2 = {
            guestFile: 'GuestFile2', getSchema: moduleCreators => {
                expect(moduleCreators).toStrictEqual(expectedModuleCreators)
                return 'Class2-schema'
            },
        }
        expectedModuleCreators = [moduleCreator1, moduleCreator2]
        schemaCreator.getModuleCreators = async () => expectedModuleCreators

        const guestFileSchemas = await schemaCreator.getGuestFileSchemas()
        expect(guestFileSchemas).toStrictEqual([
            {guestFile: 'GuestFile1', schema: 'Class1-schema'},
            {guestFile: 'GuestFile2', schema: 'Class2-schema'},
        ])
    })
})