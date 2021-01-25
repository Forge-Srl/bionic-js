const t = require('../test-utils')
const path = require('path')

describe('Class', () => {

    let Class, Constructor, Property, Method, IntType, VoidType

    beforeEach(() => {
        Class = t.requireModule('schema/Class').Class
        Constructor = t.requireModule('schema/Constructor').Constructor
        Property = t.requireModule('schema/Property').Property
        Method = t.requireModule('schema/Method').Method
        IntType = t.requireModule('schema/types/IntType').IntType
        VoidType = t.requireModule('schema/types/VoidType').VoidType
    })

    test('schemaName', () => {
        expect(Class.schemaName).toBe('Class')
    })

    test('isValid', () => {
        t.resetModulesCache()

        const Validation = t.mockAndRequireModule('schema/Validation').Validation
        Validation.validateIdentifier.mockReturnValueOnce('isValid')

        Class = t.requireModule('schema/Class').Class
        const actualClass = new Class('ClassName')

        expect(actualClass.isValid).toBe('isValid')
        expect(Validation.validateIdentifier).toBeCalledWith('class name', 'ClassName')
    })

    test('moduleLoadingPath', () => {
        const expectedModuleLoadingPath = '/relative/filePath'

        const clazz = new Class()
        clazz.modulePath = 'relative/filePath'
        expect(clazz.moduleLoadingPath).toBe(expectedModuleLoadingPath)

        clazz.modulePath = `${path.sep}relative//../relative${path.sep}filePath.js`
        expect(clazz.moduleLoadingPath).toBe(expectedModuleLoadingPath)
    })

    test('getRelativeModuleLoadingPath', () => {
        const relativeModuleClass = new Class()
        relativeModuleClass.modulePath = 'relative/moduleR/filePath'

        const clazz = new Class()
        clazz.modulePath = 'relative/moduleR/otherFile'
        expect(clazz.getRelativeModuleLoadingPath(relativeModuleClass)).toBe('./filePath')

        clazz.modulePath = 'relative/module1/otherFile'
        expect(clazz.getRelativeModuleLoadingPath(relativeModuleClass)).toBe(`../moduleR/filePath`)

        clazz.modulePath = 'relative//../relative/src/module1/otherFile.js'
        expect(clazz.getRelativeModuleLoadingPath(relativeModuleClass)).toBe(`../../moduleR/filePath`)


        relativeModuleClass.modulePath = '/relative/moduleR/filePath'

        clazz.modulePath = '/relative/moduleR/otherFile'
        expect(clazz.getRelativeModuleLoadingPath(relativeModuleClass)).toBe('./filePath')

        clazz.modulePath = '/relative/module1/otherFile'
        expect(clazz.getRelativeModuleLoadingPath(relativeModuleClass)).toBe(`../moduleR/filePath`)
    })

    test('dependingTypes', () => {
        const clazz = new Class('', '', [
            {dependingTypes: ['type1c']},
            {dependingTypes: ['type2c', 'type3c']},
        ], [
            {dependingTypes: ['type1p']},
        ], [
            {dependingTypes: ['type1m', 'type2m']},
            {dependingTypes: []},
        ], null, false, '')
        expect(clazz.dependingTypes).toStrictEqual([
            'type1c', 'type2c', 'type3c', 'type1p', 'type1m', 'type2m'
        ])
    })

    test('resolveClassType', () => {
        const constructor = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedConstructor'
            },
        }
        const property = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedProperty'
            },
        }
        const method = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedMethod'
            },
        }
        const clazz = new Class('name', 'desc', [constructor], [property], [method], null, false, 'modulePath')
        expect(clazz.resolveClassType('nativeClassesMap'))
            .toStrictEqual(new Class('name', 'desc', ['resolvedConstructor'], ['resolvedProperty'], ['resolvedMethod'],
                null, false, 'modulePath'))
    })
})