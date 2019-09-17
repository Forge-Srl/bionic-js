const t = require('../../test-utils')
const parser = require('@babel/parser')
const MethodJsExplorer = t.requireModule('parser/jsExplorer/MethodJsExplorer').MethodJsExplorer
const ParameterExplorer = t.requireModule('parser/jsExplorer/ParameterExplorer').ParameterExplorer
const Parameter = t.requireModule('schema/Parameter').Parameter
const Method = t.requireModule('schema/Method').Method
const Property = t.requireModule('schema/Property').Property
const IntType = t.requireModule('schema/types/IntType').IntType
const VoidType = t.requireModule('schema/types/VoidType').VoidType
const LambdaType = t.requireModule('schema/types/LambdaType').LambdaType
const ArrayType = t.requireModule('schema/types/ArrayType').ArrayType
const ObjectType = t.requireModule('schema/types/ObjectType').ObjectType

describe('MethodJsExplorer', () => {

    function getExplorer(classBody) {
        const code = `class Class1 {${classBody}}`
        const classNode = parser.parse(code, {sourceType: 'module'}).program.body[0]
        return new MethodJsExplorer(classNode.body.body[0])
    }

    test('annotation', () => {
        const explorer = getExplorer(`
                /* Skipped annotation */
                // Annotation
                method1() {}`)
        expect(explorer.topCommentText).toEqual(' Annotation')
    })


    test('bionicTag', () => {
        const explorer = getExplorer('/* @bionic */ method1() {}')
        expect(explorer.bionicTag).toEqual({})
    })


    test('isToExport', () => {
        const explorer = new MethodJsExplorer()
        t.mockGetter(explorer, 'bionicTag', () => ({}))
        expect(explorer.isToExport).toEqual(true)
    })

    test('isToExport, not to export', () => {
        const explorer = new MethodJsExplorer()
        t.mockGetter(explorer, 'bionicTag', () => undefined)
        expect(explorer.isToExport).toEqual(false)
    })


    test('name of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.name).toBe('method1')
    })

    test('name of static getter', () => {
        const explorer = getExplorer('static get getter1() {}')
        expect(explorer.name).toBe('getter1')
    })


    test('kinds of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.kinds).toStrictEqual(['method'])
    })

    test('kind of constructor', () => {
        const explorer = getExplorer('constructor() {}')
        expect(explorer.kinds).toStrictEqual(['constructor'])
    })

    test('kind of setter', () => {
        const explorer = getExplorer('set setter1(value) {}')
        expect(explorer.kinds).toStrictEqual(['set'])
    })


    test('static of static method', () => {
        const explorer = getExplorer('static method1() {}')
        expect(explorer.isStatic).toBe(true)
    })

    test('static of getter', () => {
        const explorer = getExplorer('get getter1() {}')
        expect(explorer.isStatic).toBe(false)
    })


    test('generator of generator method', () => {
        const explorer = getExplorer('* generator1() {}')
        expect(explorer.isGenerator).toBe(true)
    })

    test('generator of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.isGenerator).toBe(false)
    })


    test('isAsync of async method', () => {
        const explorer = getExplorer('async async1() {}')
        expect(explorer.isAsync).toBe(true)
    })

    test('isAsync of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.isAsync).toBe(false)
    })


    test('parameterNodes of method', () => {
        const explorer = getExplorer('method1(parameter1, parameter2) {}')
        const parameters = explorer.parameterNodes

        expect(parameters.length).toBe(2)
        expect(parameters.map(par => par.name)).toEqual(['parameter1', 'parameter2'])
    })

    test('parameterNodes of getter', () => {
        const explorer = getExplorer('get getter1() {}')
        expect(explorer.parameterNodes.length).toBe(0)
    })


    test('parameters of method', () => {
        const explorer = getExplorer('method1(parameter1, parameter2) {}')
        const parameterExplorers = explorer.parameterExplorers

        expect(parameterExplorers.length).toBe(2)
        expect(parameterExplorers[0]).toBeInstanceOf(ParameterExplorer)
        expect(parameterExplorers[0].name).toBe('parameter1')
        expect(parameterExplorers[1].name).toBe('parameter2')
    })

    test('description', () => {
        const explorer = getExplorer('/* @desc desc */ method1() {}')
        expect(explorer.description).toEqual('desc')
    })

    test('description, not present', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.description).toEqual(undefined)
    })


    const typeAnnotation = '/* @bionic (par1: Int) */ method1(par1) {}'
    const expectedType = new LambdaType(new VoidType(), [new Parameter(new IntType(), 'par1', undefined)])
    test('type', () => {
        const explorer = getExplorer(typeAnnotation)
        const actualType = explorer.type

        expect(actualType).toEqual(expectedType)
        expect(explorer.type).toBe(actualType)
    })

    const typeMixedAnnotation = '/* @bionic (Int, par2: Int) */ method1(par1, par2) {}'
    const expectedMixedType = new LambdaType(new VoidType(), [
        new Parameter(new IntType(), 'par1', undefined),
        new Parameter(new IntType(), 'par2', undefined),
    ])
    test('type, annotation with mixed parameter definitions', () => {
        const explorer = getExplorer(typeMixedAnnotation)
        const actualType = explorer.type

        expect(actualType).toEqual(expectedMixedType)
        expect(explorer.type).toBe(actualType)
    })

    test('type, annotated parameters more than js parameters', () => {
        const explorer = getExplorer('/* @bionic (par1: Int) */ method1() {}')
        expect(() => explorer.type).toThrow('parameter of method "method1" mismatch from those declared in the annotation')
    })

    test('type, annotated parameters less than js parameters', () => {
        const explorer = getExplorer('/* @bionic () */ method1(par1) {}')
        expect(() => explorer.type).toThrow('parameter of method "method1" mismatch from those declared in the annotation')
    })

    test('type, annotated parameters with names different from js parameters', () => {
        const explorer = getExplorer('/* @bionic (par1: Int) */ method1(par2) {}')
        expect(() => explorer.type).toThrow('parameter of method "method1" mismatch from those declared in the annotation')
    })

    test('type, annotated parameters with names in different order from js parameters', () => {
        const explorer = getExplorer('/* @bionic (par1: Int, par2: Int) */ method1(par2, par1) {}')
        expect(() => explorer.type).toThrow('parameter of method "method1" mismatch from those declared in the annotation')
    })


    test('signature', () => {
        const explorer = getExplorer(typeMixedAnnotation)
        const actualSignature = explorer.signature

        expect(actualSignature).toEqual(expectedMixedType)
        expect(explorer.signature).toBe(actualSignature)
    })

    test('signature when type is not a lambda', () => {
        const explorer = getExplorer('/* @bionic Int */ method1() {}')
        expect(() => explorer.signature).toThrow()
    })


    test('schema without annotation', () => {
        const explorer = getExplorer(`method1() {}`)
        expect(explorer.schema).toBe(null)
    })

    test('schema of a method', () => {
        const schema = new Method('method1', 'Desc1', true, undefined, new ArrayType(new ArrayType(new IntType())), [])
        const explorer = getExplorer(`
            /* @bionic () => Array<Array<Int>>
             * @description Desc1
             */
            static method1() {}`)
        const actualSchema = explorer.schema

        expect(actualSchema).toEqual(schema)
    })

    test('schema of a getter property', () => {
        const schema = new Property('getterX', 'Description\nx', false, undefined, new IntType(), ['get'])
        const explorer = getExplorer(`
            /* @bionic Int
             * @description Description
             * x */
            get getterX() {}`)
        const actualSchema = explorer.schema

        expect(actualSchema).toEqual(schema)
    })

    test('schema of a static setter property', () => {
        const schema = new Property('setterX', 'Desc', true, undefined, new ObjectType('ClassX'), ['set'])
        const explorer = getExplorer(`
            /* @bionic ClassX
             * @description Desc 
             */
            static set setterX(value) {}`)
        const actualSchema = explorer.schema

        expect(actualSchema).toEqual(schema)
    })
})