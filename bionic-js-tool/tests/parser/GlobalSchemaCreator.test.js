const t = require('../test-utils')

describe('GlobalSchemaCreator', () => {

    let GlobalSchemaCreator, ModuleSchemaCreator, ExportedFile

    beforeEach(() => {
        t.resetModulesCache()

        ModuleSchemaCreator = t.mockAndRequireModule('parser/ModuleSchemaCreator').ModuleSchemaCreator
        GlobalSchemaCreator = t.requireModule('parser/GlobalSchemaCreator').GlobalSchemaCreator
        ExportedFile = t.requireModule('filesystem/ExportedFile').ExportedFile
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

    test('getExportedFiles', async () => {
        const guestFile1 = {path: 'path1'}
        const guestFile2 = {path: 'path2'}
        const guestFile3 = {path: 'path3'}

        const schemaCreator = new GlobalSchemaCreator([guestFile1, guestFile2, guestFile3])

        let expectedModuleCreators
        const moduleCreator1 = {
            guestFile: guestFile1, getSchema: moduleCreators => {
                expect(moduleCreators).toStrictEqual(expectedModuleCreators)
                return 'Class1-schema'
            },
        }
        const moduleCreator2 = {
            guestFile: guestFile2, getSchema: moduleCreators => {
                expect(moduleCreators).toStrictEqual(expectedModuleCreators)
                return 'Class2-schema'
            },
        }
        expectedModuleCreators = [moduleCreator1, moduleCreator2]
        schemaCreator.getModuleCreators = async () => expectedModuleCreators

        const exportedFiles = await schemaCreator.getExportedFiles()
        expect(exportedFiles).toStrictEqual([
            new ExportedFile(guestFile1, 'Class1-schema'),
            new ExportedFile(guestFile2, 'Class2-schema'),
            new ExportedFile(guestFile3, null),
        ])
    })
})