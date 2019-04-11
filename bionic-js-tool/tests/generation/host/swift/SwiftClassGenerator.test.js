const t = require('../../../common')

describe('SwiftClassGenerator', () => {

    let swiftClassGeneratorPath, SwiftClassGenerator, CodeBlock, HostFile

    beforeEach(() => {

        swiftClassGeneratorPath = 'generation/host/swift/SwiftClassGenerator'
        SwiftClassGenerator = t.requireModule(swiftClassGeneratorPath)
        CodeBlock = t.requireModule('generation/code/CodeBlock')
        HostFile = t.requireModule('generation/host/HostFile')
    })

    test('getFiles', () => {

        const generator = new SwiftClassGenerator({name: 'ClassName'})
        generator.getHeaderCode = t.mockFn(() => CodeBlock.create().append('HeaderCode - '))
        generator.getPartsCode = t.mockFn((parts) => CodeBlock.create().append(`${parts}Code - `))
        t.mockGetter(generator, 'staticProperties', () => 'StaticProperties')
        t.mockGetter(generator, 'staticMethods', () => 'StaticMethods')
        t.mockGetter(generator, 'constructors', () => 'Constructors')
        t.mockGetter(generator, 'instanceProperties', () => 'InstanceProperties')
        t.mockGetter(generator, 'instanceMethods', () => 'InstanceMethods')
        generator.getFooterCode = t.mockFn(() => CodeBlock.create().append('FooterCode'))

        expect(generator.getFiles()).toEqual([new HostFile('ClassName.swift', 'HeaderCode - StaticPropertiesCode - ' +
            'StaticMethodsCode - ConstructorsCode - InstancePropertiesCode - InstanceMethodsCode - FooterCode')])
    })

    test('getHeaderCode without superclass', () => {
        const generator = new SwiftClassGenerator({name: 'ClassName', superClassName: null})
        const code = generator.getHeaderCode()

        t.expectCode(code,
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class ClassName: BjsClass {',
            '    ',
        )
    })

    test('getHeaderCode with superclass', () => {
        const generator = new SwiftClassGenerator({name: 'ClassName', superClassName: 'SuperclassName'})
        const code = generator.getHeaderCode()

        t.expectCode(code,
            'import JavaScriptCore',
            'import Bjs',
            '',
            'class ClassName: SuperclassName {',
            '    ',
        )
    })

    test('getPartsCode', () => {
        const getImplementation = t.mockFn(() => CodeBlock.create().append('PartCode'))
        const getSwiftGenerator = t.mockFn(() => ({getImplementation}))
        const part = {getSwiftGenerator}
        const parts = [part, part]

        const generator = new SwiftClassGenerator()
        const code = generator.getPartsCode(parts)

        t.expectCode(code,
            'PartCode',
            '',
            'PartCode',
            '',
            '',
        )
    })

    test('getFooter without superclass', () => {
        const generator = new SwiftClassGenerator({name: 'ClassName', superClassName: null, modulePath: 'module/path'})
        const code = CodeBlock.create(1).append(generator.getFooterCode())

        t.expectCode(code,
            '    class func bjsFactory(_ jsObject: JSValue) -> ClassName {',
            '        return ClassName(jsObject)',
            '    }',
            '    ',
            '    class var bjsModulePath: String {',
            '        return "module/path"',
            '    }',
            '}',
        )
    })

    test('getFooter with superclass', () => {
        const generator = new SwiftClassGenerator({
            name: 'ClassName', superClassName: 'SuperclassName', modulePath: 'module/path',
        })
        const code = CodeBlock.create(1).append(generator.getFooterCode())

        t.expectCode(code,
            '    override class func bjsFactory(_ jsObject: JSValue) -> ClassName {',
            '        return ClassName(jsObject)',
            '    }',
            '    ',
            '    override class var bjsModulePath: String {',
            '        return "module/path"',
            '    }',
            '}',
        )
    })

    test('staticProperties', () => {
        const property1 = {isStatic:true}
        const property2 = {isStatic:false}
        const property3 = {isStatic:true}
        const generator = new SwiftClassGenerator({properties: [property1, property2, property3]})

        expect(generator.staticProperties).toEqual([property1, property3])
    })

    test('staticMethods', () => {
        const method1 = {isStatic:true}
        const method2 = {isStatic:false}
        const method3 = {isStatic:true}
        const generator = new SwiftClassGenerator({methods: [method1, method2, method3]})

        expect(generator.staticMethods).toEqual([method1, method3])
    })

    test('constructors', () => {
        const generator = new SwiftClassGenerator({constructor: 'constructor'})

        expect(generator.constructors).toEqual(['constructor'])
    })

    test('instanceProperties', () => {
        const property1 = {isStatic:true}
        const property2 = {isStatic:false}
        const property3 = {isStatic:true}
        const generator = new SwiftClassGenerator({properties: [property1, property2, property3]})

        expect(generator.instanceProperties).toEqual([property2])
    })

    test('instanceMethods', () => {
        const method1 = {isStatic:true}
        const method2 = {isStatic:false}
        const method3 = {isStatic:true}
        const generator = new SwiftClassGenerator({methods: [method1, method2, method3]})

        expect(generator.instanceMethods).toEqual([method2])
    })
})