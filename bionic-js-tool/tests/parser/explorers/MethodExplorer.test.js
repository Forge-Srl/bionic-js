const t = require('../../test-utils')
const parser = require('@babel/parser')
const MethodExplorer = t.requireModule('parser/explorers/MethodExplorer')
const ParameterExplorer = t.requireModule('parser/explorers/ParameterExplorer')
const Parameter = t.requireModule('schema/Parameter')
const Method = t.requireModule('schema/Method')
const Property = t.requireModule('schema/Property')
const IntType = t.requireModule('schema/types/IntType')
const VoidType = t.requireModule('schema/types/VoidType')
const LambdaType = t.requireModule('schema/types/LambdaType')
const ArrayType = t.requireModule('schema/types/ArrayType')
const ObjectType = t.requireModule('schema/types/ObjectType')

describe('MethodExplorer', () => {

    function getExplorer(classBody) {
        const code = `class Class1 {${classBody}}`
        const classNode = parser.parse(code, {sourceType: 'module'}).program.body[0]
        return new MethodExplorer(classNode.body.body[0])
    }

    test('annotation', () => {
        const explorer = getExplorer(`
                /* Skipped annotation */
                // Annotation
                method1() {}`)
        expect(explorer.topCommentText).toEqual(' Annotation')
    })


    test('name of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.name).toBe('method1')
    })

    test('name of static getter', () => {
        const explorer = getExplorer('static get getter1() {}')
        expect(explorer.name).toBe('getter1')
    })


    test('kind of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.kind).toBe('method')
    })

    test('kind of constructor', () => {
        const explorer = getExplorer('constructor() {}')
        expect(explorer.kind).toBe('constructor')
    })

    test('kind of setter', () => {
        const explorer = getExplorer('set setter1(value) {}')
        expect(explorer.kind).toBe('set')
    })


    test('static of static method', () => {
        const explorer = getExplorer('static method1() {}')
        expect(explorer.static).toBe(true)
    })

    test('static of getter', () => {
        const explorer = getExplorer('get getter1() {}')
        expect(explorer.static).toBe(false)
    })


    test('generator of generator method', () => {
        const explorer = getExplorer('* generator1() {}')
        expect(explorer.generator).toBe(true)
    })

    test('generator of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.generator).toBe(false)
    })


    test('async of async method', () => {
        const explorer = getExplorer('async async1() {}')
        expect(explorer.async).toBe(true)
    })

    test('async of method', () => {
        const explorer = getExplorer('method1() {}')
        expect(explorer.async).toBe(false)
    })


    test('parametersNodes of method', () => {
        const explorer = getExplorer('method1(parameter1, parameter2) {}')
        const parameters = explorer.parametersNodes

        expect(parameters.length).toBe(2)
        expect(parameters.map(par => par.name)).toEqual(['parameter1', 'parameter2'])
    })

    test('parametersNodes of getter', () => {
        const explorer = getExplorer('get getter1() {}')
        expect(explorer.parametersNodes.length).toBe(0)
    })


    test('parameters of method', () => {
        const explorer = getExplorer('method1(parameter1, parameter2) {}')
        const parameters = explorer.parameters

        expect(parameters.length).toBe(2)
        expect(parameters[0]).toBeInstanceOf(ParameterExplorer)
        expect(parameters[0].name).toBe('parameter1')
    })

    test('bionicTag', () => {
        const explorer = getExplorer('/* @bionic */ method1() {}')
        expect(explorer.bionicTag).toEqual({})
    })

    test('description', () => {
        const explorer = getExplorer('/* @desc desc */ method1() {}')
        expect(explorer.description).toEqual('desc')
    })


    const typeAnnotation = '/* @bionic (par1: Int) */ method1() {}'
    const expectedType = new LambdaType(new VoidType(), [new Parameter(new IntType(), 'par1', undefined)])

    test('type', () => {
        const explorer = getExplorer(typeAnnotation)
        const actualType = explorer.type

        expect(actualType).toEqual(expectedType)
        expect(explorer.type).toBe(actualType)
    })

    test('signature', () => {
        const explorer = getExplorer(typeAnnotation)
        const actualSignature = explorer.signature

        expect(actualSignature).toEqual(expectedType)
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