const t = require('../test-utils')

describe('ModuleSchemaCreator', () => {

    let parser, ModuleExplorer, ClassSchemaCreator, ModuleSchemaCreator

    beforeEach(() => {
        t.resetModulesCache()

        parser = t.mockAndRequire('@babel/parser')
        ModuleExplorer = t.mockAndRequireModule('parser/jsExplorer/ModuleExplorer').ModuleExplorer
        ClassSchemaCreator = t.mockAndRequireModule('parser/ClassSchemaCreator').ClassSchemaCreator

        ModuleSchemaCreator = t.requireModule('parser/ModuleSchemaCreator').ModuleSchemaCreator
    })

    test('build', async () => {
        const guestFile = {getContent: async () => 'jsContent', relativePath: 'relativePath'}

        parser.parse = (input, options) => {
            expect(input).toBe('jsContent')
            expect(options).toEqual({sourceType: 'module'})
            return 'parsedNode'
        }

        ModuleExplorer.mockImplementationOnce((node, modulePath) => {
            expect(node).toBe('parsedNode')
            expect(modulePath).toBe('relativePath')
            return {classExplorers: 'classExplorers'}
        })

        const moduleCreator = await ModuleSchemaCreator.build(guestFile)

        expect(moduleCreator).toBeInstanceOf(ModuleSchemaCreator)
        expect(moduleCreator.guestFile).toBe(guestFile)
        expect(moduleCreator.classExplorers).toBe('classExplorers')
    })


    test('exporting', () => {
        const moduleCreator = new ModuleSchemaCreator(null, ['classExplorer'])
        expect(moduleCreator.exporting).toBe(true)
    })

    test('exporting, not exporting', () => {
        const moduleCreator = new ModuleSchemaCreator(null, [])
        expect(moduleCreator.exporting).toBe(false)
    })


    test('classSchemaCreator', () => {
        const moduleCreator = new ModuleSchemaCreator(null, ['classExplorer1'])
        const classCreator = {classSchema: 'creator'}

        ClassSchemaCreator.mockImplementationOnce(classExplorer => {
            expect(classExplorer).toBe('classExplorer1')
            return classCreator
        })

        expect(moduleCreator.classSchemaCreator).toBe(classCreator)
        expect(moduleCreator.classSchemaCreator).toBe(classCreator) // Singleton
    })

    test('classSchemaCreator, more class explorers', () => {
        const guestFile = {relativePath: 'modulePath'}
        const moduleCreator = new ModuleSchemaCreator(guestFile, ['classExplorer1', 'classExplorer2'])

        expect(() => moduleCreator.classSchemaCreator)
            .toThrow('cannot export more than one class from the module "modulePath"')
    })

    test('name', () => {
        const moduleCreator = new ModuleSchemaCreator()
        t.mockGetter(moduleCreator, 'classSchemaCreator', () => ({name: 'ClassName'}))

        expect(moduleCreator.name).toBe('ClassName')
    })

    test('path', () => {
        const guestFile = {relativePath: 'path'}
        const moduleCreator = new ModuleSchemaCreator(guestFile)

        expect(moduleCreator.path).toBe('path')
    })

    test('getSchema', () => {
        const moduleCreator = new ModuleSchemaCreator()
        t.mockGetter(moduleCreator, 'isNative', () => false)
        t.mockGetter(moduleCreator, 'classSchemaCreator', () => ({
            getSchema: moduleCreators => {
                expect(moduleCreators).toBe('moduleCreators')
                return 'classSchema'
            },
        }))

        expect(moduleCreator.getSchema('moduleCreators')).toBe('classSchema')
    })
})