const t = require('../test-utils')

describe('AnnotatedGuestFile', () => {

    let AnnotatedGuestFile

    beforeEach(() => {
        AnnotatedGuestFile = t.requireModule('filesystem/AnnotatedGuestFile').AnnotatedGuestFile
    })

    test('constructor', () => {
        const annotatedFile = new AnnotatedGuestFile('guestFile', 'schema')

        expect(annotatedFile.guestFile).toBe('guestFile')
        expect(annotatedFile.schema).toBe('schema')
    })

    test('exportsClass, with schema', () => {
        const annotatedFile = new AnnotatedGuestFile(undefined, 'schema')
        expect(annotatedFile.exportsClass).toBe(true)
    })

    test('exportsClass, without schema', () => {
        const annotatedFile = new AnnotatedGuestFile(undefined)
        expect(annotatedFile.exportsClass).toBe(false)
    })

    const exportsNativeClassCases = [
        {exportsClass: true, schemaIsNative: true, expectedValue: true},
        {exportsClass: false, schemaIsNative: true, expectedValue: false},
        {exportsClass: true, schemaIsNative: false, expectedValue: false},
        {exportsClass: false, schemaIsNative: false, expectedValue: false},
    ]

    for (const testCase of exportsNativeClassCases) {
        test('exportsNativeClass, requires host file: ' + testCase.exportsClass + ', schema is native: ' +
            testCase.schemaIsNative,
            () => {
                const annotatedFile = new AnnotatedGuestFile(undefined, {isNative: testCase.schemaIsNative})
                t.mockGetter(annotatedFile, 'exportsClass', () => testCase.exportsClass)
                expect(annotatedFile.exportsNativeClass).toBe(testCase.expectedValue)
            })
    }

    test('resolveClassType, with schema', () => {
        const schema = {
            resolveClassType: nativeClassesMap => {
                expect(nativeClassesMap).toBe('nativeClassesMap')
                return 'resolvedSchema'
            },
        }
        const annotatedFile = new AnnotatedGuestFile('guestFile', schema)
        expect(annotatedFile.resolveClassType('nativeClassesMap'))
            .toStrictEqual(new AnnotatedGuestFile('guestFile', 'resolvedSchema'))
    })

    test('resolveClassType, without schema', () => {
        const annotatedFile = new AnnotatedGuestFile('guestFile', null)

        const actualAnnotatedFile = annotatedFile.resolveClassType('nativeClassesMap')
        expect(actualAnnotatedFile).toStrictEqual(annotatedFile)
        expect(actualAnnotatedFile).not.toBe(annotatedFile)
    })
})